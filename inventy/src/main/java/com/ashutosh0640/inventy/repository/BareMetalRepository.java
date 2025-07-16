package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.BareMetalServers;
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
public interface BareMetalRepository extends JpaRepository<BareMetalServers, Long> {

    List<Virtualizations> findByHostNameContainingIgnoreCase(String name);

    // Get all bareMetalServers assigned to a user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId")
    List<BareMetalServers> findAllByUser(@Param("userId") Long userId);


    // Get a single bareMetalServer assigned to a user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId AND b.id = :baremetalId")
    Optional<BareMetalServers> findByUser(@Param("userId") Long userId, @Param("baremetalId") Long baremetalId);


    @Query("SELECT s FROM BareMetalServers s " +
            "JOIN s.interfaces i " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%')")
    List<BareMetalServers> findByIp(@Param("ip") String ip);



    @Query("SELECT b FROM BareMetalServers b JOIN b.users u JOIN b.rack r WHERE r.id = :rackId AND u.id = :userId")
    List<BareMetalServers> findByRackAndUser(@Param("rackId") Long rackId, @Param("userId") Long userId);


    @Query("SELECT b FROM BareMetalServers b " +
            "JOIN b.interfaces i " +
            "JOIN b.users u " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%') AND u.id = :userId")
    List<BareMetalServers> findByIpAndUser(@Param("ip") String ip, @Param("userId") Long userId);

    // Find by serial number for a specific user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u " +
            "WHERE b.serialNumber = :serialNumber AND u.id = :userId")
    Optional<BareMetalServers> findBySerialNumberAndUser(
            @Param("serialNumber") String serialNumber,
            @Param("userId") Long userId);

    // Find by model name (contains, case-insensitive) for a specific user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u " +
            "WHERE LOWER(b.modelName) LIKE LOWER(CONCAT('%', :modelName, '%')) " +
            "AND u.id = :userId")
    List<BareMetalServers> findByModelNameAndUserContainingIgnoreCase(
            @Param("modelName") String modelName,
            @Param("userId") Long userId);

    // Find by server name (contains, case-insensitive) for a specific user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u " +
            "WHERE LOWER(b.hostName) LIKE LOWER(CONCAT('%', :hostName, '%')) " +
            "AND u.id = :userId")
    List<BareMetalServers> findByServerNameAndUserContainingIgnoreCase(
            @Param("hostName") String hostName,
            @Param("userId") Long userId);

    // Alternative method combining all search criteria with user filter
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u WHERE " +
            "(:serialNumber IS NULL OR b.serialNumber = :serialNumber) AND " +
            "(:modelName IS NULL OR LOWER(b.modelName) LIKE LOWER(CONCAT('%', :modelName, '%'))) AND " +
            "(:hostName IS NULL OR LOWER(b.hostName) LIKE LOWER(CONCAT('%', :hostName, '%'))) AND " +
            "u.id = :userId")
    List<BareMetalServers> searchAny(
            @Param("serialNumber") String serialNumber,
            @Param("modelName") String modelName,
            @Param("hostName") String hostName,
            @Param("userId") Long userId);




    // Remove user from baremetal
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM host_user WHERE host_id = :hostId AND user_id = :userId", nativeQuery = true)
    void removeUser(@Param("hostId") Long hostId, @Param("userId") Long userId);



    @Modifying
    @Transactional
    @Query(value = "INSERT INTO host_user (host_id, user_id) VALUES (:hostId, :userId)", nativeQuery = true)
    void addUser(@Param("hostId") Long hostId, @Param("userId") Long userId);


    // Delete all bareMetalServers assigned to a user (removes user-bareMetalServer association)
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM host_user WHERE user_id = :userId", nativeQuery = true)
    void removeAllForUser(@Param("userId") Long userId);


    // Get paginated bareMetalServer list for a user
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId")
    Page<BareMetalServers> findAllByUserPaginated(@Param("userId") Long userId, Pageable pageable);


    // Search by bareMetalServer name (partial match) for a user with pagination
    @Query("SELECT b FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId AND LOWER(b.hostName) LIKE LOWER(CONCAT('%', :hostName, '%'))")
    Page<BareMetalServers> searchByNameAndUser(@Param("hostName") String hostName, @Param("userId") Long userId, Pageable pageable);


    // Count how many bareMetalServers are assigned to a user
    @Query("SELECT COUNT(b) FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId")
    Long countByUser(@Param("userId") Long userId);


    // Check if a bareMetalServer is accessible by a user (for security filtering)
    @Query("SELECT COUNT(b) > 0 FROM BareMetalServers b JOIN b.users u WHERE b.id = :bareMetalServerId AND u.id = :userId")
    Boolean existsByIdAndUser(@Param("bareMetalServerId") Long bareMetalServerId, @Param("userId") Long userId);


    // Get bareMetalServer IDs accessible by a user (for filtering related queries)
    @Query("SELECT b.id FROM BareMetalServers b JOIN b.users u WHERE u.id = :userId")
    List<Long> findAllIdsByUser(@Param("userId") Long userId);


    @Query("SELECT COUNT(DISTINCT b) FROM BareMetalServers b JOIN b.rack r  WHERE r.location.id = :locationId")
    Long countByLocation(@Param("locationId") Long locationId);


    @Query("SELECT COUNT(DISTINCT s) FROM BareMetalServers s " +
            "JOIN s.rack r " +
            "JOIN r.location l " +
            "JOIN s.users u " +
            "WHERE l.id = :locationId AND u.id = :userId")
    Long countByUserAndLocation(@Param("locationId") Long locationId, @Param("userId") Long userId);

}
