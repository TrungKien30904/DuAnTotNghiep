package com.example.dev.entity.cart;

public class CartItem {
    private Integer productId;  // idChiTietSanPham
    private int soLuong;

    public CartItem() {
    }

    public CartItem(Integer productId, int soLuong) {
        this.productId = productId;
        this.soLuong = soLuong;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public int getSoLuong() {
        return soLuong;
    }

    public void setSoLuong(int soLuong) {
        this.soLuong = soLuong;
    }
}
