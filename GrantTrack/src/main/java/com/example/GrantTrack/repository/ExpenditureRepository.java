package com.example.GrantTrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.GrantTrack.entity.Expenditure;

@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {

    List<Expenditure> findByApplicationId(Long applicationId);

}