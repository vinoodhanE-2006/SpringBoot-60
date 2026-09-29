package com.example.GrantTrack.service;

import com.example.GrantTrack.entity.Application;
import com.example.GrantTrack.entity.Stage;

import com.example.GrantTrack.exception.BusinessRuleException;
import com.example.GrantTrack.exception.ResourceNotFoundException;

import com.example.GrantTrack.repository.ApplicationRepository;
import com.example.GrantTrack.repository.StageRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StageService {

    private final StageRepository stageRepository;
    private final ApplicationRepository applicationRepository;

    public StageService(
            StageRepository stageRepository,
            ApplicationRepository applicationRepository) {

        this.stageRepository = stageRepository;
        this.applicationRepository = applicationRepository;
    }

    // Move Application to a new Stage
    public Stage moveApplicationToStage(
            Long applicationId,
            String status,
            String remarks) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + applicationId
                                )
                        );

        // Validate stage
        if (!isValidStatus(status)) {

            throw new BusinessRuleException(
                    "Invalid stage. Allowed stages are: "
                            + "SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED"
            );
        }

        // Approved amount is required before approval
        if ("APPROVED".equals(status)
                && application.getApprovedAmount() == null) {

            throw new BusinessRuleException(
                    "Approved amount must be set before approving the application"
            );
        }

        Stage stage = new Stage();

        stage.setStatus(status);
        stage.setRemarks(remarks);
        stage.setStageDate(LocalDateTime.now());
        stage.setApplication(application);

        return stageRepository.save(stage);
    }

    // Get complete stage history
    public List<Stage> getApplicationStages(
            Long applicationId) {

        applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + applicationId
                        )
                );

        return stageRepository
                .findByApplicationIdOrderByStageDateDesc(
                        applicationId
                );
    }

    // Validate stage
    private boolean isValidStatus(String status) {

        return "SUBMITTED".equals(status)
                || "UNDER_REVIEW".equals(status)
                || "APPROVED".equals(status)
                || "REJECTED".equals(status);
    }
}