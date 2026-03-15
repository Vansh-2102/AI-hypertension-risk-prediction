package com.predictivepulse.repository;

import com.predictivepulse.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findAllByOrderByCreatedAtDesc();
}

