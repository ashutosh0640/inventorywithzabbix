package com.ashutosh0640.inventy.repository;

import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroupMembersRepository extends JpaRepository<GroupMembers, Long> {
    List<GroupMembers> findByGroup(Group group);

    @Query(value = "DELETE FROM group_members WHERE user_id = :memberId, group_id = :groupId", nativeQuery = true)
    void removeMemberFromGroup(Long memberId, Long groupId);
}