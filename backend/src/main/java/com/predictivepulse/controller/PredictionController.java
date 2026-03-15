package com.predictivepulse.controller;

import com.predictivepulse.dto.PatientRequest;
import com.predictivepulse.dto.PredictionResponse;
import com.predictivepulse.entity.Prediction;
import com.predictivepulse.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/predict")
    public PredictionResponse predict(@RequestBody @Valid PatientRequest request) {
        return predictionService.getPrediction(request);
    }

    @GetMapping("/history")
    public List<Prediction> history() {
        return predictionService.getHistory();
    }
}

