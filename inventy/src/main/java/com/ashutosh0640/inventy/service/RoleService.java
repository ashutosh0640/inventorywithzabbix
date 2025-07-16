package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.RoleRequestDTO;
import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.entity.Permissions;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.enums.RoleType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.RoleMapper;
import com.ashutosh0640.inventy.repository.PermissionRepository;
import com.ashutosh0640.inventy.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(RoleService.class);

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public RoleResponseDTO saveRole(RoleRequestDTO dto) {
        try {
            Role role = roleRepository.save(RoleMapper.toEntity(dto));
            LOGGER.info("Saving role: {}", role);
            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());
        } catch (Exception ex) {
            LOGGER.error("Error saving role: ", ex);
            throw new RuntimeException("Failed to save role. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void saveRolesInBatches(List<RoleRequestDTO> roles, int batchSize) {
        try {
            LOGGER.info("Saving {} roles in batches of {}", roles.size(), batchSize);

            List<Role> entities = roles.stream()
                    .map(RoleMapper::toEntity)
                    .collect(Collectors.toList());

            int totalRoles = entities.size();
            for (int i = 0; i < totalRoles; i += batchSize) {
                List<Role> batch = entities.subList(i, Math.min(i + batchSize, totalRoles));
                roleRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalRoles));
            }

            LOGGER.info("All roles saved successfully.");
        } catch (Exception ex) {
            LOGGER.error("Error saving roles: ", ex);
            throw new RuntimeException("Failed to save roles. Reason: " + ex.getMessage());
        }
    }



    public RoleResponseDTO getRoleById(int id) {
        try {
            LOGGER.info("Fetching role with ID: {}", id);
            Role role = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());

        } catch (Exception ex) {
            LOGGER.error("Error fetching role with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve role. Reason: " + ex.getMessage());
        }
    }



    public List<RoleResponseDTO> getAllRoles() {
        try {
            LOGGER.info("Fetching all roles...");
            List<Role> roles = roleRepository.findAll();

            return roles.stream()
                    .map(r->{
                        return RoleMapper.toDTO(r, r.getUsers(), r.getPermissions());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching roles: ", ex);
            throw new RuntimeException("Failed to retrieve roles. Reason: " + ex.getMessage());
        }
    }

    public List<RoleResponseDTO> getAllRoleSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all roles sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<Role> roles = roleRepository.findAll(sort);

            return roles.stream()
                    .map(r->{
                        return RoleMapper.toDTO(r, r.getUsers(), r.getPermissions());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted roles: ", ex);
            throw new RuntimeException("Failed to retrieve roles. Reason: " + ex.getMessage());
        }
    }

    public Page<RoleResponseDTO> getAllRolePageable(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all roles with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Role> rolesPage = roleRepository.findAll(pageable);

            return rolesPage.map(RoleMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated roles: ", ex);
            throw new RuntimeException("Failed to retrieve roles. Reason: " + ex.getMessage());
        }
    }

    public RoleResponseDTO updateRole(int id, RoleRequestDTO dto) {
        try {
            LOGGER.info("Updating role with ID: {}", id);

            // Find existing role
            Role existingRole = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

            // Update fields
            existingRole.setRoleName(RoleType.valueOf(dto.getRoleName()));

            // Save updated role
            Role role = roleRepository.save(existingRole);

            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());

        } catch (Exception ex) {
            LOGGER.error("Error updating role with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update role. Reason: " + ex.getMessage());
        }
    }

    public void deleteRole(int id) {
        try {
            LOGGER.info("Deleting role with ID: {}", id);

            // Check if the role exists
            Role role = roleRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

            // Delete role
            roleRepository.delete(role);
            LOGGER.info("Successfully deleted role with ID: {}", id);

        } catch (Exception ex) {
            LOGGER.error("Error deleting role with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete role. Reason: " + ex.getMessage());
        }
    }



    public RoleResponseDTO searchRoleByName(String name) {
        try {
            LOGGER.info("Searching roles by name: {}", name);

            Role role = roleRepository.findByRoleNameContainsIgnoreCase(name)
                    .orElseThrow(() -> new ResourceNotFoundException("No roles found matching: " + name));
            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());
        } catch (Exception ex) {
            LOGGER.error("Error while searching roles by name {}: ", name, ex);
            throw new RuntimeException("Failed to search roles. Reason: " + ex.getMessage());
        }
    }


    @Transactional
    public RoleResponseDTO updatePermissionsForRole(int roleId, Set<Long> permissionsId) {
        LOGGER.info("Updating permissions for role with ID: {}", roleId);
        try {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found by Id: "+roleId));
            List<Permissions> permissions = permissionRepository.findAllById(permissionsId);
            role.setPermissions(new HashSet<>(permissions));
            Role savedRole = roleRepository.save(role);
            return RoleMapper.toDTO(savedRole, savedRole.getUsers(), savedRole.getPermissions());
        } catch (Exception ex) {
            LOGGER.error("Error while updating permissions for role with ID {}: ", roleId, ex);
            throw new RuntimeException("Failed to update role. Reason: " + ex.getMessage());

        }

    }

    @Transactional
    public RoleResponseDTO addPermissionsToRole(int roleId, Set<Long> permissionIds) {
        try {
            LOGGER.info("Adding permissions to role with ID: {}", roleId);
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

            List<Permissions> permissions = permissionRepository.findAllById(permissionIds);

            role.getPermissions().addAll(permissions);
            role = roleRepository.save(role);
            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());
        } catch (Exception ex) {
            LOGGER.error("Error adding permissions to role with ID {}: ", roleId, ex);
            throw new RuntimeException("Failed to add permissions to role. Reason: " + ex.getMessage());
        }

    }

    @Transactional
    public RoleResponseDTO removePermissionsFromRole(int roleId, List<Long> permissionIds) {
        try {
            LOGGER.info("Removing permissions from role with ID: {}", roleId);
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

            List<Permissions> permissions = permissionRepository.findAllById(permissionIds);

            permissions.forEach(role.getPermissions()::remove);
            role = roleRepository.save(role);
            return RoleMapper.toDTO(role, role.getUsers(), role.getPermissions());
        } catch (Exception ex) {
            LOGGER.error("Error removing permissions from role with ID {}: ", roleId, ex);
            throw new RuntimeException("Failed to remove permissions from role. Reason: " + ex.getMessage());
        }

    }

}
