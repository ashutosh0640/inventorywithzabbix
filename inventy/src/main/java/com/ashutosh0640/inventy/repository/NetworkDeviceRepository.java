package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.NetworkDevices;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NetworkDeviceRepository extends JpaRepository<NetworkDevices, Long> {
}
