package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.RackSlots;
import com.ashutosh0640.inventy.repository.RackSlotsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RackSlotsService {

    private final RackSlotsRepository rackSlotsRepository;

    public RackSlotsService(RackSlotsRepository rackSlotsRepository) {
        this.rackSlotsRepository = rackSlotsRepository;
    }

    public void save(RackSlots slots) {
        rackSlotsRepository.save(slots);
    }

    public void saveAll(List<RackSlots> slots) {
        rackSlotsRepository.saveAll(slots);
    }

    public Boolean isRackSlotEmpty(Long rackId, Short slotNo) {
        Long n = rackSlotsRepository.getRackEmptySlotNumber(rackId, slotNo);
        return n > 0;
    }

    public void assignHostToSlot(Long hostId, Long rackId, Short slot) {
        rackSlotsRepository.assignHostToSlot(hostId, rackId, slot);
    }


    public void removeHostFromSlot(Long rackId, Short slot) {
        rackSlotsRepository.removeHostFromSlot(rackId, slot);
    }
}
