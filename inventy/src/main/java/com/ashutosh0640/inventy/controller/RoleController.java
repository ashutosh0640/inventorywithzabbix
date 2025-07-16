package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.RoleRequestDTO;
import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.service.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/role")
public class RoleController {

    private final RoleService roleService;
    private static final Logger LOGGER = LoggerFactory.getLogger(RoleController.class);

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PreAuthorize("hasPermission(null, 'ROLE', 'WRITE')")
    @PostMapping
    public ResponseEntity<RoleResponseDTO> saveRole(@RequestBody RoleRequestDTO dto) {
        try {
            LOGGER.info("Received request to save role: {}", dto.getRoleName());
            RoleResponseDTO savedRole = roleService.saveRole(dto);
            return new ResponseEntity<>(savedRole, HttpStatus.CREATED);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving role: ", ex);
            throw new RuntimeException("Error occurred while saving role: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'ROLE', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> saveRolesInBatches(@RequestBody List<RoleRequestDTO> roles,
                                                         @RequestParam(defaultValue = "100") int batchSize) {
        try {
            LOGGER.info("Received request to save {} roles in batches of {}", roles.size(), batchSize);
            roleService.saveRolesInBatches(roles, batchSize);
            return ResponseEntity.status(HttpStatus.CREATED).body("Roles saved successfully in batches.");
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving roles: ", ex);
            throw new RuntimeException("Error occurred while saving roles: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'ROLE', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> getRoleById(@PathVariable int id) {
        try {
            LOGGER.info("Received request to fetch role with ID: {}", id);
            RoleResponseDTO role = roleService.getRoleById(id);
            return ResponseEntity.ok(role);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching role with ID {}: ", id, ex);
            throw new ResourceNotFoundException("Error occur while fetching role with id: "+id+".\n "+ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'ROLE', 'READ')")
    @GetMapping
    public ResponseEntity<List<RoleResponseDTO>> getAllRoles() {
        try {
            LOGGER.info("Received request to fetch all roles");
            List<RoleResponseDTO> roles = roleService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching roles: ", ex);
            throw new RuntimeException("Error occur while fetching all roles: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'ROLE', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<RoleResponseDTO>> getAllRoleSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        try {
            LOGGER.info("Received request to fetch roles sorted by {} in {} order", field, sortOrder);
            List<RoleResponseDTO> sortedRoles = roleService.getAllRoleSorted(sortOrder, field);
            return new ResponseEntity<>(sortedRoles, HttpStatus.OK);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching sorted roles: ", ex);
            throw new RuntimeException("Error fetching sorted roles: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'ROLE', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<RoleResponseDTO>> getAllRolePageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            LOGGER.info("Received request to fetch roles - Page: {}, Size: {}", page, size);
            Page<RoleResponseDTO> pagedRoles = roleService.getAllRolePageable(page, size);
            return ResponseEntity.ok(pagedRoles);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching paginated roles: ", ex);
            throw new RuntimeException("Error fetching roles: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'ROLE', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDTO> updateRole(@PathVariable int id, @RequestBody RoleRequestDTO dto) {
        LOGGER.info("Received request to update role with ID: {}", id);
        try {
            RoleResponseDTO updatedRole = roleService.updateRole(id, dto);
            return ResponseEntity.ok(updatedRole);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating role with ID: {}", id, ex);
            throw new RuntimeException("Error updating role: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(#id, 'ROLE', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable int id) {
        LOGGER.info("Received request to delete role with ID: {}", id);
        try {
            roleService.deleteRole(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            LOGGER.error("Error deleting role with ID: {}", id, ex);
            throw new RuntimeException("Error deleting role: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'ROLE', 'READ')")
    @GetMapping("/search/by-name")
    public ResponseEntity<RoleResponseDTO> searchRoleByName(@RequestParam String name) {
        LOGGER.info("Received request to search roles with name: {}", name);
        try {
            RoleResponseDTO roles = roleService.searchRoleByName(name);
            return ResponseEntity.ok(roles);
        } catch (RuntimeException ex) {
            LOGGER.error("Error searching roles with name: {}", name, ex);
            throw new RuntimeException("Error searching roles: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'ROLE', 'EDIT')")
    @PatchMapping("/update-permission")
    public ResponseEntity<RoleResponseDTO> updatePermissionsForRole(@RequestParam int roleId, @RequestBody Set<Long> permissionsId) {
        LOGGER.info("Received request to update permissions for role with ID: {}", roleId);
        try {
            RoleResponseDTO dto = roleService.updatePermissionsForRole(roleId, permissionsId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating permissions for role with ID: {}", roleId, ex);
            throw new RuntimeException("Error updating permissions for role: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'ROLE', 'EDIT')")
    @PostMapping("/add-permission")
    public ResponseEntity<RoleResponseDTO> addPermissionsToRole(@RequestParam int roleId, @RequestBody Set<Long> permissionIds) {
        try {
            LOGGER.info("Received request to add permissions to role with ID: {}", roleId);
            RoleResponseDTO role = roleService.addPermissionsToRole(roleId, permissionIds);
            return ResponseEntity.ok(role);
        } catch (Exception ex) {
            LOGGER.error("Error adding permissions to role with ID: {}", roleId, ex);
            throw new RuntimeException("Error adding permissions to role: " + ex.getMessage());
        }
    }



    @PreAuthorize("hasPermission(#roleId, 'ROLE', 'EDIT')")
    @DeleteMapping("/remove-permission")
    public ResponseEntity<RoleResponseDTO> removePermissionsFromRole(@RequestParam int roleId, @RequestBody List<Long> permissionIds) {
        try {
            LOGGER.info("Received request to remove permissions from role with ID: {}", roleId);
            RoleResponseDTO role = roleService.removePermissionsFromRole(roleId, permissionIds);
            return ResponseEntity.ok(role);
        } catch (Exception ex) {
            LOGGER.error("Error removing permissions from role with ID: {}", roleId, ex);
            throw new RuntimeException("Error removing permissions from role: " + ex.getMessage());
        }
    }

}
