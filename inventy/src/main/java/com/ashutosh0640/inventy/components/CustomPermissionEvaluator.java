package com.ashutosh0640.inventy.components;



import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.*;
import com.ashutosh0640.inventy.enums.ResourceType;
import com.ashutosh0640.inventy.enums.RoleType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomPermissionEvaluator.class);

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        LOGGER.info("Permission evaluator has been called for {}. Target: {}", authentication.getName() ,targetDomainObject);
        if (!authentication.isAuthenticated()) {
            return false;
        }

        // Check if user has root access
        if (hasRole(authentication)) {
            return true;
        }

        // Get resource type from the target object
        ResourceType resourceType = getResourceType(targetDomainObject);
        String permissionString = (String) permission;

        // Check permissions in database
        return checkPermission(authentication, resourceType, permissionString);
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        LOGGER.info("Permission evaluator has been called for {}. TargetId: {} and Target type: {} and Permission: {}", authentication.getName() ,targetId, targetType, permission);
        if (!authentication.isAuthenticated()) {
            return false;
        }

        LOGGER.info("Checking role for permission {} to {}: ", permission, targetType);
        if (hasRole(authentication)) {
            return true;
        }

        ResourceType resourceType = ResourceType.valueOf(targetType.toUpperCase());
        String permissionString = (String) permission;
        LOGGER.info("Request for {} has permission of {}", resourceType, permissionString);

        return checkPermission(authentication, resourceType, permissionString);
    }

    private boolean hasRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + RoleType.ROOT.name()));
    }

    private static final Map<Class<?>, ResourceType> typeMapping = new HashMap<>();

    static {
        typeMapping.put(User.class, ResourceType.USER);
        typeMapping.put(UserRequestDTO.class, ResourceType.USER);
        typeMapping.put(Role.class, ResourceType.ROLE);
        typeMapping.put(RoleRequestDTO.class, ResourceType.ROLE);
        typeMapping.put(Permissions.class, ResourceType.PERMISSION);
        typeMapping.put(PermissionRequestDTO.class, ResourceType.PERMISSION);
        typeMapping.put(Project.class, ResourceType.PROJECT);
        typeMapping.put(ProjectRequestDTO.class, ResourceType.PROJECT);
        typeMapping.put(Location.class, ResourceType.LOCATION);
        typeMapping.put(LocationRequestDTO.class, ResourceType.LOCATION);
        typeMapping.put(Racks.class, ResourceType.RACK);
        typeMapping.put(RackRequestDTO.class, ResourceType.RACK);
        typeMapping.put(BareMetalServers.class, ResourceType.BAREMETAL);
        typeMapping.put(BareMetalServerRequestDTO.class, ResourceType.BAREMETAL);
        typeMapping.put(Virtualizations.class, ResourceType.VP);
        typeMapping.put(VirtualizationsRequestDTO.class, ResourceType.VP);
        typeMapping.put(VirtualMachines.class, ResourceType.VM);
        typeMapping.put(VirtualMachineRequestDTO.class, ResourceType.VM);
        typeMapping.put(NetworkDevices.class, ResourceType.FIREWALL);
    }

    private ResourceType getResourceType(Object target) {
        ResourceType type = typeMapping.get(target.getClass());
        if (type != null) return type;
        throw new IllegalArgumentException("Unknown resource type: " + target.getClass().getName());
    }


    private boolean checkPermission(Authentication authentication, ResourceType resourceType, String permission) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();


        StringBuilder permissionBuilder = new StringBuilder(resourceType.toString());
        permissionBuilder.append("_").append(permission).append("_").append(resourceType.toString());
        permission = permissionBuilder.toString();
        for ( GrantedAuthority g : authorities) {
            if (Objects.equals(g.getAuthority(), permissionBuilder.toString())) {
                return true;
            }
        }
        return false;
    }
}
