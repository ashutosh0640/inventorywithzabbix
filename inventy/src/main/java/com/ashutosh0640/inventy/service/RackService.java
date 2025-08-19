package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.Location;
import com.ashutosh0640.inventy.entity.RackSlots;
import com.ashutosh0640.inventy.entity.Racks;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.exception.DuplicateEntryException;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.RackMapper;
import com.ashutosh0640.inventy.repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RackService {

    private final RackRepository rackRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final RackSlotsRepository rackSlotsRepository;
    private final ActivityLogService activityLogService;
    private static final Logger LOGGER = LoggerFactory.getLogger(RackService.class);

    public RackService(RackRepository rackRepository,
                       LocationRepository locationRepository,
                       UserRepository userRepository,
                       RackSlotsRepository rackSlotsRepository,
                       ActivityLogService activityLogService) {
        this.rackRepository = rackRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.rackSlotsRepository = rackSlotsRepository;
        this.activityLogService = activityLogService;
    }

    public RackResponseDTO save(RackRequestDTO dto) {
        try {
            LOGGER.info("Fetching rack's location with ID: {}", dto.getLocationId());
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rack's location not found with ID: " + dto.getLocationId()));

            Set<User> users;
            if (dto.getUsersId() == null || dto.getUsersId().isEmpty()) {
                users = new HashSet<>(location.getUsers());
            } else {
                users = new HashSet<>(userRepository.findAllById(dto.getUsersId()));
            }

            Racks rack = rackRepository.save(RackMapper.toEntity(dto, location, users));
            RackSlots slots;
            List<RackSlots> slotsList = new ArrayList<>();
            for (short i = 0; i<=rack.getTotalSlot(); i+=2) {
                slots = new RackSlots();
                slots.setSlotNumber(i);
                slots.setRack(rack);
                slotsList.add(slots);
            }
            rackSlotsRepository.saveAll(slotsList);

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Rack is created. ID: "+rack.getName()
            );

            LOGGER.info("Saving rack: {}", rack);

            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error saving rack: ", ex);
            boolean flag = checkDuplicateEntry(ex.getMessage());
            if (flag) {
                throw new DuplicateEntryException("Duplicate entry. Rack already exist: "+dto.getName());
            }
            throw new RuntimeException("Failed to save rack. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void saveAll(List<RackRequestDTO> racks, int batchSize) {
        try {
            LOGGER.info("Saving {} locations in batches of {}", racks.size(), batchSize);
            List<Racks> entities = racks.stream()
                    .map(dto -> {
                        Set<User> users = new HashSet<>();
                        Location location = locationRepository.findById(dto.getLocationId())
                                .orElseThrow(() -> new ResourceNotFoundException("Rack's location not found with ID: " + dto.getLocationId()));

                        if (!dto.getUsersId().isEmpty()) {
                            users = dto.getUsersId().stream()
                                    .map(id->
                                         userRepository.findById(id)
                                                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id))
                                    )
                                    .collect(Collectors.toSet());
                        }
                        return RackMapper.toEntity(dto, location, users);
                    })
                    .collect(Collectors.toList());

            int totalRacks = entities.size();
            for (int i = 0; i < totalRacks; i += batchSize) {
                List<Racks> batch = entities.subList(i, Math.min(i + batchSize, totalRacks));
                rackRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalRacks));
            }

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Many racks are created."
            );

            LOGGER.info("All racks saved successfully.");
        } catch (Exception ex) {
            LOGGER.error("Error saving racks: ", ex);
            throw new RuntimeException("Failed to save racks. Reason: " + ex.getMessage());
        }
    }

    public RackResponseDTO getById(Long id) {
        try {
            LOGGER.info("Fetching rack with ID: {}", id);
            Racks rack = rackRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found with ID: " + id));

            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching rack with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve rack. Reason: " + ex.getMessage());
        }
    }

    public List<RackResponseDTO> getByName(String name) {
        try {
            LOGGER.info("Searching racks with name: {}", name);

            List<Racks> racks = rackRepository.findByNameContainingIgnoreCase(name);

            return racks.stream()
                    .map(r-> {
                        Long occupied = r.getSlots().stream().filter(s->{
                            return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
                        }).count();
                        return RackMapper.toDTO(r, occupied, r.getServers(), r.getNetworkDevices(), r.getUsers());
                    }).toList();

        } catch (Exception ex) {
            LOGGER.error("Error searching racks by name {}: ", name, ex);
            throw new RuntimeException("Failed to search racks. Reason: " + ex.getMessage());
        }
    }



    public List<RackResponseDTO> getAll() {
        try {
            LOGGER.info("Fetching all racks...");
            List<Racks> racks = rackRepository.findAll();
            if(racks.isEmpty()) {
                return new ArrayList<>();
            }

            return racks.stream()
                    .map(r-> {
                        Long occupied = r.getSlots().stream().filter(s->{
                            return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
                        }).count();
                        return RackMapper.toDTO(r, occupied, r.getServers(), r.getNetworkDevices(), r.getUsers());
                    }).toList();
        } catch (Exception ex) {
            LOGGER.error("Error fetching racks: ", ex);
            throw new RuntimeException("Failed to retrieve racks. Reason: " + ex.getMessage());
        }
    }

    public Long count() {
        return rackRepository.count();
    }

    public List<RackResponseDTO> getAllSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all racks sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<Racks> racks = rackRepository.findAll(sort);

            return racks.stream()
                    .map(r-> {
                        Long occupied = r.getSlots().stream().filter(s->{
                            return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
                        }).count();
                        return RackMapper.toDTO(r, occupied, r.getServers(), r.getNetworkDevices(), r.getUsers());
                    }).toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted racks: ", ex);
            throw new RuntimeException("Failed to retrieve racks. Reason: " + ex.getMessage());
        }
    }

    public Page<RackResponseDTO> getAllPaginated(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all racks with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Racks> racksPage = rackRepository.findAll(pageable);

            return racksPage.map(RackMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated racks: ", ex);
            throw new RuntimeException("Failed to retrieve racks. Reason: " + ex.getMessage());
        }
    }

    public RackResponseDTO update(Long id, RackRequestDTO dto) {
        try {
            LOGGER.info("Updating rack with ID: {}", id);

            // Find existing rack
            Racks existingRack = rackRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found with ID: " + id));

            // Update fields
            existingRack.setName(dto.getName());
            existingRack.setTotalSlot(dto.getTotalSlot());

            if (!Objects.equals(dto.getLocationId(), existingRack.getLocation().getId())) {
                Location l = locationRepository.findById(dto.getLocationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Location not found by id: "+dto.getLocationId()));
                existingRack.setLocation(l);
            }

            // Save updated rack
            Racks rack = rackRepository.save(existingRack);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Rack is updated. ID: "+rack.getId()
            );

            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error updating rack with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update rack. Reason: " + ex.getMessage());
        }
    }

    public void deleteById(Long id) {
        try {
            LOGGER.info("Deleting rack with ID: {}", id);

            // Check if the rack exists
            Racks rack = rackRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found with ID: " + id));

            // Delete rack
            rackRepository.delete(rack);
            LOGGER.info("Successfully deleted rack with ID: {}", id);

        } catch (Exception ex) {
            LOGGER.error("Error deleting rack with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete rack. Reason: " + ex.getMessage());
        }
    }



    public RackResponseDTO updateLocationToRack(Long rackId, Long locationId) {
        LOGGER.info("Updating location to rack with ID: {}", rackId);
        try {
            Location location = locationRepository.findById(locationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + locationId));

            Racks rack = rackRepository.findById(rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found with ID: " + rackId));

            rack.setLocation(location);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Rack location updated. Id: "+rack.getId()
            );

            LOGGER.info("Successfully updated location to rack with ID: {}", rackId);
            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error while updating location of racks id {}: ", rackId, ex);
            throw new RuntimeException("Failed to search racks. Reason: " + ex.getMessage());
        }
    }

    public boolean addUsersToRack(Long rackId, List<Long> userIds) {
        LOGGER.info("Adding user to rack with ID: {}", rackId);
        try {
            Racks rack = rackRepository.findById(rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found by ID: " + rackId));

            Set<User> usersToAdd = userIds.stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found by ID: " + id)))
                    .collect(Collectors.toSet());

            rack.getUsers().addAll(usersToAdd);
            rackRepository.save(rack);
            LOGGER.info("Successfully added users to rack with ID: {}", rackId);
            return true;

        } catch (Exception ex) {
            LOGGER.error("Error while removing user from racks id {}: ", rackId, ex);
            throw new RuntimeException("Error while removing user from rack. Reason: " + ex.getMessage());
        }

    }

    public boolean removeUsersFromRack(Long rackId, List<Long> userIds) {
        LOGGER.info("Finding rack with ID: {}", rackId);

        try {
            Racks rack = rackRepository.findById(rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found by ID: " + rackId));

            LOGGER.info("Finding Location with ID's: {}", userIds.toString());
            Set<User> usersToRemove = rack.getUsers().stream()
                    .filter(user -> userIds.contains(user.getId()))
                    .collect(Collectors.toSet());

            if (usersToRemove.isEmpty()) {
                throw new RuntimeException("No matching users found for removal in the rack .");
            }

            rack.getUsers().removeAll(usersToRemove);
            rackRepository.save(rack);
            LOGGER.info("Successfully removed rack with ID: {}", rackId);
            return true;

        } catch (Exception ex) {
            LOGGER.error("Error while removing user from racks id {}: ", rackId, ex);
            throw new RuntimeException("Error while removing user from rack. Reason: " + ex.getMessage());
        }

    }



    // ============== User respective methods ===================================== //
    public List<RackResponseDTO> findAllByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching all racks for userId: {}", userId);
            List<Racks> racks = rackRepository.findAllByUser(userId);
            return racks.stream()
                    .map(r-> {
                        Long occupied = r.getSlots().stream().filter(s->{
                            return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
                        }).count();
                        return RackMapper.toDTO(r, occupied, r.getServers(), r.getNetworkDevices(), r.getUsers());
                    }).toList();
        } catch (Exception ex) {
            LOGGER.error("Found error while fetching racks for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching rack. Reason: " + ex.getMessage());
        }
    }

    public RackResponseDTO findByUser(Long rackId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching rack  for userId: {}", userId);
            Racks rack  = rackRepository.findByUser(userId, rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found for userId " + userId));

            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching rack  for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching rack . Reason: " + ex.getMessage());
        }
    }


    public void removeAllRackForUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Deleting all racks for userId: {}", userId);
            rackRepository.removeAllRackForUser(userId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting rack  for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting rack . Reason: " + ex.getMessage());
        }
    }

    public void removeRackForUser(Long rackId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Removing users from rack. rackId: {} and userId: {}", rackId, userId);
            rackRepository.removeRackForUser(userId, rackId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting rack  for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting rack . Reason: " + ex.getMessage());
        }
    }

    public RackResponseDTO updateRackForUser(Long rackId, RackRequestDTO dto) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching rack  for update: rackId={}, userId={}", rackId, userId);
            Racks existingRack  = rackRepository.findByUser(userId, rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found or not authorized for update."));
            // Update fields
            existingRack.setName(dto.getName());
            existingRack.setTotalSlot(dto.getTotalSlot());

            if (!Objects.equals(dto.getLocationId(), existingRack.getLocation().getId())) {
                Location l = locationRepository.findById(dto.getLocationId())
                        .orElseThrow(() -> new ResourceNotFoundException("Location not found by id: "+dto.getLocationId()));
                existingRack.setLocation(l);
            }

            Set<User> users = dto.getUsersId().stream()
                    .map(userRepository::getReferenceById)     // returns a proxy, no query
                    .collect(Collectors.toSet());

            existingRack.setUsers(users);

            // Save updated rack
            Racks rack = rackRepository.save(existingRack);

            Long occupied = rack.getSlots().stream().filter(s->{
                return "OCCUPIED".equalsIgnoreCase(s.getStatus().toString());
            }).count();

            return RackMapper.toDTO(rack, occupied, rack.getServers(), rack.getNetworkDevices(), rack.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting rack  for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting rack . Reason: " + ex.getMessage());
        }
    }

    public Page<RackResponseDTO> getAllRacksByUserPaginated(int page, int size) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching paginated racks for userId: {}", userId);
            // Default to page size 10 if not provided
            if (page<0) {
                page = 0;
            }
            if (size<1) {
                size = 5;
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Racks> rackPage = rackRepository.findAllByUserPaginated(userId, pageable);

            return rackPage.map(RackMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated rack s: ", ex);
            throw new RuntimeException("Failed to retrieve rack. Reason: " + ex.getMessage());
        }
    }

    public Page<RackResponseDTO> searchRacksByName(String name, int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Searching racks by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<Racks> rackPage = rackRepository.searchByNameAndUser(name, userId, pageable);

            return rackPage.map(RackMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated racks for user with user id: {} ", userId, ex);
            throw new RuntimeException("Failed to retrieve rack. Reason: " + ex.getMessage());
        }
    }

    public Long countByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting racks for userId: {}", userId);
        return rackRepository.countByUser(userId);
    }

    public boolean isAccessibleByUser(Long rackId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for rackId: {} and userId: {}", rackId, userId);
        return rackRepository.existsByIdAndUser(rackId, userId);
    }

    public List<Long> findAllIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible rack  IDs for userId: {}", userId);
        return rackRepository.findAllIdsByUser(userId);
    }

    public List<RackResponseDTO> findByUserAndLocation(Long locationId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching racks for userId: {} and locationId: {}", userId, locationId);
            List<Racks> rack = rackRepository.findByUserAndLocation(userId, locationId);
            return rack.stream().map(RackMapper::toDTO).collect(Collectors.toList());
        } catch (Exception ex) {
            LOGGER.error("Found error while finding rack for location with id: {} ", locationId, ex);
            throw new RuntimeException("Found error while finding rack . Reason: " + ex.getMessage());
        }
    }


    public Long countByUserAndLocation(Long locationId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Counting racks for userId: {} and locationId: {}", userId, locationId);
            return rackRepository.countByUserAndLocation(userId, locationId);
        } catch (Exception ex) {
            LOGGER.error("Found error while counting rack for location with id: {} ", locationId, ex);
            throw new RuntimeException("Found error while counting rack . Reason: " + ex.getMessage());
        }
    }


    public boolean checkDuplicateEntry(String message ) {
        String regex = "(?i)Duplicate entry";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return true;
        }
        return false;
    }

}
