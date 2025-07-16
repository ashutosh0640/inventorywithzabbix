package com.ashutosh0640.inventy.repository;


import com.ashutosh0640.inventy.entity.Hosts;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.concurrent.CompletableFuture;

@Repository
public interface HostRepository extends JpaRepository<Hosts, Long> {

//    @Query("SELECT COUNT(h) from Hosts h JOIN h.interfaces i WHERE h.hostType = :type AND i.status = :status")
//    Long countHost(@Param("type") HostType type, @Param("status") Status status);

//    @Query(value = "SELECT COUNT(h.id) FROM hosts h JOIN interfaces i ON h.id = i.host_id WHERE h.host_type = ?1 AND i.status = ?2", nativeQuery = true)
//    Long countHost(String hostType, String status);

    @Query(value = "SELECT COUNT(h.id) FROM hosts h JOIN interfaces i ON h.id = i.host_id WHERE h.host_type = :type AND i.status = :status", nativeQuery = true)
    Long countHost(@Param("type") String type, @Param("status") String status);




}
