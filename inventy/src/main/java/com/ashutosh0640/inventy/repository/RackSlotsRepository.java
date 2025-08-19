package com.ashutosh0640.inventy.repository;


import com.ashutosh0640.inventy.entity.RackSlots;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface RackSlotsRepository extends JpaRepository<RackSlots, Long> {

    @Query("SELECT count(s) FROM RackSlots s WHERE s.rack.id = :rackId AND s.slotNumber = :slotNumber AND s.status = 'EMPTY'")
    Long getRackEmptySlotNumber(@Param("rackId") Long rackId, @Param("slotNumber") Short slotNumber);


    @Query("SELECT s from RackSlots s WHERE s.rack.id = :rackId")
    List<RackSlots> getSlotsByRack(@Param("rackId") Long rackId);

    @Modifying
    @Transactional
    @Query(value = """
    UPDATE rack_slots 
    SET host_id = :hostId, status = 'OCCUPIED' 
    WHERE rack_id = :rackId AND slot_number = :slotNumber""", nativeQuery = true)
    void assignHostToSlot(
            @Param("hostId") Long hostId,
            @Param("rackId") Long rackId,
            @Param("slotNumber") Short slotNumber
    );

    @Modifying
    @Transactional
    @Query(value = """
    UPDATE rack_slots 
    SET host_id = NULL, status = 'EMPTY' 
    WHERE rack_id = :rackId AND slot_number = :slotNumber""", nativeQuery = true)
    void removeHostFromSlot(
            @Param("rackId") Long rackId,
            @Param("slotNumber") Short slotNumber
    );

}
