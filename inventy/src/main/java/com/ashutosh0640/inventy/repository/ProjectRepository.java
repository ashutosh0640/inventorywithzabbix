package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Project;
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
public interface ProjectRepository extends JpaRepository<Project, Long> {


    // 1. Get all projects assigned to a user
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    List<Project> findAllByUser(@Param("userId") Long userId);

    // 2. Get a single project assigned to a user
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId AND p.id = :projectId")
    Optional<Project> findByUserId(@Param("userId") Long userId, @Param("projectId") Long projectId);



    // 8. Remove user from project
    @Modifying
    @Query(value = "DELETE FROM project_location WHERE project_id = :projectId AND location_id = :locationId", nativeQuery = true)
    void removeLocationFromProject(@Param("projectId") Long projectId, @Param("userId") Long locationId);

    @Modifying
    @Query(value = "DELETE FROM project_location WHERE location_id = :location_id", nativeQuery = true)
    void removeLocationFromAllProject(@Param("locationId") Long locationId);

    @Modifying
    @Query(value = "INSERT INTO project_location (project_id, location_id) VALUES (:projectId, :locationId)", nativeQuery = true)
    void addLocationToProject(@Param("projectId") Long projectId, @Param("locationId") Long locationId);

    // 8. Remove user from project
    @Modifying
    @Query(value = "DELETE FROM project_user WHERE project_id = :projectId AND user_id = :userId", nativeQuery = true)
    void removeUserFromProject(@Param("projectId") Long projectId, @Param("userId") Long userId);


    @Transactional
    @Modifying
    @Query(value = "INSERT INTO project_user (project_id, user_id) VALUES (:projectId, :userId)", nativeQuery = true)
    void addUserToProject(@Param("projectId") Long projectId, @Param("userId") Long userId);


    // 5. Get paginated project list for a user
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    Page<Project> findAllByUserId(@Param("userId") Long userId, Pageable pageable);


    @Query("SELECT p FROM Project p JOIN p.users u WHERE u = :userId AND LOWER (p.name) LIKE LOWER (CONCAT('%', :name, '%') )")
    List<Project> findByNameContainingIgnoreCase(Long userId, String name);


    // 6. Search by project name (partial match) for a user with pagination
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Project> searchByNameAndUserId(@Param("name") String name, @Param("userId") Long userId, Pageable pageable);


    // Additional Useful Methods

    // 7. Count how many projects are assigned to a user
    @Query("SELECT COUNT(p) FROM Project p JOIN p.users u WHERE u.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM Project p JOIN p.locations l JOIN User u WHERE p.id = :projectId AND u.id = :userId")
    long countLocationInProjectByUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);

    // 8. Check if a project is accessible by a user (for security filtering)
    @Query("SELECT COUNT(p) > 0 FROM Project p JOIN p.users u WHERE p.id = :projectId AND u.id = :userId")
    boolean existsByIdAndUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);

    // 9. Get project IDs accessible by a user (for filtering related queries)
    @Query("SELECT p.id FROM Project p JOIN p.users u WHERE u.id = :userId")
    List<Long> findAllProjectIdsByUserId(@Param("userId") Long userId);
}
