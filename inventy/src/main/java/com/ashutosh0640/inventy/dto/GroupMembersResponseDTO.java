package com.ashutosh0640.inventy.dto;

import java.time.LocalDateTime;

public class GroupMembersResponseDTO {
    private Long id;
    private GroupResponseDTO groupResponseDTO;
    private UserResponseDTO userResponseDTO;
    private Boolean isAdmin;
    private LocalDateTime joinTime;

    public GroupMembersResponseDTO() {    }

    public GroupMembersResponseDTO(
            Long id,
            GroupResponseDTO groupResponseDTO,
            UserResponseDTO userResponseDTO,
            Boolean isAdmin,
            LocalDateTime joinTime) {
        this.id = id;
        this.groupResponseDTO = groupResponseDTO;
        this.userResponseDTO = userResponseDTO;
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
        return groupResponseDTO;
    }

    public void setGroupResponseDTO(GroupResponseDTO groupResponseDTO) {
        this.groupResponseDTO = groupResponseDTO;
    }

    public UserResponseDTO getUserResponseDTO(UserResponseDTO dto) {
        return userResponseDTO;
    }

    public void setUserResponseDTO(UserResponseDTO userResponseDTO) {
        this.userResponseDTO = userResponseDTO;
    }

    public Boolean getAdmin(boolean admin) {
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
