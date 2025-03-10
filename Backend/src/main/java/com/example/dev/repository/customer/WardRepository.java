package com.example.dev.repository.customer;


import com.example.dev.entity.customer.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {
     @Query(value = "SELECT * FROM [dbo].[Ward] d WHERE d.district_id = ?1", nativeQuery = true)
     List<Ward> findWardByDistrictId(int DistrictId);
}
