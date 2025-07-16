package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.LocationRequestDTO;
import com.ashutosh0640.inventy.dto.LocationResponseDTO;
import com.ashutosh0640.inventy.service.LocationService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/location")
public class LocationController {

    private final LocationService locationService;
    private static final Logger LOGGER = LoggerFactory.getLogger(LocationController.class);

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'WRITE')")
    @PostMapping
    public ResponseEntity<LocationResponseDTO> saveLocation(@RequestBody LocationRequestDTO dto) {
        LOGGER.info("Received request to save location: {}", dto.getName());
        LocationResponseDTO savedLocation = locationService.saveLocation(dto);
        return new ResponseEntity<>(savedLocation, HttpStatus.CREATED);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> saveLocationsInBatches(@RequestBody List<LocationRequestDTO> locations,
                                                         @RequestParam(defaultValue = "100") int batchSize) {
        LOGGER.info("Received request to save {} locations in batches of {}", locations.size(), batchSize);
        locationService.saveLocationsInBatches(locations, batchSize);
        return ResponseEntity.status(HttpStatus.CREATED).body("Locations saved successfully in batches.");
    }


    @PreAuthorize("hasPermission(#id, 'LOCATION', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDTO> getLocationById(@PathVariable Long id) {
        LOGGER.info("Received request to fetch location with ID: {}", id);
        LocationResponseDTO location = locationService.getLocationById(id);
        return ResponseEntity.ok(location);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping
    public ResponseEntity<List<LocationResponseDTO>> getAllLocations() {
        LOGGER.info("Received request to fetch all locations");
        List<LocationResponseDTO> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<LocationResponseDTO>> getAllLocationSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        LOGGER.info("Received request to fetch locations sorted by {} in {} order", field, sortOrder);
        List<LocationResponseDTO> sortedLocations = locationService.getAllLocationSorted(sortOrder, field);
        return new ResponseEntity<>(sortedLocations, HttpStatus.OK);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<LocationResponseDTO>> getAllLocationPageable(
            @RequestParam(defaultValue = "10") int page,
            @RequestParam(defaultValue = "0") int size) {
        LOGGER.info("Received request to fetch locations - Page: {}, Size: {}", page, size);
        Page<LocationResponseDTO> pagedLocations = locationService.getAllLocationPageable(page, size);
        return ResponseEntity.ok(pagedLocations);
    }


    @PreAuthorize("hasPermission(#id, 'LOCATION', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<LocationResponseDTO> updateLocation(@PathVariable Long id, @RequestBody LocationRequestDTO dto) {
        LOGGER.info("Received request to update location with ID: {}", id);
        LocationResponseDTO updatedLocation = locationService.updateLocation(id, dto);
        return ResponseEntity.ok(updatedLocation);
    }

    @PreAuthorize("hasPermission(#id, 'LOCATION', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        LOGGER.info("Received request to delete location with ID: {}", id);
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/search")
    public ResponseEntity<List<LocationResponseDTO>> searchLocationByName(@RequestParam String name) {
        LOGGER.info("Received request to search locations with name: {}", name);
        List<LocationResponseDTO> locations = locationService.searchLocationByName(name);
        return ResponseEntity.ok(locations);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/users")
    public ResponseEntity<List<LocationResponseDTO>> getAllLocationsByUser() {
        LOGGER.info("Received request to get all locations by user");
        List<LocationResponseDTO> dto =  locationService.getAllLocationsByUser();
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasPermission(#id, 'LOCATION', 'READ')")
    @GetMapping("/{id}/users")
    public ResponseEntity<LocationResponseDTO> getLocationForUser(@PathVariable Long id) {
        LOGGER.info("Received request to get location by user with ID: {}", id);
        LocationResponseDTO location = locationService.getLocationByUser(id);
        return ResponseEntity.ok(location);
    }


    @PreAuthorize("hasPermission(#id, 'LOCATION', 'READ')")
    @GetMapping("/{id}/by-project")
    public ResponseEntity<List<LocationResponseDTO>> findLocationsByProjectForUser(@PathVariable Long id) {
        LOGGER.info("Received request to get locations for project with ID: {}", id);
        List<LocationResponseDTO> dtos = locationService.findLocationsForProjectByUser(id);
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'DELETE')")
    @DeleteMapping("/users")
    public void deleteAllLocationsByUser() {
        LOGGER.info("Received request to delete all locations by user");
        locationService.deleteAllLocationsByUser();
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'EDIT')")
    @PutMapping("/{id}/remove-user")
    public void removeUserFromLocation(@PathVariable Long id, @RequestBody Set<Long> userIds) {
        LOGGER.info("Received request to delete users from location with ID: {}", id);
        locationService.removeUserFromLocation(id, userIds);
    }


    @PreAuthorize("hasPermission(#id, 'LOCATION', 'EDIT')")
    @PutMapping("/{id}/add-user")
    public void addUserToLocation(@PathVariable Long id, @RequestBody Set<Long> userIds) {
        LOGGER.info("Received request to add users to location with ID: {}", id);
        locationService.addUserToLocation(id, userIds);
    }


    @Transactional
    @PreAuthorize("hasPermission(null, 'LOCATION', 'DELETE')")
    @DeleteMapping("/{id}/users")
    public void deleteLocationByUser(@PathVariable Long id) {
        LOGGER.info("Received request to delete locations by user with ID: {}", id);
        locationService.deleteLocationByUser(id);
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/users/paged")
    public ResponseEntity<Page<LocationResponseDTO>> getAllLocationsByUserPaged(@RequestParam int page, @RequestParam int size) {
        LOGGER.info("Received request to fetch all location by user in page.");
        Page<LocationResponseDTO> dtos = locationService.getAllLocationsByUserPaged(page, size);
        return ResponseEntity.ok(dtos);
    }


    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/search/paged")
    public ResponseEntity<Page<LocationResponseDTO>> searchLocationsByName(@RequestParam String name, @RequestParam int page, @RequestParam int size) {
        LOGGER.info("Received request to search locations with name: {} in page.", name);
        Page<LocationResponseDTO> dtos = locationService.searchLocationsByName(name, page, size);
        return ResponseEntity.ok(dtos);
    }


    @PreAuthorize("hasPermission(#id, 'LOCATION', 'EDIT')")
    @PutMapping("/{id}/update")
    public ResponseEntity<LocationResponseDTO> updateLocationForUser(@PathVariable Long id, @RequestBody LocationRequestDTO dto) {
        LOGGER.info("Received request to update location by user with ID: {}", id);
        LocationResponseDTO location = locationService.updateLocationForUser(id, dto);
        return ResponseEntity.ok(location);
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/count")
    public ResponseEntity<Long> countLocationsForUser() {
        LOGGER.info("Received request to count locations by user");
        Long l = locationService.countLocationsByUser();
        return ResponseEntity.ok(l);
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/counts")
    public List<Map<String, Object>> getLocationResourceCounts() {
        LOGGER.info("Received request to fetch counts per location");
        return locationService.getCountsPerLocation();
    }

    @PreAuthorize("hasPermission(#id, 'LOCATION', 'READ')")
    @GetMapping("/{id}/access")
    public ResponseEntity<Boolean> isLocationAccessibleForUser(@PathVariable Long id) {
        LOGGER.info("Received request to check location existence by user with ID: {}", id);
        Boolean b = locationService.isLocationAccessibleByUser(id);
        return ResponseEntity.ok(b);
    }

    @PreAuthorize("hasPermission(null, 'LOCATION', 'READ')")
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getLocationIdsForUser() {
        LOGGER.info("Received request to get location IDs by user");
        List<Long> ids = locationService.getLocationIdsByUser();
        return ResponseEntity.ok(ids);
    }


}
