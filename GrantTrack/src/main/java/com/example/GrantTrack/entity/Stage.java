package com.example.GrantTrack.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "application_stages")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Stage status is required")
    private String status;

    private String remarks;

    private LocalDateTime stageDate;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private Application application;

    public Stage() {
    }

    public Stage(String status, String remarks,
                 LocalDateTime stageDate, Application application) {
        this.status = status;
        this.remarks = remarks;
        this.stageDate = stageDate;
        this.application = application;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getStageDate() {
        return stageDate;
    }

    public void setStageDate(LocalDateTime stageDate) {
        this.stageDate = stageDate;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }
}