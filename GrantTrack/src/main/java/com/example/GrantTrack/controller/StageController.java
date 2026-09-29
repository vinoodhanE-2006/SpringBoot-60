package com.example.GrantTrack.controller;

import com.example.GrantTrack.entity.Stage;
import com.example.GrantTrack.service.StageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class StageController {

    private final StageService stageService;

    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    @PutMapping("/{applicationId}/stage")
    public ResponseEntity<Stage> moveApplicationToStage(
            @PathVariable Long applicationId,
            @RequestParam String status,
            @RequestParam(required = false) String remarks) {

        return ResponseEntity.ok(
                stageService.moveApplicationToStage(
                        applicationId,
                        status,
                        remarks
                )
        );
    }

    @GetMapping("/{applicationId}/stages")
    public ResponseEntity<List<Stage>> getApplicationStages(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                stageService.getApplicationStages(
                        applicationId
                )
        );
    }
}