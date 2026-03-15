package com.predictivepulse.dto;

public class PredictionResponse {

    private String riskLevel;
    private Double confidence;
    private String insight;

    public PredictionResponse() {
    }

    public PredictionResponse(String riskLevel, Double confidence, String insight) {
        this.riskLevel = riskLevel;
        this.confidence = confidence;
        this.insight = insight;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getInsight() {
        return insight;
    }

    public void setInsight(String insight) {
        this.insight = insight;
    }
}

