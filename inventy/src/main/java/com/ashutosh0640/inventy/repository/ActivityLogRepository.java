package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.ActivityLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {


    @Query("SELECT a FROM ActivityLog a ORDER BY a.timestamp DESC")
    Page<ActivityLog> findRecentActivities(Pageable pageable);

}
