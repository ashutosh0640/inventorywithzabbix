package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.PermissionRequestDTO;
import com.ashutosh0640.inventy.dto.PermissionResponseDTO;
import com.ashutosh0640.inventy.entity.Permissions;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.enums.PermissionType;
import com.ashutosh0640.inventy.enums.ResourceType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.PermissionMapper;
import com.ashutosh0640.inventy.repository.PermissionRepository;
import com.ashutosh0640.inventy.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(PermissionService.class);


    public PermissionService(PermissionRepository permissionRepository, RoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
    }

    public PermissionResponseDTO createPermission(PermissionRequestDTO dto) {
        try {
            LOGGER.info("Saving Permission Request");


            Permissions permission = new Permissions();
            permission.setName(PermissionType.valueOf(dto.getName().toUpperCase()));
            permission.setDescription(dto.getDescription());
            permission.setResourceType(ResourceType.valueOf(dto.getResourceType().toUpperCase()));

            if (!dto.getRoleIds().isEmpty()) {
                Set<Role> roles = new HashSet<>(roleRepository.findAllById(dto.getRoleIds()));
                permission.setRoles(roles);
            }
            Permissions savedPermission = permissionRepository.save(permission);

            return PermissionMapper.toDTO(savedPermission, savedPermission.getRoles());

        } catch (Exception ex) {
            LOGGER.error("Found error while saving permission. Name: {}. Reason: {}",dto.getName(), ex.getMessage());
            throw new RuntimeException("Found error while saving permission. Name: " + dto.getName()+". Reason: "+ ex.getMessage());

        }

    }

    @Transactional
    public void savePermissionsInBatches(List<PermissionRequestDTO> dtos, int batchSize) {
        try {
            LOGGER.info("Saving {} permissions in batches of {}", dtos.size(), batchSize);

            List<Permissions> entities = dtos.stream()
                    .map(dto-> {
                        Set<Role> roles = new HashSet<>();
                        if (dto.getRoleIds() != null && !dto.getRoleIds().isEmpty()) {
                            roles = dto.getRoleIds().stream()
                                    .map(id -> {
                                        return roleRepository.findById(id)
                                                .orElseThrow(() -> new ResourceNotFoundException("Role not found by id: "+id));

                                    }).collect(Collectors.toSet());
                        }
                        return PermissionMapper.toEntity(dto, roles);
                    })
                    .collect(Collectors.toList());

            int totalPermissions = entities.size();
            for (int i = 0; i < totalPermissions; i += batchSize) {
                List<Permissions> batch = entities.subList(i, Math.min(i + batchSize, totalPermissions));
                permissionRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalPermissions));
            }
            LOGGER.info("All permissions have saved successfully.");
        } catch (Exception ex) {
            LOGGER.error("Error saving permissions: ", ex);
            throw new RuntimeException("Failed to save permissions. Reason: " + ex.getMessage());
        }
    }



    public void assignPermissionToRole(Integer roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found by ID: "+roleId));

        permissionIds.forEach(id -> {
            Permissions permission = permissionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Permission not found by ID: "+id));
            role.getPermissions().add(permission);
        });
        roleRepository.save(role);
    }

    public void revokePermissionFromRole(Integer roleId, Set<Long> permissionIds) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        permissionIds.forEach(id -> {
            role.getPermissions().removeIf(p -> p.getId().equals(id));
        });

        roleRepository.save(role);
    }


    public PermissionResponseDTO getById(Long id) {
        if (id == null || id < 1) {
            LOGGER.warn("Id cannot be null or less than 1.");
            throw new InvalidParameterException("Id cannot be null or less than 1.");
        }
        Permissions p = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission is not found by Id: "+id));
        return PermissionMapper.toDTO(p, p.getRoles());
    }

    public List<PermissionResponseDTO> getAllPermissions() {
        List<Permissions> permission = permissionRepository.findAll();
        return permission.stream().map(p->{
            return PermissionMapper.toDTO(p, p.getRoles());
        }).collect(Collectors.toList());
    }

    public void deletePermission(Long permissionId) {
        // First remove permission from all roles
        List<Role> roles = roleRepository.findAllByPermission(permissionId);
        roles.forEach(role -> {
            role.getPermissions().removeIf(p -> p.getId().equals(permissionId));
            roleRepository.save(role);
        });

        // Then delete permission
        permissionRepository.deleteById(permissionId);
    }
}
