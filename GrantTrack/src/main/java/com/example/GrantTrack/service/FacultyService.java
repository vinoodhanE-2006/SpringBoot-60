package com.example.GrantTrack.service;

import com.example.GrantTrack.entity.Faculty;
import com.example.GrantTrack.exception.ResourceNotFoundException;
import com.example.GrantTrack.repository.FacultyRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    // Create Faculty
    public Faculty createFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    // Get all Faculty
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    // Get Faculty by ID
    public Faculty getFacultyById(Long id) {

        return facultyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Faculty not found with id: " + id
                        )
                );
    }

    // Update Faculty
    public Faculty updateFaculty(
            Long id,
            Faculty updatedFaculty) {

        Faculty existingFaculty = getFacultyById(id);

        existingFaculty.setName(updatedFaculty.getName());
        existingFaculty.setEmail(updatedFaculty.getEmail());
        existingFaculty.setDepartment(
                updatedFaculty.getDepartment()
        );

        return facultyRepository.save(existingFaculty);
    }

    // Delete Faculty
    public void deleteFaculty(Long id) {

        Faculty faculty = getFacultyById(id);

        facultyRepository.delete(faculty);
    }
}