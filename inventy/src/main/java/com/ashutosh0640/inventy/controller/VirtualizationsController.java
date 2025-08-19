package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.VirtualizationsRequestDTO;
import com.ashutosh0640.inventy.dto.VirtualizationsResponseDTO;
import com.ashutosh0640.inventy.service.VirtualizationsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vp")
public class VirtualizationsController {

    private final VirtualizationsService virtualizationService;
    private static final Logger LOGGER = LoggerFactory.getLogger(VirtualizationsController.class);

    public VirtualizationsController(VirtualizationsService virtualizationService) {
        this.virtualizationService = virtualizationService;
    }

    @PreAuthorize("hasPermission(null, 'VP', 'WRITE')")
    @PostMapping
    public ResponseEntity<VirtualizationsResponseDTO> save(@RequestBody VirtualizationsRequestDTO dto) {
            LOGGER.info("Received request to save virtualizationPlatform");
            VirtualizationsResponseDTO savedVirtualizationPlatform = virtualizationService.save(dto);
            return new ResponseEntity<>(savedVirtualizationPlatform, HttpStatus.CREATED);
    }


    @PreAuthorize("hasPermission(#id, 'VP', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<VirtualizationsResponseDTO> getById(@PathVariable Long id) {
            LOGGER.info("Received request to fetch Virtualization Platform with ID: {}", id);
            VirtualizationsResponseDTO virtualizationPlatform = virtualizationService.getById(id);
            return new ResponseEntity<>(virtualizationPlatform, HttpStatus.OK);
    }

    @PreAuthorize("hasPermission(#id, 'VP', 'READ')")
    @GetMapping("/ip")
    public ResponseEntity<List<VirtualizationsResponseDTO>> getByIp(@PathVariable String ip) {
        LOGGER.info("Received request to fetch Virtualization Platform with IP: {}", ip);
        List<VirtualizationsResponseDTO> virtualizationPlatforms = virtualizationService.getByIp(ip);
        return ResponseEntity.ok(virtualizationPlatforms);
    }


    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping
    public ResponseEntity<List<VirtualizationsResponseDTO>> getAllVirtualizationPlatforms() {
            LOGGER.info("Received request to fetch all virtualizationPlatforms");
            List<VirtualizationsResponseDTO> virtualizationPlatforms = virtualizationService.getAll();
            return ResponseEntity.ok(virtualizationPlatforms);
    }


    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<VirtualizationsResponseDTO>> getAllSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        try {
            LOGGER.info("Received request to fetch virtualizationPlatforms sorted by {} in {} order", field, sortOrder);
            List<VirtualizationsResponseDTO> sortedVirtualizationPlatforms = virtualizationService.getAllSorted(sortOrder, field);
            return ResponseEntity.ok(sortedVirtualizationPlatforms);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching sorted virtualizationPlatforms: ", ex);
            throw new RuntimeException("Error fetching sorted virtualizationPlatforms: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<VirtualizationsResponseDTO>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            LOGGER.info("Received request to fetch virtualizationPlatforms - Page: {}, Size: {}", page, size);
            Page<VirtualizationsResponseDTO> pagedVirtualizationPlatforms = virtualizationService.getAllPaginated(page, size);
            return ResponseEntity.ok(pagedVirtualizationPlatforms);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching paginated virtualizationPlatforms: ", ex);
            throw new RuntimeException("Error fetching virtualizationPlatforms: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'VP', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<VirtualizationsResponseDTO> update(@PathVariable Long id, @RequestBody VirtualizationsRequestDTO dto) {
        try {
            LOGGER.info("Received request to update virtualizationPlatform with ID: {}", id);
            VirtualizationsResponseDTO updatedVirtualizationPlatform = virtualizationService.update(id, dto);
            return ResponseEntity.ok(updatedVirtualizationPlatform);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating virtualizationPlatform with ID: {}", id, ex);
            throw new RuntimeException("Error updating virtualizationPlatform: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'VP', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            LOGGER.info("Received request to delete virtualizationPlatform with ID: {}", id);
            virtualizationService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            LOGGER.error("Error deleting virtualizationPlatform with ID: {}", id, ex);
            throw new RuntimeException("Error deleting virtualizationPlatform: " + ex.getMessage());
        }
    }



    @PreAuthorize("hasPermission(#vpId, 'VP', 'EDIT')")
    @PostMapping("/{vp_id}/add-users")
    public void addUsersToVP(@PathVariable Long vp_id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to add users to virtual platform with ID: {}", vp_id);
        virtualizationService.addUsersToVP(vp_id, userIds);
    }

    @PreAuthorize("hasPermission(#vp_id, 'VP', 'DELETE')")
    @DeleteMapping("/{vp_id}/remove-users")
    public void removeUserFromVP(@PathVariable Long vp_id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to delete users to virtual platform with ID: {}", vp_id);
        virtualizationService.removeUsersToVP(vp_id, userIds);
    }


    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/users")
    public ResponseEntity<List<VirtualizationsResponseDTO>> getAllByUser() {
        LOGGER.info("Received request to get all virtual platforms by user");
        List<VirtualizationsResponseDTO> virtualizationPlatforms = virtualizationService.getAllByUser();
        return ResponseEntity.ok(virtualizationPlatforms);
    }

    @PreAuthorize("hasPermission(#vp_id, 'VP', 'READ')")
    @GetMapping("/{vp_id}/user")
    public ResponseEntity<VirtualizationsResponseDTO> getByUser(@RequestParam Long vp_id) {
        LOGGER.info("Received request to get virtual platform with ID: {}", vp_id);
        VirtualizationsResponseDTO dto = virtualizationService.getByUser(vp_id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasPermission(#id, 'VP', 'READ')")
    @GetMapping("/ip/user")
    public ResponseEntity<List<VirtualizationsResponseDTO>> getByIpAndUser(@RequestParam String ip, @RequestParam Long userId) {
        LOGGER.info("Received request to fetch Virtualization Platform with IP: {}", ip);
        List<VirtualizationsResponseDTO> virtualizationPlatforms = virtualizationService.getByIpAndUser(ip, userId);
        return ResponseEntity.ok(virtualizationPlatforms);
    }


    @PreAuthorize("hasPermission(#vp_id, 'VP', 'EDIT')")
    @PutMapping("/{vp_id}/update")
    public ResponseEntity<VirtualizationsResponseDTO> updateForUser(@PathVariable Long vp_id, VirtualizationsRequestDTO dto) {
        LOGGER.info("Received request to update virtual platform with ID: {}", vp_id);
        VirtualizationsResponseDTO vp = virtualizationService.updateByUser(vp_id, dto);
        return ResponseEntity.ok(vp);
    }

    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/users/paged")
    public ResponseEntity<Page<VirtualizationsResponseDTO>> getAllByUserPaged(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LOGGER.info("Received request to get all virtual platforms by user in page.");
        Page<VirtualizationsResponseDTO> dto = virtualizationService.getAllByUserPaginated(page, size);
        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/count")
    public ResponseEntity<Long> countByUser() {
        LOGGER.info("Received request to count virtual platforms by user.");
        Long l = virtualizationService.countByUser();
        return ResponseEntity.ok(l);
    }

    @PreAuthorize("hasPermission(#vp_id, 'VP', 'READ')")
    @GetMapping("/{vp_id}/access/user")
    public ResponseEntity<Boolean> isAccessibleByUser(@PathVariable Long vp_id) {
        LOGGER.info("Received request to check if virtual platform id : {} accessible by user.", vp_id);
        Boolean b = virtualizationService.isAccessibleByUser(vp_id);
        return ResponseEntity.ok(b);
    }

    @PreAuthorize("hasPermission(null, 'VP', 'READ')")
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getIdsByUser() {
        LOGGER.info("Received request to get virtual platforms by user.");
        List<Long> l = virtualizationService.getIdsByUser();
        return ResponseEntity.ok(l);
    }
}
