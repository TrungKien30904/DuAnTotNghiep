package com.example.dev.repository;

import com.example.dev.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public interface HinhAnhRepo extends JpaRepository<HinhAnh,String> {
    @Query(value = """
        select ha.id_hinh_anh from chi_tiet_san_pham ctsp 
        left join hinh_anh ha on ha.id_mau_sac = ctsp.id_mau_sac and ha.id_san_pham = ctsp.id_san_pham 
        where id_hinh_anh like %'cenndiii_shop/'+:idSanPham+'/'+:tenMau+'/'% 
""",nativeQuery = true)
    List<String> publicId(@Param("idSanPham") String idSanPham, @Param("tenMau") String tenMau);

    @Query(value = """
        select ha.lien_ket from chi_tiet_san_pham ctsp 
        left join hinh_anh ha on ha.id_mau_sac = ctsp.id_mau_sac and ha.id_san_pham = ctsp.id_san_pham 
        where ctsp.id_chi_tiet_san_pham = :idChiTietSanPham 
""",nativeQuery = true)
    List<String> listURl (Integer idChiTietSanPham);


}
