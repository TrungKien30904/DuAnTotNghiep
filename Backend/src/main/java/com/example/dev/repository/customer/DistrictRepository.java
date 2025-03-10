package com.example.dev.repository.customer;

import com.example.dev.entity.customer.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {

     @Query(value = "SELECT * FROM [dbo].[District] d WHERE d.province_id = ?1", nativeQuery = true)
     List<District> findDistrictByProvinceId(int ProvinceId);

}
