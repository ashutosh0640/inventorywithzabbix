package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Racks;
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
public interface RackRepository extends JpaRepository<Racks, Long> {


    List<Racks> findByNameContainingIgnoreCase(String name);


    // Get all racks assigned to a user
    @Query("SELECT r FROM Racks r JOIN r.users u WHERE u.id = :userId")
    List<Racks> findAllByUser(@Param("userId") Long userId);


    // Get a single Rack assigned to a user
    @Query("SELECT r FROM Racks r JOIN r.users u WHERE u.id = :userId AND r.id = :rackId")
    Optional<Racks> findByUser(@Param("userId") Long userId, @Param("rackId") Long rackId);



    // Get paginated Rack list for a user
    @Query("SELECT r FROM Racks r JOIN r.users u WHERE u.id = :userId")
    Page<Racks> findAllByUserPaginated(@Param("userId") Long userId, Pageable pageable);


    // Search by Rack name (partial match) for a user with pagination
    @Query("SELECT r FROM Racks r JOIN r.users u WHERE u.id = :userId AND LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Racks> searchByNameAndUser(@Param("name") String name, @Param("userId") Long userId, Pageable pageable);


    @Modifying
    @Transactional
    @Query(value = "INSERT INTO rack_user (rack_id, user_id) VALUES (:rackId, :userId)", nativeQuery = true)
    void addUserToRack(@Param("rackId") Long rackId, @Param("userId") Long userId);

    // Remove user from Rack
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM rack_user WHERE rack_id = :rackId AND user_id = :userId", nativeQuery = true)
    void removeRackForUser(@Param("rackId") Long rackId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM rack_user WHERE user_id = :userId", nativeQuery = true)
    void removeAllRackForUser(@Param("userId") Long userId);



    // Count how many Rack are assigned to a user
    @Query("SELECT COUNT(r) FROM Racks r JOIN r.users u WHERE u.id = :userId")
    Long countByUser(@Param("userId") Long userId);


    // heck if a Rack is accessible by a user (for security filtering)
    @Query("SELECT COUNT(r) > 0 FROM Racks r JOIN r.users u WHERE r.id = :rackId AND u.id = :userId")
    boolean existsByIdAndUser(@Param("rackId") Long rackId, @Param("userId") Long userId);


    // 9. Get Rack IDs accessible by a user (for filtering related queries)
    @Query("SELECT r.id FROM Racks r JOIN r.users u WHERE u.id = :userId")
    List<Long> findAllIdsByUser(@Param("userId") Long userId);


    @Query("SELECT r FROM Racks r JOIN r.users u WHERE u.id = :userId AND r.location.id = :locationId")
    List<Racks> findByUserAndLocation(@Param("userId") Long userId, @Param("locationId") Long locationId);


    @Query("SELECT COUNT(r) FROM Racks r JOIN r.users u WHERE u.id = :userId AND r.location.id = :locationId")
    Long countByUserAndLocation(@Param("userId") Long userId, @Param("locationId") Long locationId);

}
