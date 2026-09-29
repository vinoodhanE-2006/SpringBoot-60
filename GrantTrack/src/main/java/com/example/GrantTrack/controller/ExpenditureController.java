package com.example.GrantTrack.controller;

import com.example.GrantTrack.entity.Expenditure;
import com.example.GrantTrack.service.ExpenditureService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ExpenditureController {

    private final ExpenditureService expenditureService;

    public ExpenditureController(
            ExpenditureService expenditureService) {

        this.expenditureService = expenditureService;
    }

    @PostMapping("/{applicationId}/expenditures")
    public ResponseEntity<Expenditure> addExpenditure(
            @PathVariable Long applicationId,
            @Valid @RequestBody Expenditure expenditure) {

        return new ResponseEntity<>(
                expenditureService.addExpenditure(
                        applicationId,
                        expenditure
                ),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{applicationId}/expenditures")
    public ResponseEntity<List<Expenditure>> getApplicationExpenditures(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                expenditureService.getApplicationExpenditures(
                        applicationId
                )
        );
    }

    @GetMapping("/{applicationId}/expenditures/total")
    public ResponseEntity<BigDecimal> getTotalExpenditure(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                expenditureService.getTotalExpenditure(
                        applicationId
                )
        );
    }
}