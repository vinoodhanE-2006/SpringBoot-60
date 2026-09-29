package com.example.GrantTrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.GrantTrack.entity.Stage;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {

    List<Stage> findByApplicationIdOrderByStageDateDesc(Long applicationId);

}