package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.NetworkDevices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NetworkDeviceRepository extends JpaRepository<NetworkDevices, Long> {

    @Query("SELECT n FROM NetworkDevices n JOIN n.users u WHERE n.id = :id AND u.id = :userId")
    Optional<NetworkDevices> getByIdAndUser(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT n FROM NetworkDevices n " +
            "JOIN n.users u " +
            "JOIN n.interfaces i WHERE" +
            ":ip IS NULL OR (i.ip LIKE CONCAT('%', :ip, '%') AND "+
            "u.id = :userId)")
    List<NetworkDevices> getByIpAndUser(@Param("ip") String ip,
                                              @Param("userId") Long userId);

    @Query("SELECT n FROM NetworkDevices n JOIN n.users u WHERE u.id = :userId")
    List<NetworkDevices> getAllByUser(@Param("userId") Long userId);


    @Query("SELECT n FROM NetworkDevices n JOIN n.users u WHERE u.id = :userId")
    Page<NetworkDevices> geAllByUserPageable(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT n FROM NetworkDevices n "+
            "JOIN n.users u WHERE n.rack.id = :id AND u.id = :userId")
    List<NetworkDevices> getByRackAndUser(@Param("id") Long id, @Param("userId") Long userId);
}
