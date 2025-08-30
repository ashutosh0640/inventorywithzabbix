package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.GroupMembersResponseDTO;
import com.ashutosh0640.inventy.dto.GroupRequestDTO;
import com.ashutosh0640.inventy.dto.GroupResponseDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class GroupMapper {

    public static Group toEntity(GroupRequestDTO dto, Set<GroupMembers> members) {
        Group grp = new Group();
        grp.setName(dto.getName());
        grp.setDescription(dto.getDescription());
        grp.setMembers(members);
        return grp;
    }

    public static GroupResponseDTO toDTO(Group grp) {
        GroupResponseDTO dto = new GroupResponseDTO();
        dto.setId(grp.getId());
        dto.setName(grp.getName());
        dto.setDescription(grp.getDescription());
        dto.setCreatedBy(UserMapper.toDTO(grp.getCreatedBy()));
        dto.setCreatedAt(grp.getCreatedAt());
        dto.setActive(grp.isActive());
        return dto;
    }

    public static GroupResponseDTO toDTO(Group grp, Set<GroupMembers> gm) {
        GroupResponseDTO dto = toDTO(grp);
        Set<GroupMembersResponseDTO> members = gm.stream().map(GroupMembersMapper::toDTO).collect(Collectors.toSet());
        dto.setMembers(members);
        return dto;
    }

}
