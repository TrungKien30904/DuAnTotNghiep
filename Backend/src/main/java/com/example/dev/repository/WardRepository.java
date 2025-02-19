package com.example.dev.repository;

import com.example.dev.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {
     @Query(value = "SELECT * FROM [dbo].[Ward] d WHERE d.DistrictId = ?1", nativeQuery = true)
     List<Ward> findWardByDistrictId(int DistrictId);
}
