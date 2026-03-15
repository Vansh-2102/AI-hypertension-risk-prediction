package com.predictivepulse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.predictivepulse.dto.PatientRequest;
import com.predictivepulse.dto.PredictionResponse;
import com.predictivepulse.entity.Prediction;
import com.predictivepulse.repository.PredictionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PredictionService(PredictionRepository predictionRepository, RestTemplate restTemplate) {
        this.predictionRepository = predictionRepository;
        this.restTemplate = restTemplate;
    }

    private static final String ML_SERVICE_URL = "http://localhost:8000/predict";

    @Transactional
    public PredictionResponse getPrediction(PatientRequest req) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("age", req.getAge());
        payload.put("bmi", req.getBmi());
        payload.put("systolic_bp", req.getSystolicBp());
        payload.put("diastolic_bp", req.getDiastolicBp());
        payload.put("cholesterol", req.getCholesterol());
        payload.put("smoking", req.getSmoking() ? 1 : 0);
        payload.put("diabetes", req.getDiabetes() ? 1 : 0);

        String risk;
        double confidence;
        try {
            String response = restTemplate.postForObject(ML_SERVICE_URL, payload, String.class);
            if (response == null || response.isEmpty()) {
                throw new RuntimeException("Empty response from ML service");
            }
            JsonNode root = objectMapper.readTree(response);
            risk = root.path("risk").asText();
            if (risk == null || risk.isEmpty()) {
                throw new RuntimeException("Invalid response from ML service: missing 'risk' field");
            }
            confidence = root.path("confidence").asDouble();
            if (Double.isNaN(confidence)) {
                throw new RuntimeException("Invalid response from ML service: missing or invalid 'confidence' field");
            }
        } catch (HttpServerErrorException e) {
            throw new RuntimeException("ML service error: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to call ML service: " + e.getMessage(), e);
        }

        String insight;
        if ("High".equalsIgnoreCase(risk)) {
            insight = "Consult a cardiologist immediately. Monitor BP daily and consider medication evaluation.";
        } else {
            insight = "BP is within normal range. Maintain healthy diet and regular exercise routine.";
        }

        Prediction prediction = new Prediction();
        prediction.setAge(req.getAge());
        prediction.setBmi(req.getBmi());
        prediction.setSystolicBp(req.getSystolicBp());
        prediction.setDiastolicBp(req.getDiastolicBp());
        prediction.setCholesterol(req.getCholesterol());
        prediction.setSmoking(req.getSmoking());
        prediction.setDiabetes(req.getDiabetes());
        prediction.setRiskLevel(risk);
        prediction.setConfidence(confidence);
        prediction.setInsight(insight);

        predictionRepository.save(prediction);

        return new PredictionResponse(risk, confidence, insight);
    }

    public List<Prediction> getHistory() {
        return predictionRepository.findAllByOrderByCreatedAtDesc();
    }
}

