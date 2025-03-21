package com.example.dev.repository.customer;

import com.example.dev.entity.custom_entity.AddressModelCustom;
import com.example.dev.entity.customer.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepo extends JpaRepository<DiaChi, Integer> {
    List<DiaChi> findDiaChiByIdKhachHang(Integer idKhachHang);
    @Query(value = "select * from dia_chi where thanh_pho in ?1 and quan_huyen in ?2 and xa_phuong in ?3 and id_khach_hang = ?4", nativeQuery = true)
    List<DiaChi> getExistAddressByInfor(List<Long> provinceId, List<Long> districtId, List<Long> wardIds, Integer customerId);
    @Query(value = "select * from dia_chi d where d.stage =1 and d.id_khach_hang in ?1", nativeQuery = true)
    List<DiaChi> getByCustomerId(List<Integer> customerIds);
    DiaChi findByIdKhachHangAndMacDinhTrue(Integer idKhachHang);
}
