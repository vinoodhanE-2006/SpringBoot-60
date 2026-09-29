package com.example.GrantTrack.controller;

import com.example.GrantTrack.entity.Faculty;
import com.example.GrantTrack.service.FacultyService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PostMapping
    public ResponseEntity<Faculty> createFaculty(
            @Valid @RequestBody Faculty faculty) {

        return new ResponseEntity<>(
                facultyService.createFaculty(faculty),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Faculty> updateFaculty(
            @PathVariable Long id,
            @Valid @RequestBody Faculty faculty) {

        return ResponseEntity.ok(
                facultyService.updateFaculty(id, faculty)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFaculty(
            @PathVariable Long id) {

        facultyService.deleteFaculty(id);

        return ResponseEntity.ok(
                "Faculty deleted successfully"
        );
    }
}