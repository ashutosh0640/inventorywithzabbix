package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.VirtualMachines;
import com.ashutosh0640.inventy.entity.Virtualizations;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VirtualizationRepository extends JpaRepository<Virtualizations, Long> {

    List<Virtualizations> findByHostNameContainingIgnoreCase(String name);

    @Query("SELECT vp FROM Virtualizations vp " +
            "JOIN vp.interfaces i " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%')")
    List<Virtualizations> findByIp(@Param("ip") String ip);


    // Get all virtual platforms assigned to a user
    @Query("SELECT vp FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId")
    List<Virtualizations> findAllByUser(@Param("userId") Long userId);

    // Get a single virtual platform assigned to a user
    @Query("SELECT vp FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId")
    Optional<Virtualizations> findByUser(@Param("userId") Long userId, @Param("vpId") Long vpId);

    // Get paginated virtualization list for a user
    @Query("SELECT vp FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId")
    Page<Virtualizations> findAllByUser(@Param("userId") Long userId, Pageable pageable);

    // Search by virtual platform name (partial match) for a user with pagination
    @Query("SELECT vp FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId AND LOWER(vp.hostName) LIKE LOWER(CONCAT('%', :hostName, '%'))")
    Page<Virtualizations> searchByNameAndUser(@Param("hostName") String hostName, @Param("userId") Long userId, Pageable pageable);


    @Query("SELECT vp FROM Virtualizations vp " +
            "JOIN vp.interfaces i " +
            "JOIN vp.users u " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%') AND u.id = :userId")
    List<Virtualizations> findByIpAndUser(@Param("ip") String ip, @Param("userId") Long userId);


    // Remove user from project
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM host_user WHERE vp_id = :vpId AND user_id = :userId", nativeQuery = true)
    void removeUserFromVP(@Param("vp_id") Long vp_id, @Param("userId") Long userId);

    @Modifying
    @Query(value = "INSERT INTO host_user (vp_id, user_id) VALUES (:vpId, :userId)", nativeQuery = true)
    void addUserToVP(@Param("vpId") Long vpId, @Param("userId") Long userId);


    // Count how many virtual platforms are assigned to a user
    @Query("SELECT COUNT(vp) FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId")
    Long countByUser(@Param("userId") Long userId);

    // Check if a virtual platform is accessible by a user (for security filtering)
    @Query("SELECT COUNT(vp) > 0 FROM Virtualizations vp JOIN vp.users u WHERE vp.id = :vpId AND u.id = :userId")
    Boolean existsByIdAndUser(@Param("vpId") Long vpid, @Param("userId") Long userId);

    // Get virtual platform IDs accessible by a user (for filtering related queries)
    @Query("SELECT vp.id FROM Virtualizations vp JOIN vp.users u WHERE u.id = :userId")
    List<Long> findAllIdsByUser(@Param("userId") Long userId);

}
