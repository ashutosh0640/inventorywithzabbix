package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.repository.GroupMembersRepository;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMembersService {

    private final GroupMembersRepository groupMembersRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupMembersService(GroupMembersRepository groupMembersRepository,
                               GroupRepository groupRepository,
                               UserRepository userRepository) {
        this.groupMembersRepository = groupMembersRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public List<GroupMembers> saveAll(List<GroupMembers> members) {
        return groupMembersRepository.saveAll(members);
    }

    public GroupMembers save(GroupMembers member) {
        return groupMembersRepository.save(member);
    }

    public GroupMembers addMember(Long groupId, Long userId, Boolean isAdmin) {
        Group group = groupRepository.getReferenceById(groupId);
        User user = userRepository.getReferenceById(userId);
        GroupMembers gm = new GroupMembers();
        gm.setGroup(group);
        gm.setUser(user);
        gm.setAdmin(isAdmin);
        return this.save(gm);
    }

    public List<GroupMembers> getByGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(()->new ResourceNotFoundException("Group not found by id: "+groupId));
        return groupMembersRepository.findByGroup(group);
    }

    public Boolean changeAdmin(Long memberId) {
        GroupMembers gm = groupMembersRepository.getReferenceById(memberId);
        gm.setAdmin(!gm.isAdmin());
        gm = this.save(gm);
        return gm.isAdmin();
    }

    public void removeMemberFromGroup(Long memberId, Long groupId) {
        groupMembersRepository.removeMemberFromGroup(memberId, groupId);
    }

    public void deleteById(Long id) {
        groupMembersRepository.deleteById(id);
    }

    public void deleteByIds(List<Long> ids) {
        ids.forEach(this::deleteById);
    }

}