package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Permissions;
import com.ashutosh0640.inventy.entity.Role;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

//    Optional<Role> findByRoleNameContainsIgnoreCase(String roleName);

    @Query("SELECT r FROM Role r WHERE LOWER(r.roleName) LIKE LOWER(CONCAT('%', :roleName, '%'))")
    Optional<Role> findByRoleNameContainsIgnoreCase(@Param("roleName") String roleName);


    @Query("SELECT r FROM Role r JOIN r.permissions p WHERE p.id = :permissionId")
    List<Role> findAllByPermission(Long permissionId);

    @Modifying
    @Transactional
    @Query("UPDATE Role r SET r.permissions = :permissions WHERE r.id = :roleId")
    void updateRolePermissions(@Param("roleId") Integer roleId, @Param("permissions") List<Permissions> permissions);

    @Modifying
    @Query(value = "DELETE FROM role_permissions WHERE project_id = :projectId AND role_id = :roleId", nativeQuery = true)
    void removeUserFromRole(@Param("projectId") Long projectId, @Param("roleId") Long roleId);

    @Modifying
    @Query(value = "INSERT INTO role_permissions (project_id, user_id) VALUES (:projectId, :userId)", nativeQuery = true)
    void addUserToRole(@Param("projectId") Long projectId, @Param("userId") Long userId);

}

