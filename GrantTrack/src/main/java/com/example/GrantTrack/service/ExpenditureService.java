package com.example.GrantTrack.service;

import com.example.GrantTrack.entity.Application;
import com.example.GrantTrack.entity.Expenditure;
import com.example.GrantTrack.entity.Stage;

import com.example.GrantTrack.exception.BusinessRuleException;
import com.example.GrantTrack.exception.ResourceNotFoundException;

import com.example.GrantTrack.repository.ApplicationRepository;
import com.example.GrantTrack.repository.ExpenditureRepository;
import com.example.GrantTrack.repository.StageRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final ApplicationRepository applicationRepository;
    private final StageRepository stageRepository;

    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            ApplicationRepository applicationRepository,
            StageRepository stageRepository) {

        this.expenditureRepository = expenditureRepository;
        this.applicationRepository = applicationRepository;
        this.stageRepository = stageRepository;
    }

    // Add Expenditure
    public Expenditure addExpenditure(
            Long applicationId,
            Expenditure expenditure) {

        // Check application exists
        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + applicationId
                                )
                        );

        // Get stage history
        List<Stage> stages =
                stageRepository
                        .findByApplicationIdOrderByStageDateDesc(
                                applicationId
                        );

        // Application must have a stage
        if (stages.isEmpty()) {

            throw new BusinessRuleException(
                    "Application does not have any stage"
            );
        }

        // Latest stage is the current stage
        Stage currentStage = stages.get(0);

        // Expenditure only allowed for APPROVED application
        if (!"APPROVED".equals(currentStage.getStatus())) {

            throw new BusinessRuleException(
                    "Expenditure can be recorded only for approved applications"
            );
        }

        // Approved amount must exist
        if (application.getApprovedAmount() == null) {

            throw new BusinessRuleException(
                    "Approved amount is not set for this application"
            );
        }

        // Calculate existing expenditure
        BigDecimal existingTotal =
                expenditureRepository
                        .findByApplicationId(applicationId)
                        .stream()
                        .map(Expenditure::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        // Calculate new total
        BigDecimal newTotal =
                existingTotal.add(
                        expenditure.getAmount()
                );

        // Check approved budget
        if (newTotal.compareTo(
                application.getApprovedAmount()) > 0) {

            throw new BusinessRuleException(
                    "Expenditure exceeds the approved grant amount. "
                            + "Approved amount: "
                            + application.getApprovedAmount()
                            + ", Existing expenditure: "
                            + existingTotal
                            + ", Requested expenditure: "
                            + expenditure.getAmount()
            );
        }

        // Connect expenditure with application
        expenditure.setApplication(application);

        // Automatically set date if not provided
        if (expenditure.getExpenditureDate() == null) {

            expenditure.setExpenditureDate(
                    LocalDate.now()
            );
        }

        return expenditureRepository.save(
                expenditure
        );
    }

    // Get all expenditures of an application
    public List<Expenditure> getApplicationExpenditures(
            Long applicationId) {

        applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + applicationId
                        )
                );

        return expenditureRepository
                .findByApplicationId(applicationId);
    }

    // Calculate total expenditure
    public BigDecimal getTotalExpenditure(
            Long applicationId) {

        applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + applicationId
                        )
                );

        return expenditureRepository
                .findByApplicationId(applicationId)
                .stream()
                .map(Expenditure::getAmount)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );
    }
}