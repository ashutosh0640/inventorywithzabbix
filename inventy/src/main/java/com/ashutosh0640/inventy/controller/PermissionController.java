package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.PermissionRequestDTO;
import com.ashutosh0640.inventy.dto.PermissionResponseDTO;
import com.ashutosh0640.inventy.service.PermissionService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/permission")
public class PermissionController {

    private final PermissionService pService;
    private final Logger LOGGER = LoggerFactory.getLogger(PermissionController.class);

    public PermissionController(PermissionService pService) {
        this.pService = pService;
    }

    @PreAuthorize("hasPermission(null, 'PERMISSION', 'WRITE')")
    @PostMapping
    public ResponseEntity<PermissionResponseDTO> createPermission(@RequestBody PermissionRequestDTO dto) {
        LOGGER.info("Received request to save permission: {}", dto.getName());
        PermissionResponseDTO p = pService.createPermission(dto);
        return ResponseEntity.ok().body(p);
    }

    @PreAuthorize("hasPermission(null, 'PERMISSION', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> savePermissionsInBatches(@RequestBody List<PermissionRequestDTO> permisisons,
                                                         @RequestParam(defaultValue = "100") int batchSize) {
        LOGGER.info("Received request to save {} permissions in batches of {}", permisisons.size(), batchSize);
        pService.savePermissionsInBatches(permisisons, batchSize);
        return ResponseEntity.status(HttpStatus.CREATED).body("Permissions saved successfully in batches.");
    }


    @PreAuthorize("hasPermission(#id, 'PERMISSION', 'READ')")
    @GetMapping("/{id}")
    public PermissionResponseDTO getById(@PathVariable Long id) {
        LOGGER.info("Received request to get permission by id: {}", id);
        return pService.getById(id);
    }

    @PreAuthorize("hasPermission(null, 'PERMISSION', 'READ')")
    @GetMapping
    public List<PermissionResponseDTO> getAllPermissions() {
        LOGGER.info("Received request to get all permissions");
        return pService.getAllPermissions();
    }

    @Transactional
    @PreAuthorize("hasPermission(#permissionId, 'PERMISSION', 'EDIT')")
    @PostMapping("/add-permission/roles")
    public void assignPermissionToRole(@RequestParam Integer roleId, @RequestBody Set<Long> permissionIds) {
        LOGGER.info("Received request to assign permission to role: {}", roleId);
        pService.assignPermissionToRole(roleId, permissionIds);
    }

    @PreAuthorize("hasPermission(#permissionId, 'PERMISSION', 'EDIT')")
    @DeleteMapping("/remove")
    public void revokePermissionFromRole(@RequestParam Integer roleId, @RequestBody Set<Long> permissionIds) {
        LOGGER.info("Received request to revoke permission from role: {}", roleId);
        pService.revokePermissionFromRole(roleId, permissionIds);
    }


    @PreAuthorize("hasPermission(null, 'PERMISSION', 'DELETE')")
    @DeleteMapping
    public void deletePermission(@RequestParam Long id) {
        LOGGER.info("Received request to get delete permission by id {}", id);
        pService.deletePermission(id);
    }
}
