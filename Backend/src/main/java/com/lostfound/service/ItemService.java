package com.lostfound.service;

import com.lostfound.dto.ItemDTO;
import com.lostfound.entity.Item;
import com.lostfound.entity.ItemStatus;
import com.lostfound.entity.User;
import com.lostfound.repository.ItemRepository;
import com.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public ItemDTO createItem(ItemDTO itemDTO, Long userId) {
        // Validate required fields
        if (itemDTO.getTitle() == null || itemDTO.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (itemDTO.getLocation() == null || itemDTO.getLocation().trim().isEmpty()) {
            throw new RuntimeException("Location is required");
        }
        if (itemDTO.getContactInfo() == null || itemDTO.getContactInfo().trim().isEmpty()) {
            throw new RuntimeException("Contact information is required");
        }
        if (itemDTO.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }
        
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Item item = new Item();
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setLocation(itemDTO.getLocation());
        item.setStatus(itemDTO.getStatus());
        item.setImageData(itemDTO.getImageData());
        item.setReportedDate(itemDTO.getReportedDate() != null ? itemDTO.getReportedDate() : LocalDateTime.now());
        item.setContactInfo(itemDTO.getContactInfo());
        item.setUser(user.get());

        Item savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getItemsByStatus(String status) {
        try {
            ItemStatus itemStatus = ItemStatus.valueOf(status.toUpperCase());
            return itemRepository.findByStatusOrderByCreatedAtDesc(itemStatus)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public Optional<ItemDTO> getItemById(Long id) {
        return itemRepository.findById(id).map(this::convertToDTO);
    }

    public ItemDTO updateItem(Long id, ItemDTO itemDTO) {
        Optional<Item> existing = itemRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Item not found");
        }

        Item item = existing.get();
        item.setTitle(itemDTO.getTitle());
        item.setDescription(itemDTO.getDescription());
        item.setLocation(itemDTO.getLocation());
        item.setStatus(itemDTO.getStatus());
        if (itemDTO.getImageData() != null) {
            item.setImageData(itemDTO.getImageData());
        }
        item.setContactInfo(itemDTO.getContactInfo());

        Item updated = itemRepository.save(item);
        return convertToDTO(updated);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<ItemDTO> searchByTitle(String title) {
        return itemRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> searchByLocation(String location) {
        return itemRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ItemDTO convertToDTO(Item item) {
        return new ItemDTO(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getLocation(),
                item.getStatus(),
                item.getImageData(),
                item.getReportedDate(),
                item.getCreatedAt(),
                item.getContactInfo()
        );
    }
}
