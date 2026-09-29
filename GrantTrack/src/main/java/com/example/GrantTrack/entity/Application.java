package com.example.GrantTrack.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "grant_applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Application title is required")
    private String title;

    @NotNull(message = "Requested amount is required")
    @Positive(message = "Requested amount must be greater than zero")
    private BigDecimal requestedAmount;

    @NotBlank(message = "Abstract is required")
    private String abstractText;

    @Positive(message = "Approved amount must be greater than zero")
    private BigDecimal approvedAmount;

    private LocalDate utilizationDeadline;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Stage> stages = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<Expenditure> expenditures = new ArrayList<>();

    public Application() {
    }

    public Application(String title, BigDecimal requestedAmount,
                       String abstractText, Faculty faculty) {
        this.title = title;
        this.requestedAmount = requestedAmount;
        this.abstractText = abstractText;
        this.faculty = faculty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public BigDecimal getApprovedAmount() {
        return approvedAmount;
    }

    public void setApprovedAmount(BigDecimal approvedAmount) {
        this.approvedAmount = approvedAmount;
    }

    public LocalDate getUtilizationDeadline() {
        return utilizationDeadline;
    }

    public void setUtilizationDeadline(LocalDate utilizationDeadline) {
        this.utilizationDeadline = utilizationDeadline;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public List<Stage> getStages() {
        return stages;
    }

    public void setStages(List<Stage> stages) {
        this.stages = stages;
    }

    public List<Expenditure> getExpenditures() {
        return expenditures;
    }

    public void setExpenditures(List<Expenditure> expenditures) {
        this.expenditures = expenditures;
    }
}