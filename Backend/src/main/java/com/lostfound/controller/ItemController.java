package com.lostfound.controller;

import com.lostfound.dto.ItemDTO;
import com.lostfound.dto.ErrorResponse;
import com.lostfound.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ItemController {
    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        List<ItemDTO> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ItemDTO>> getItemsByStatus(@PathVariable String status) {
        try {
            List<ItemDTO> items = itemService.getItemsByStatus(status);
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        Optional<ItemDTO> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody ItemDTO itemDTO) {
        try {
            // For now, using userId = 1 (should come from authenticated user)
            ItemDTO created = itemService.createItem(itemDTO, 1L);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable Long id, @RequestBody ItemDTO itemDTO) {
        try {
            ItemDTO updated = itemService.updateItem(id, itemDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<ItemDTO>> searchByTitle(@RequestParam String q) {
        List<ItemDTO> items = itemService.searchByTitle(q);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<ItemDTO>> searchByLocation(@RequestParam String q) {
        List<ItemDTO> items = itemService.searchByLocation(q);
        return ResponseEntity.ok(items);
    }
}
