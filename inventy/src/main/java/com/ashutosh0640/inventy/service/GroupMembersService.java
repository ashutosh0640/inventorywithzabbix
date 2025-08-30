package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.GroupMembersResponseDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.GroupMembersMapper;
import com.ashutosh0640.inventy.repository.GroupMembersRepository;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public void saveAll(List<GroupMembers> members) {
        groupMembersRepository.saveAll(members);
    }

    public GroupMembersResponseDTO save(GroupMembers member) {
        GroupMembers mem = groupMembersRepository.save(member);
        return GroupMembersMapper.toDTO(mem);
    }

    public GroupMembersResponseDTO addMember(Long groupId, Long userId, Boolean isAdmin) {
        Group group = groupRepository.getReferenceById(groupId);
        User user = userRepository.getReferenceById(userId);
        GroupMembers gm = new GroupMembers();
        gm.setGroup(group);
        gm.setUser(user);
        gm.setAdmin(isAdmin);
        return this.save(gm);
    }

    public List<GroupMembersResponseDTO> getByGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(()->new ResourceNotFoundException("Group not found by id: "+groupId));
        List<GroupMembers> members = groupMembersRepository.findByGroup(group);
        return members.stream().map(GroupMembersMapper::toDTO).toList();
    }

    public Page<GroupMembersResponseDTO> getByGroupAndPage(Long groupId, Integer pageNumber, Integer pageSize) {
        Pageable page =  PageRequest.of(pageNumber, pageSize);
        Page<GroupMembers> members = groupMembersRepository.findAll(page);
        return members.map(GroupMembersMapper::toDTO);
    }

    public Boolean changeAdmin(Long memberId) {
        GroupMembers gm = groupMembersRepository.findById(memberId)
                        .orElseThrow(()->new ResourceNotFoundException("Group member not found by id: "+memberId));
        gm.setAdmin(!gm.isAdmin());
        gm = groupMembersRepository.save(gm);
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