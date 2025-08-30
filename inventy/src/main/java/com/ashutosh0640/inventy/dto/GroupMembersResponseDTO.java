package com.ashutosh0640.inventy.dto;

import java.time.LocalDateTime;

public class GroupMembersResponseDTO {
    private Long id;
    private GroupResponseDTO group;
    private UserResponseDTO user;
    private Boolean isAdmin;
    private LocalDateTime joinTime;

    public GroupMembersResponseDTO() {    }

    public GroupMembersResponseDTO(
            Long id,
            GroupResponseDTO group,
            UserResponseDTO user,
            Boolean isAdmin,
            LocalDateTime joinTime) {
        this.id = id;
        this.group = group;
        this.user = user;
        this.isAdmin = isAdmin;
        this.joinTime = joinTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GroupResponseDTO getGroupResponseDTO() {
        return group;
    }

    public void setGroupResponseDTO(GroupResponseDTO groupResponseDTO) {
        this.group = groupResponseDTO;
    }

    public UserResponseDTO getUserResponseDTO() {
        return user;
    }

    public void setUserResponseDTO(UserResponseDTO userResponseDTO) {
        this.user = userResponseDTO;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }

    public LocalDateTime getJoinTime() {
        return joinTime;
    }

    public void setJoinTime(LocalDateTime joinTime) {
        this.joinTime = joinTime;
    }
}
