package com.example.GrantTrack.controller;

import com.example.GrantTrack.entity.Application;
import com.example.GrantTrack.service.ApplicationService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(
            @RequestParam Long facultyId,
            @Valid @RequestBody Application application) {

        return new ResponseEntity<>(
                applicationService.createApplication(
                        application,
                        facultyId
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {

        return ResponseEntity.ok(
                applicationService.getAllApplications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody Application application) {

        return ResponseEntity.ok(
                applicationService.updateApplication(
                        id,
                        application
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long id) {

        applicationService.deleteApplication(id);

        return ResponseEntity.ok(
                "Application deleted successfully"
        );
    }

    @GetMapping("/deadline")
    public ResponseEntity<List<Application>> getApplicationsNearDeadline(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        return ResponseEntity.ok(
                applicationService.getApplicationsNearDeadline(
                        startDate,
                        endDate
                )
        );
    }
}