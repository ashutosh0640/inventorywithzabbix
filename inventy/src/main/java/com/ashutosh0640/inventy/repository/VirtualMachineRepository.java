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
public interface VirtualMachineRepository extends JpaRepository<VirtualMachines, Long> {

    List<VirtualMachines> findByHostNameContainingIgnoreCase(String name);



    @Query("SELECT vm FROM VirtualMachines vm " +
            "JOIN vm.interfaces i " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%')")
    List<VirtualMachines> findByIp(@Param("ip") String ip);


    @Query("SELECT vm FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId AND vm.id = :vmId")
    Optional<VirtualMachines> findByUser(@Param("userId") Long userId, @Param("vmId") Long vmId);

    @Query("SELECT vm FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId")
    List<VirtualMachines> findAllByUser(@Param("userId") Long userId);


    @Query("SELECT vm FROM VirtualMachines vm " +
            "JOIN vm.interfaces i " +
            "JOIN vm.users u " +
            "WHERE i.ip LIKE CONCAT('%', :ip, '%') AND u.id = :userId")
    List<VirtualMachines> findByIpAndUser(@Param("ip") String ip, @Param("userId") Long userId);

    @Query("SELECT v FROM VirtualMachines v WHERE v.virtualizations.id = :id")
    List<VirtualMachines> findByVirtualization(@Param("id") Long id);


    @Modifying
    @Transactional
    @Query(value = "DELETE FROM host_user WHERE host_id = :vmId AND user_id = :userId", nativeQuery = true)
    void removeUserFromVm(@Param("vmId") Long vmId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "INSERT INTO host_user (host_id, user_id) VALUES (:vmId, :userId)", nativeQuery = true)
    void addUserToVm(@Param("vmId") Long vmId, @Param("userId") Long userId);


    // Get paginated project list for a user
    @Query("SELECT vm FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId")
    Page<VirtualMachines> findAllByUserPaginated(@Param("userId") Long userId, Pageable pageable);

    // Search by virtual machine name (partial match) for a user with pagination
    @Query("SELECT vm FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId AND LOWER(vm.hostName) LIKE LOWER(CONCAT('%', :hostName, '%'))")
    Page<VirtualMachines> searchByNameAndUser(@Param("hostName") String hostName, @Param("userId") Long userId, Pageable pageable);

    // Count how many projects are assigned to a user
    @Query("SELECT COUNT(vm) FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId")
    long countByUser(@Param("userId") Long userId);

    //  Check if a virtual machine is accessible by a user (for security filtering)
    @Query("SELECT COUNT(vm) > 0 FROM VirtualMachines vm JOIN vm.users u WHERE vm.id = :vmId AND u.id = :userId")
    boolean existsByIdAndUser(@Param("vmId") Long vmId, @Param("userId") Long userId);

    // Get virtual machine IDs accessible by a user (for filtering related queries)
    @Query("SELECT vm.id FROM VirtualMachines vm JOIN vm.users u WHERE u.id = :userId")
    List<Long> findAllIdsByUser(@Param("userId") Long userId);

}
