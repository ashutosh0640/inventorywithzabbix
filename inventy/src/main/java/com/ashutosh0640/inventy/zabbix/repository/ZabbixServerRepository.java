package com.ashutosh0640.inventy.zabbix.repository;

import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ZabbixServerRepository extends JpaRepository<ZabbixServer, Long> {

    Optional<ZabbixServer> findByName(String name);

    @Query("SELECT z FROM ZabbixServer z WHERE z.url LIKE CONCAT('%', :ip, '%')")
    ZabbixServer findByIp(String ip);

    @Query("SELECT z FROM ZabbixServer z JOIN z.project p JOIN p.users u WHERE p.id = :projectId AND u.id = :userId")
    Optional<ZabbixServer> findByProjectIdAndUserId(@Param("projectId") Long projectId, @Param("userId") Long userId);

    @Query("SELECT zx FROM ZabbixServer zx Join zx.project p JOIN p.users u WHERE u.id = :userId")
    List<ZabbixServer> findByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT('status') as online FROM ZabbixServer z WHERE z.status = 'CONNECTED'")
    Long countOnlineZabbixServer();


    @Modifying
    @Transactional
    @Query("UPDATE ZabbixServer zs SET zs.status = :status WHERE zs.id = :id")
    void updateStatus(@Param("id") Long id, @Param("status") String status);


}
