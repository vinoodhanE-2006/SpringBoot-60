package com.example.GrantTrack.service;

import com.example.GrantTrack.entity.Application;
import com.example.GrantTrack.entity.Faculty;
import com.example.GrantTrack.entity.Stage;

import com.example.GrantTrack.exception.ResourceNotFoundException;

import com.example.GrantTrack.repository.ApplicationRepository;
import com.example.GrantTrack.repository.FacultyRepository;
import com.example.GrantTrack.repository.StageRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final FacultyRepository facultyRepository;
    private final StageRepository stageRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            FacultyRepository facultyRepository,
            StageRepository stageRepository) {

        this.applicationRepository = applicationRepository;
        this.facultyRepository = facultyRepository;
        this.stageRepository = stageRepository;
    }

    // Create Application
    public Application createApplication(
            Application application,
            Long facultyId) {

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Faculty not found with id: "
                                        + facultyId
                        )
                );

        application.setFaculty(faculty);

        Application savedApplication =
                applicationRepository.save(application);

        // Automatically create initial SUBMITTED stage
        Stage initialStage = new Stage();

        initialStage.setStatus("SUBMITTED");
        initialStage.setRemarks("Application submitted");
        initialStage.setStageDate(LocalDateTime.now());
        initialStage.setApplication(savedApplication);

        stageRepository.save(initialStage);

        return savedApplication;
    }

    // Get all Applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Get Application by ID
    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + id
                        )
                );
    }

    // Update Application
    public Application updateApplication(
            Long id,
            Application updatedApplication) {

        Application existingApplication =
                getApplicationById(id);

        existingApplication.setTitle(
                updatedApplication.getTitle()
        );

        existingApplication.setRequestedAmount(
                updatedApplication.getRequestedAmount()
        );

        existingApplication.setAbstractText(
                updatedApplication.getAbstractText()
        );

        existingApplication.setApprovedAmount(
                updatedApplication.getApprovedAmount()
        );

        existingApplication.setUtilizationDeadline(
                updatedApplication.getUtilizationDeadline()
        );

        return applicationRepository.save(
                existingApplication
        );
    }

    // Delete Application
    public void deleteApplication(Long id) {

        Application application =
                getApplicationById(id);

        applicationRepository.delete(application);
    }

    // Find Applications near utilization deadline
    public List<Application> getApplicationsNearDeadline(
            LocalDate startDate,
            LocalDate endDate) {

        return applicationRepository
                .findByUtilizationDeadlineBetween(
                        startDate,
                        endDate
                );
    }
}