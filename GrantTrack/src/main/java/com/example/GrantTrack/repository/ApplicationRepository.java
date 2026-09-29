package com.example.GrantTrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.GrantTrack.entity.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUtilizationDeadlineBetween(
            LocalDate startDate,
            LocalDate endDate
    );

}