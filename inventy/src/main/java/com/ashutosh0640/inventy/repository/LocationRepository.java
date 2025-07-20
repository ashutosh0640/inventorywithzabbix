package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Location;
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
public interface LocationRepository extends JpaRepository<Location, Long> {


    // 1. Get all locations assigned to a user
    @Query("SELECT l FROM Location l JOIN l.users u WHERE u.id = :userId")
    List<Location> findAllByUserId(@Param("userId") Long userId);


    // 2. Get a single location assigned to a user
    @Query("SELECT l FROM Location l JOIN l.users u WHERE u.id = :userId AND l.id = :locationId")
    Optional<Location> findByUserId(@Param("userId") Long userId, @Param("locationId") Long locationId);


    @Query("SELECT DISTINCT l FROM Project p JOIN p.locations l JOIN p.users u WHERE p.id = :projectId AND u.id = :userId")
    List<Location> findLocationsForProjectByUser(@Param("projectId") Long projectId, @Param("userId") Long userId);


    @Query("SELECT l FROM Location l JOIN l.users u WHERE  u.id = :userId AND LOWER (l.name) LIKE LOWER(CONCAT('%', :name, '%') )")
    List<Location> findByNameContainingIgnoreCase(@Param("name") String name,  @Param("userId") Long userId);


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM location_user WHERE location_id = :locationId AND user_id = :userId", nativeQuery = true)
    void removeUserFromLocation(@Param("locationId") Long locationId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO location_user (location_id, user_id) VALUES (:location_id, :userId)", nativeQuery = true)
    void addUserToLocation(@Param("location_id") Long location_id, @Param("userId") Long userId);


    // 3. Delete all locations assigned to a user (removes user-location association)
    @Modifying
    @Query("DELETE FROM Location l WHERE EXISTS (SELECT u FROM l.users u WHERE u.id = :userId)")
    void deleteAllByUserId(@Param("userId") Long userId);

    // 4. Delete one location by ID if user is assigned
    @Modifying
    @Query("DELETE FROM Location l WHERE l.id = :locationId AND EXISTS (SELECT u FROM l.users u WHERE u.id = :userId)")
    void deleteByUserId(@Param("userId") Long userId, @Param("locationId") Long locationId);

    // 5. Get paginated location list for a user
    @Query("SELECT l FROM Location l JOIN l.users u WHERE u.id = :userId")
    Page<Location> findAllByUserId(@Param("userId") Long userId, Pageable pageable);


    // 6. Search by location name (partial match) for a user with pagination
    @Query("SELECT l FROM Location l JOIN l.users u WHERE u.id = :userId AND LOWER (l.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Location> searchByNameAndUserId(@Param("name") String name, @Param("userId") Long userId, Pageable pageable);

    // Additional Useful Methods

    // 7. Count how many locations are assigned to a user
    @Query("SELECT COUNT (l) FROM Location l JOIN l.users u WHERE u.id = :userId")
    long countByUserId(@Param("userId") Long userId);


    // 8. Check if a location is accessible by a user (for security filtering)
    @Query("SELECT COUNT (l) > 0 FROM Location l JOIN l.users u WHERE l.id = :locationId AND u.id = :userId")
    boolean existsByIdAndUserId(@Param("locationId") Long locationId, @Param("userId") Long userId);


    // 9. Get location IDs accessible by a user (for filtering related queries)
    @Query("SELECT l.id FROM Location l JOIN l.users u WHERE u.id = :userId")
    List<Long> findAllLocationIdsByUserId(@Param("userId") Long userId);



    @Query("SELECT l.id, l.name, COUNT(r.id) FROM Location l LEFT JOIN l.racks r GROUP BY l.id, l.name")
    List<Object[]> getRackCountPerLocation();


    @Query("SELECT l.name, COUNT(DISTINCT r.id), COUNT(DISTINCT s.id), COUNT(DISTINCT vp.id), COUNT(DISTINCT vm.id) FROM Location l LEFT JOIN l.racks r LEFT JOIN r.servers s LEFT JOIN s.virtualizations vp LEFT JOIN vp.virtualMachines vm  GROUP BY l.id")
    List<Object[]> getCountsPerLocation();

    @Query(value = "SELECT " +
            "l.name AS location, " +
            "COUNT(DISTINCT r.id) AS rack_count, " +
            "COUNT(DISTINCT b.id) AS server_count, " +
            "COUNT(DISTINCT n.id) AS device_count, " +
            "COUNT(DISTINCT s.id) AS slots_count, " +
            "(COUNT(DISTINCT CASE WHEN s.status = 'OCCUPIED' THEN s.id END) * 100.0 / NULLIF(COUNT(DISTINCT s.id), 0)) AS occupied_percentage " +
            "FROM locations l " +
            "LEFT JOIN racks r ON r.location_id = l.id " +
            "LEFT JOIN baremetals b ON r.id = b.rack_id " +
            "LEFT JOIN network_devices n ON r.id = n.rack_id " +
            "LEFT JOIN rack_slots s ON r.id = s.rack_id " +
            "GROUP BY l.name", nativeQuery = true)
    List<Object[]> getLocationDetails();


}
