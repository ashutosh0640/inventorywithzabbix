package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Permissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PermissionRepository extends JpaRepository<Permissions, Long> {


}
