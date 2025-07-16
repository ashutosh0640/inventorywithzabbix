package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.LocationRequestDTO;
import com.ashutosh0640.inventy.dto.LocationResponseDTO;
import com.ashutosh0640.inventy.entity.Location;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.LocationMapper;
import com.ashutosh0640.inventy.repository.LocationRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private static final Logger LOGGER = LoggerFactory.getLogger(LocationService.class);

    public LocationService(LocationRepository locationRepository, UserRepository userRepository, ActivityLogService activityLogService) {
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    public LocationResponseDTO saveLocation(LocationRequestDTO dto) {
        try {
            Set<User> users = new HashSet<>();
            if (!dto.getUserIds().isEmpty()) {
                users = dto.getUserIds().stream()
                        .map(id -> userRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("User not found by id: "+id))
                        )
                        .collect(Collectors.toSet());
            }
            Location location = locationRepository.save(LocationMapper.toEntity(dto, users));
            LOGGER.info("Saving location: {}", location);
            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Location is created. Name: "+location.getName()
            );
            return LocationMapper.toDTO(location, location.getRacks(), location.getProjects(), location.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error saving location: ", ex);
            throw new RuntimeException("Failed to save location. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void saveLocationsInBatches(List<LocationRequestDTO> locations, int batchSize) {
        try {
            LOGGER.info("Saving {} locations in batches of {}", locations.size(), batchSize);

            List<Location> entities = locations.stream()
                    .map(dto-> {
                        Set<User> users = new HashSet<>();
                        if (!dto.getUserIds().isEmpty()) {
                             users = dto.getUserIds().stream()
                                    .map(id -> userRepository.findById(id)
                                                .orElseThrow(() -> new ResourceNotFoundException("User not found by id: "+id))
                                    ).collect(Collectors.toSet());
                        }
                        return LocationMapper.toEntity(dto, users);
                    })
                    .collect(Collectors.toList());
            int totalLocations = entities.size();
            for (int i = 0; i < totalLocations; i += batchSize) {
                List<Location> batch = entities.subList(i, Math.min(i + batchSize, totalLocations));
                locationRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalLocations));
            }

            LOGGER.info("All locations saved successfully.");
            activityLogService.createEntity(
                    ActivityType.WRITE,
                    locations.size() + "locations are created."
            );
        } catch (Exception ex) {
            LOGGER.error("Error saving locations: ", ex);
            throw new RuntimeException("Failed to save locations. Reason: " + ex.getMessage());
        }
    }



    public LocationResponseDTO getLocationById(Long id) {
        try {
            LOGGER.info("Fetching location with ID: {}", id);
            Location location = locationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + id));
            return LocationMapper.toDTO(location, location.getRacks(), location.getProjects(), location.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error fetching location with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve location. Reason: " + ex.getMessage());
        }
    }



    public List<LocationResponseDTO> getAllLocations() {
        try {
            LOGGER.info("Fetching all locations...");
            List<Location> locations = locationRepository.findAll();

            return locations.stream()
                    .map(l-> LocationMapper.toDTO(l, l.getRacks(), l.getProjects(), l.getUsers())
                    )
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching locations: ", ex);
            throw new RuntimeException("Failed to retrieve locations. Reason: " + ex.getMessage());
        }
    }

    public List<LocationResponseDTO> getAllLocationSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all locations sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<Location> locations = locationRepository.findAll(sort);

            return locations.stream()
                    .map(LocationMapper::toDTO)
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted locations: ", ex);
            throw new RuntimeException("Failed to retrieve locations. Reason: " + ex.getMessage());
        }
    }

    public Page<LocationResponseDTO> getAllLocationPageable(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all locations with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Location> locationsPage = locationRepository.findAll(pageable);

            return locationsPage.map(LocationMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated locations: ", ex);
            throw new RuntimeException("Failed to retrieve locations. Reason: " + ex.getMessage());
        }
    }

    public LocationResponseDTO updateLocation(Long id, LocationRequestDTO dto) {
        try {
            LOGGER.info("Updating location with ID: {}", id);

            // Find existing location
            Location existingLocation = locationRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + id));

            // Update fields
            existingLocation.setName(dto.getName());

            Set<User> users = dto.getUserIds().stream()
                    .map(userRepository::getReferenceById)     // returns a proxy, no query
                    .collect(Collectors.toSet());

            existingLocation.setUsers(users);

            // Save updated location
            Location location = locationRepository.save(existingLocation);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Location is created. Name: "+location.getName()
            );
            return LocationMapper.toDTO(location, location.getRacks(), location.getProjects(), location.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error updating location with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update location. Reason: " + ex.getMessage());
        }
    }

    public void deleteLocation(Long id) {
        try {
            LOGGER.info("Deleting location with ID: {}", id);

            // Delete location
            locationRepository.deleteById(id);
            activityLogService.createEntity(
                    ActivityType.DELETE,
                    "Location is deleted. ID: "+id
            );
            LOGGER.info("Successfully deleted location with ID: {}", id);
        } catch (Exception ex) {
            LOGGER.error("Error deleting location with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete location. Reason: " + ex.getMessage());
        }
    }

    public List<LocationResponseDTO> searchLocationByName(String name) {
        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Searching locations by name: {}", name);
            List<Location> locations = locationRepository.findByNameContainingIgnoreCase(name, userId);
            if (locations.isEmpty()) {
                LOGGER.warn("No locations found with name: {}", name);
                throw new ResourceNotFoundException("No locations found matching: " + name);
            }
            return locations.stream()
                    .map(l-> LocationMapper.toDTO(l, l.getRacks(), l.getProjects(), l.getUsers())
                    )
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching locations by name {}: ", name, ex);
            throw new RuntimeException("Failed to search locations. Reason: " + ex.getMessage());
        }
    }



    // ============== User respective methods ===================================== //
    public List<LocationResponseDTO> getAllLocationsByUser() {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching all locations for userId: {}", userId);

            List<Location> locations = locationRepository.findAllByUserId(userId);

            return locations.stream()
                    .map(l-> LocationMapper.toDTO(l, l.getRacks(), l.getProjects(), l.getUsers())
                    )
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            LOGGER.error("Found error while fetching locations for user: ", ex);
            throw new RuntimeException("Found error while fetching locations. Reason: " + ex.getMessage());
        }
    }

    public LocationResponseDTO getLocationByUser(Long locationId) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching location for userId: {}", userId);
            Location location = locationRepository.findByUserId(userId, locationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found for userId " + userId));

            return LocationMapper.toDTO(location, location.getRacks(), location.getProjects(), location.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Found error while fetching location for user. ", ex);
            throw new RuntimeException("Found error while fetching location. Reason: " + ex.getMessage());
        }
    }

    public Long countLocation() {
        return locationRepository.count();
    }

    public List<LocationResponseDTO> findLocationsForProjectByUser(Long locationId) {
        final Long uId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Finding all projects with location for userId: {}", uId);
            List<Location> locations = locationRepository.findLocationsForProjectByUser(locationId, uId);
            return locations.stream()
                    .map(l-> LocationMapper.toDTO(l, l.getRacks(), l.getProjects(), l.getUsers())
                    )
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            LOGGER.error("Found error while getting location with its location for userId {}: ", uId, ex);
            throw new RuntimeException("Found error while getting project with its location for user. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void deleteAllLocationsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Deleting all projects for userId: {}", userId);
            locationRepository.deleteAllByUserId(userId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }


    public void removeUserFromLocation(Long locationId, Set<Long> usersId) {
        try {
            LOGGER.info("Removing users to location {}", locationId);
            usersId.forEach(userId -> locationRepository.removeUserFromLocation(locationId, userId));
        } catch ( Exception ex) {
            LOGGER.error("Found error while removing user from location.", ex);
            throw new RuntimeException("Found error while removing user from location."+ex.getMessage());
        }
    }

    @Transactional
    public void addUserToLocation(Long locationId, Set<Long> usersId) {
        try {
            LOGGER.info("Adding users to  location {}", locationId);
            usersId.forEach(userId -> locationRepository.addUserToLocation(locationId, userId));
        } catch ( Exception ex) {
            LOGGER.error("Found error while removing user from location.", ex);
            throw new RuntimeException("Found error while removing user from location."+ex.getMessage());
        }
    }


    @Transactional
    public void deleteLocationByUser(Long locationId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Deleting projectId: {} for userId: {}", locationId, userId);
            if (!locationRepository.existsByIdAndUserId(locationId, userId)) {
                throw new ResourceNotFoundException("Location not found or not authorized for userId " + userId);
            }
            locationRepository.deleteByUserId(userId, locationId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public LocationResponseDTO updateLocationForUser(Long locationId, LocationRequestDTO dto) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching project for update: projectId={}, userId={}", locationId, userId);
            Location location = locationRepository.findByUserId(userId, locationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found or not authorized for update"));
            location.setName(dto.getName());

            Set<User> users = dto.getUserIds().stream()
                    .map(userRepository::getReferenceById)     // returns a proxy, no query
                    .collect(Collectors.toSet());

            location.setUsers(users);

            location =  locationRepository.save(location);
            return LocationMapper.toDTO(location, location.getRacks(), location.getProjects(), location.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }

    public Page<LocationResponseDTO> getAllLocationsByUserPaged(int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching paginated projects for userId: {}", userId);
            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Location> projectsPage = locationRepository.findAllByUserId(userId, pageable);

            return projectsPage.map(LocationMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated projects: ", ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public Page<LocationResponseDTO> searchLocationsByName(String name, int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Searching projects by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<Location> projectsPage = locationRepository.searchByNameAndUserId(name, userId, pageable);

            return projectsPage.map(l-> LocationMapper.toDTO(l, l.getRacks(), l.getProjects(), l.getUsers()));

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated projects for user with user id: {} ", userId, ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public long countLocationsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting projects for userId: {}", userId);
        return locationRepository.countByUserId(userId);
    }

    public boolean isLocationAccessibleByUser(Long projectId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for projectId: {} and userId: {}", projectId, userId);
        return locationRepository.existsByIdAndUserId(projectId, userId);
    }

    public List<Long> getLocationIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible project IDs for userId: {}", userId);
        return locationRepository.findAllLocationIdsByUserId(userId);
    }


    public List<Map<String, Object>> getCountsPerLocation() {
        List<Object[]> results = locationRepository.getCountsPerLocation();
        List<Map<String, Object>> locationCounts = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> data = new HashMap<>();
            data.put("locationName", row[0]);
            data.put("rackCount", row[1]);
            data.put("bareMetalCount", row[2]);
            data.put("virtualPlatformCount", row[3]);
            data.put("virtualMachineCount", row[4]);

            locationCounts.add(data);
        }

        return locationCounts;
    }


}
