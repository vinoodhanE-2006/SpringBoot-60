package com.example.GrantTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.GrantTrack.entity.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

}