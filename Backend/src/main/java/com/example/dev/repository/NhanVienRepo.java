package com.example.dev.repository;

import com.example.dev.entity.nhanvien.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepo extends JpaRepository<NhanVien, Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE NhanVien nv SET nv.ten = :tenNhanVien, nv.gioiTinh = :gioiTinh, nv.ngaySinh = :ngaySinh, " +
            "nv.soDienThoai = :soDienThoai, nv.email = :email, nv.vaiTro = :vaiTro, nv.trangThai = :trangThai, " +
            "nv.hinh_anh = :hinhAnh, nv.cccd = :cccd , nv.diachi=:diachi " +
            "WHERE nv.idNhanVien = :idNhanVien")
    void updateNhanVien(@Param("tenNhanVien") String tenNhanVien,
                        @Param("gioiTinh") String gioiTinh,
                        @Param("ngaySinh") LocalDate ngaySinh,
                        @Param("soDienThoai") String soDienThoai,
                        @Param("email") String email,
                        @Param("vaiTro") String vaiTro,
                        @Param("trangThai") Boolean trangThai,
                        @Param("hinhAnh") String hinhAnh,
                        @Param("cccd") String cccd,
                        @Param("diachi") String diachi,
                        @Param("idNhanVien") Integer idNhanVien);

    // Tìm kiếm theo nhiều tiêu chí
    @Query("SELECT nv FROM NhanVien nv WHERE (:ten IS NULL OR nv.ten LIKE %:ten%) " +
            "AND (:soDienThoai IS NULL OR nv.soDienThoai = :soDienThoai) " +
            "AND (:trangThai IS NULL OR nv.trangThai = :trangThai) " +
            "AND (:ngaySinh IS NULL OR nv.ngaySinh = :ngaySinh)")
    List<NhanVien> searchEmployees(@Param("ten") String ten,
                                   @Param("soDienThoai") String soDienThoai,
                                   @Param("trangThai") Boolean trangThai,
                                   @Param("ngaySinh") LocalDate ngaySinh);


    @Query("SELECT nv FROM NhanVien nv WHERE (:ten IS NULL OR nv.ten LIKE %:ten%) " +
            "AND (:soDienThoai IS NULL OR nv.soDienThoai = :soDienThoai) " +
            "AND (:trangThai IS NULL OR nv.trangThai = :trangThai) " +
            "AND (:ngaySinh IS NULL OR nv.ngaySinh = :ngaySinh)")
    Page<NhanVien> searchEmployees(
            @Param("ten") String ten,
            @Param("soDienThoai") String soDienThoai,
            @Param("trangThai") Boolean trangThai,
            @Param("ngaySinh") LocalDate ngaySinh,
            Pageable pageable);

    Optional<NhanVien> findBySoDienThoai(String soDienThoai);
    Optional<NhanVien> findByEmail(String email);
    Optional<NhanVien> findByCccd(String cccd);
}


