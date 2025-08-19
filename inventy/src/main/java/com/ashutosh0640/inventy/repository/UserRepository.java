package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.RoleType;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByFullNameContainingIgnoreCase(String name);

    @Query("SELECT u.role FROM User u WHERE u.id = :userId")
    Optional<Role> findRoleByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :userId")
    int updateUserRole(@Param("userId") Long userId, @Param("role") Role role);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastActive = CURRENT_TIMESTAMP WHERE u.username = :username")
    void updateLastActive(@Param("username") String username);

}
