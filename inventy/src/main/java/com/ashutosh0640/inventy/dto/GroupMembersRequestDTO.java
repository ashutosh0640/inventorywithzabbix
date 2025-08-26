package com.ashutosh0640.inventy.dto;

public class GroupMembersRequestDTO {
    private Long groupId;
    private Long userId;
    private Boolean isAdmin;

    public GroupMembersRequestDTO() {    }

    public GroupMembersRequestDTO(Long groupId, Long userId, Boolean isAdmin) {
        this.groupId = groupId;
        this.userId = userId;
        this.isAdmin = isAdmin;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }
}
