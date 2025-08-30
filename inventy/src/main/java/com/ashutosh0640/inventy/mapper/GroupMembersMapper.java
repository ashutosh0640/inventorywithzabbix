package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.GroupMembersResponseDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;
import com.ashutosh0640.inventy.entity.User;

public class GroupMembersMapper {

    public static GroupMembers toEntity(Group group, User user, Boolean isAdmin) {
        GroupMembers gm = new GroupMembers();
        gm.setGroup(group);
        gm.setUser(user);
        gm.setAdmin(isAdmin);
        return gm;
    }

    public static GroupMembersResponseDTO toDTO(GroupMembers gm) {
        GroupMembersResponseDTO dto = new GroupMembersResponseDTO();
        dto.setId(gm.getId());
        dto.setUserResponseDTO(UserMapper.toDTO(gm.getUser()));
        dto.setAdmin(gm.isAdmin());
        dto.setJoinTime(gm.getJoinDate());
        return dto;
    }

    public static GroupMembersResponseDTO toDTO(GroupMembers gm, Group group) {
        GroupMembersResponseDTO dto = toDTO(gm);
        dto.setGroupResponseDTO(GroupMapper.toDTO(gm.getGroup()));
        return dto;
    }
}
