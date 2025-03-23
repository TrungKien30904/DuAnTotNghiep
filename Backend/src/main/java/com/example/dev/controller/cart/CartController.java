package com.example.dev.controller.cart;

import com.example.dev.DTO.request.ChiTietSanPham.ChiTietSanPhamRequest;
import com.example.dev.DTO.request.DotGiamGia.SpGiamGiaRequest;
import com.example.dev.DTO.response.cart.CartItemResponseDTO;
import com.example.dev.entity.ChiTietSanPham;
import com.example.dev.entity.HinhAnh;
import com.example.dev.entity.cart.CartItem;
import com.example.dev.repository.ChiTietSanPhamRepo;
import com.example.dev.repository.HinhAnhRepo;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final String CART_SESSION_KEY = "cart";
    private static final String VOUCHER_SESSION_KEY = "selectedVoucherId";


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
            SpGiamGiaRequest ctsp = chiTietSanPhamRepository.getSanPhamGiamGia(item.getProductId()).get(0);
            if (ctsp == null) return null;

            CartItemResponseDTO dto = new CartItemResponseDTO();
            dto.setProductId(ctsp.getIdChiTietSanPham());
            dto.setTenSanPham(ctsp.getSanPham());
            dto.setGia(ctsp.getGiaSauGiam().intValue());
            dto.setSoLuong(item.getSoLuong());
            dto.setTrangThai(ctsp.getTrangThai() != null && ctsp.getTrangThai() ? "Còn hàng" : "Hết hàng");
            dto.setMauSac(ctsp.getMauSac());
            dto.setKichCo(ctsp.getKichCo());
            dto.setStock(ctsp.getSoLuong()); // Trả về số lượng tồn kho

            List<String> imageUrls = hinhAnhRepo.listURl(ctsp.getIdChiTietSanPham());
            if (!imageUrls.isEmpty()) {
                dto.setImg(imageUrls.get(0));
            }

            return dto;
        }).filter(Objects::nonNull).toList();

        return ResponseEntity.ok(response);
    }



    @PostMapping("/update")
    public ResponseEntity<?> updateCart(@RequestBody List<CartItem> updatedCart, HttpSession session) {
        List<CartItem> cart = getCart(session);

        for (CartItem updatedItem : updatedCart) {
            for (CartItem cartItem : cart) {
                if (cartItem.getProductId().equals(updatedItem.getProductId())) {
                    cartItem.setSoLuong(updatedItem.getSoLuong()); // Cập nhật số lượng đúng
                }
            }
        }

        session.setAttribute(CART_SESSION_KEY, cart); // Lưu lại giỏ hàng đã cập nhật
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

    @PostMapping("/set-select-voucher")
    public ResponseEntity<?> setSelectedVoucher(@RequestBody Integer voucherId, HttpSession session) {
        session.setAttribute(VOUCHER_SESSION_KEY, voucherId);
        return ResponseEntity.ok("Đã lưu phiếu giảm giá vào session");
    }

    @GetMapping("/get-select-voucher")
    public ResponseEntity<?> getSelectedVoucher(HttpSession session) {
        Integer voucherId = (Integer) session.getAttribute(VOUCHER_SESSION_KEY);
        return ResponseEntity.ok(voucherId);
    }

    @PostMapping("/remove-voucher")
    public ResponseEntity<?> removeSelectedVoucher(HttpSession session) {
        session.removeAttribute("selectedVoucherId");
        return ResponseEntity.ok("Đã xóa phiếu giảm giá khỏi session");
    }



}
