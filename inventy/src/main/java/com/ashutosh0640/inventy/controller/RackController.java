package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.RackRequestDTO;
import com.ashutosh0640.inventy.dto.RackResponseDTO;
import com.ashutosh0640.inventy.service.RackService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rack")
public class RackController {

    private final RackService rackService;
    private static final Logger LOGGER = LoggerFactory.getLogger(RackController.class);

    public RackController(RackService rackService) {
        this.rackService = rackService;
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'WRITE')")
    @PostMapping
    public ResponseEntity<RackResponseDTO> save(@RequestBody RackRequestDTO dto) {
        LOGGER.info("Received request to save rack: {}", dto.getName());
        RackResponseDTO savedRack = rackService.save(dto);
        return new ResponseEntity<>(savedRack, HttpStatus.CREATED);
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> saveAll(@RequestBody List<RackRequestDTO> locations,
                                                         @RequestParam(defaultValue = "100") int batchSize) {
        LOGGER.info("Received request to save {} locations in batches of {}", locations.size(), batchSize);
        rackService.saveAll(locations, batchSize);
        return new ResponseEntity<>("Racks saved successfully in batches.", HttpStatus.CREATED);
    }


    @PreAuthorize("hasPermission(#id, 'RACK', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<RackResponseDTO> getById(@PathVariable Long id) {
        LOGGER.info("Received request to fetch rack with ID: {}", id);
        RackResponseDTO rack = rackService.getById(id);
        return new ResponseEntity<>(rack, HttpStatus.OK);
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping
    public ResponseEntity<List<RackResponseDTO>> getAll() {
        LOGGER.info("Received request to fetch all racks");
        List<RackResponseDTO> racks = rackService.getAll();
        return ResponseEntity.ok(racks);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/by-name")
    public ResponseEntity<List<RackResponseDTO>> getByName(@RequestParam String name) {
        LOGGER.info("Received request to fetch rack with name: {}", name);
        List<RackResponseDTO> rack = rackService.getByName(name);
        return new ResponseEntity<>(rack, HttpStatus.OK);
    }





    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<RackResponseDTO>> getAllSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        LOGGER.info("Received request to fetch racks sorted by {} in {} order", field, sortOrder);
        List<RackResponseDTO> sortedRacks = rackService.getAllSorted(sortOrder, field);
        return ResponseEntity.ok(sortedRacks);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<RackResponseDTO>> getAllRackPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        LOGGER.info("Received request to fetch racks - Page: {}, Size: {}", page, size);
        Page<RackResponseDTO> pagedRacks = rackService.getAllPaginated(page, size);
        return ResponseEntity.ok(pagedRacks);
    }


    @PreAuthorize("hasPermission(#id, 'RACK', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<RackResponseDTO> update(@PathVariable Long id, @RequestBody RackRequestDTO dto) {
        LOGGER.info("Received request to update rack with ID: {}", id);
        RackResponseDTO updatedRack = rackService.update(id, dto);
        return ResponseEntity.ok(updatedRack);
    }

    @PreAuthorize("hasPermission(#id, 'RACK', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        LOGGER.info("Received request to delete rack with ID: {}", id);
        rackService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasPermission(#id, 'RACK', 'EDIT')")
    @PatchMapping("/{id}/update-location/{location_id}")
    public ResponseEntity<RackResponseDTO> updateLocationToRack(@PathVariable Long id, @PathVariable Long location_id) {
        LOGGER.info("Received request to update location to rack with ID: {}", id);
        RackResponseDTO rack = rackService.updateLocationToRack(id, location_id);
        return ResponseEntity.ok(rack);
    }

    @Transactional
    @PreAuthorize("hasPermission(#id, 'RACK', 'EDIT')")
    @PostMapping("/{id}/add-user")
    public boolean addUsersToRack(@PathVariable Long id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to add users to rack with ID: {}", id);
        return rackService.addUsersToRack(id, userIds);
    }

    @PreAuthorize("hasPermission(#id, 'RACK', 'EDIT')")
    @DeleteMapping("/{id}/remove-user")
    public boolean removeUsersFromRack(@PathVariable Long id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to remove users from rack with ID: {}", id);
        return rackService.removeUsersFromRack(id, userIds);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/users")
    public List<RackResponseDTO> getAllRacksForUser() {
        LOGGER.info("Received request to get all racks by user");
        return rackService.findAllByUser();
    }

    @PreAuthorize("hasPermission(#id, 'RACK', 'READ')")
    @GetMapping("/{id}/users")
    public RackResponseDTO getRackForUser(@PathVariable Long id) {
        LOGGER.info("Received request to get rack by user with ID: {}", id);
        return rackService.findByUser(id);
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'DELETE')")
    @DeleteMapping("/users")
    public void removeAllRackForUser() {
        LOGGER.info("Received request to delete all racks by user");
        rackService.removeAllRackForUser();
    }

    @PreAuthorize("hasPermission(#id, 'RACK', 'DELETE')")
    @DeleteMapping("/{id}/users/")
    public void removeRackForUser(@PathVariable Long id) {
        LOGGER.info("Received request to delete rack by user with ID: {}", id);
        rackService.removeRackForUser(id);
    }


    @PreAuthorize("hasPermission(#id, 'RACK', 'EDIT')")
    @PutMapping("/{id}/update/users")
    public ResponseEntity<RackResponseDTO> updateRackForUser(@PathVariable Long id, @RequestBody RackRequestDTO dto) {
        LOGGER.info("Received request to update rack for user with ID: {}", id);
        RackResponseDTO rack = rackService.updateRackForUser(id, dto);
        return ResponseEntity.ok(rack);
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/users/paged")
    public ResponseEntity<Page<RackResponseDTO>> getAllRacksByUserPaged(@RequestParam int page, @RequestParam int size) {
        LOGGER.info("Received request to get all rack for user in page.");
        Page<RackResponseDTO> dto = rackService.getAllRacksByUserPaginated(page, size);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/search/by-name/paged")
    public ResponseEntity<Page<RackResponseDTO>> searchRacksByName(@RequestParam String name, @RequestParam int page, int size) {
        LOGGER.info("Received request for search rack with name: {}", name);
        Page<RackResponseDTO> dto = rackService.searchRacksByName(name, page, size);
        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/count")
    public ResponseEntity<Long> countRacksByUser() {
        LOGGER.info("Received request to count projects by user");
        Long l = rackService.countByUser();
        return ResponseEntity.ok(l);
    }


    @PreAuthorize("hasPermission(#id, 'RACK', 'READ')")
    @GetMapping("/{id}/access")
    public boolean isRackAccessibleByUser(@PathVariable Long id) {
        LOGGER.info("Received request to check if rack accessible by user: {}", id);
        return rackService.isAccessibleByUser(id);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/ids")
    public List<Long> getRackIdsByUser() {
        LOGGER.info("Received request to get all rack ids by user");
        return rackService.findAllIdsByUser();
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/search/by-location/{location_id}")
    public ResponseEntity<List<RackResponseDTO>> findRacksByUserAndLocation(@PathVariable Long location_id) {
        LOGGER.info("Received request to find racks by user and location with ID: {}", location_id);
        List<RackResponseDTO> dto = rackService.findByUserAndLocation(location_id);
        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasPermission(null, 'RACK', 'READ')")
    @GetMapping("/count/{location_id}")
    public ResponseEntity<Long> countRacksByUserAndLocation(@PathVariable Long location_id) {
        LOGGER.info("Received request to count racks by user and location with ID: {}", location_id);
        Long r = rackService.countByUserAndLocation(location_id);
        return ResponseEntity.ok(r);
    }

}
