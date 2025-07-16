package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Interfaces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterfaceRepository extends JpaRepository<Interfaces, Long> {
}
