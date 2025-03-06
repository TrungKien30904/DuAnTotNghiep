package com.example.dev.repository.customer;


import com.example.dev.entity.customer.DiaChi;
import com.example.dev.entity.custom_entity.AddressModelCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepo extends JpaRepository<DiaChi, Integer> {
    List<DiaChi> findDiaChiByIdKhachHang(Integer idKhachHang);
    @Query(value = "select * from dia_chi where thanh_pho in ?1 and quan_huyen in ?2 and xa_phuong in ?3 and id_khach_hang = ?4", nativeQuery = true)
    List<DiaChi> getExistAddressByInfor(List<Long> provinceId, List<Long> districtId, List<Long> wardIds, Integer customerId);
    @Query(value = "select d.id_khach_hang as id , d.ten_nguoi_nhan as fullName, p.Id as provinceId, p.[Name] as provinceName, district.Id as districtId, district.[Name] as districtName, w.Id as wardId, w.[Name] as wardName, d.dia_chi_chi_tiet as addressDetail from dia_chi d inner join District district on d.quan_huyen = district.Id\n" +
            " inner join Province p on d.thanh_pho = p.id\n" +
            " inner join Ward w on d.xa_phuong = w.Id where d.id_khach_hang in ?1 and mac_dinh = 1 and stage = 1", nativeQuery = true)
    List<AddressModelCustom> getByCustomerId(List<Integer> customerIds);
}
