package com.lostfound.repository;

import com.lostfound.entity.Item;
import com.lostfound.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByStatus(ItemStatus status);
    List<Item> findByStatusOrderByCreatedAtDesc(ItemStatus status);
    List<Item> findAllByOrderByCreatedAtDesc();
    List<Item> findByLocationContainingIgnoreCase(String location);
    List<Item> findByTitleContainingIgnoreCase(String title);
    
    // Claim-related queries
    List<Item> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, ItemStatus status);
    
    List<Item> findByStatusAndUserIdOrderByCreatedAtDesc(ItemStatus status, Long userId);
    
    List<Item> findByClaimantIdAndStatusOrderByCreatedAtDesc(Long claimantId, ItemStatus status);
}
