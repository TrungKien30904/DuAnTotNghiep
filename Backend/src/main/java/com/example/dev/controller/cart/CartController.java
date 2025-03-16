package com.example.dev.controller.cart;

import com.example.dev.DTO.response.cart.CartItemResponseDTO;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.HinhAnh;
import com.example.dev.entity.cart.CartItem;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.HinhAnhRepo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final String CART_SESSION_KEY = "cart";

    @Autowired
    private ChiTietSanPhamRepo chiTietSanPhamRepository;
    @Autowired
    private HinhAnhRepo hinhAnhRepo;


    @SuppressWarnings("unchecked")
    private List<CartItem> getCart(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    @GetMapping("/count")
    public int getCartItemCount(HttpSession session) {
        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        return cart == null ? 0 : cart.size();
    }


    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody CartItem item, HttpSession session) {
        List<CartItem> cart = getCart(session);

        // Nếu đã có sản phẩm thì cộng dồn số lượng
        boolean isExist = false;
        for (CartItem ci : cart) {
            if (ci.getProductId().equals(item.getProductId())) {
                ci.setSoLuong(ci.getSoLuong() + item.getSoLuong());
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            cart.add(item);
        }

        session.setAttribute(CART_SESSION_KEY, cart);
        return ResponseEntity.ok("Sản phẩm đã được thêm vào giỏ hàng");
    }

    @GetMapping
    public ResponseEntity<?> getCartItems(HttpSession session) {
        List<CartItem> cart = getCart(session);

        List<CartItemResponseDTO> response = cart.stream().map(item -> {
            ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(item.getProductId()).orElse(null);
            if (chiTiet == null) return null;

            CartItemResponseDTO dto = new CartItemResponseDTO();
            dto.setProductId(chiTiet.getIdChiTietSanPham());
            dto.setTenSanPham(chiTiet.getSanPham().getTen());
            dto.setGia(chiTiet.getGia().intValue());
            dto.setSoLuong(item.getSoLuong());
            dto.setTrangThai(chiTiet.getTrangThai() != null && chiTiet.getTrangThai() ? "Còn hàng" : "Hết hàng");
            dto.setMauSac(chiTiet.getMauSac().getTen());
            dto.setKichCo(chiTiet.getKichCo().getTen());

            List<String> imageUrls = hinhAnhRepo.listURl(chiTiet.getIdChiTietSanPham());
            if (!imageUrls.isEmpty()) {
                dto.setImg(imageUrls.get(0));
            }

            return dto;
        }).filter(Objects::nonNull).toList();

        return ResponseEntity.ok(response);
    }


    @PostMapping("/update")
    public ResponseEntity<?> updateCart(@RequestBody List<CartItem> updatedCart, HttpSession session) {
        session.setAttribute(CART_SESSION_KEY, updatedCart);
        return ResponseEntity.ok("Giỏ hàng đã được cập nhật");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestBody CartItem item, HttpSession session) {
        List<CartItem> cart = getCart(session);
        cart.removeIf(ci -> ci.getProductId().equals(item.getProductId()));
        session.setAttribute(CART_SESSION_KEY, cart);
        return ResponseEntity.ok("Đã xóa sản phẩm khỏi giỏ hàng");
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearCart(HttpSession session) {
        session.removeAttribute(CART_SESSION_KEY);
        return ResponseEntity.ok("Đã xóa toàn bộ giỏ hàng");
    }
}
