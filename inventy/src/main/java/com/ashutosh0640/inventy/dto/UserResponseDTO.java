package com.ashutosh0640.inventy.dto;

import java.time.LocalDateTime;

public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private RoleResponseDTO role;
    private Boolean isActive;
    private Boolean isBlocked;
    private LocalDateTime lastActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profilePictureUrl;

    public UserResponseDTO() {    }

    public UserResponseDTO(Long id, String username, String email, String fullName, String phoneNumber, RoleResponseDTO role, Boolean isActive, Boolean isBlocked, LocalDateTime lastActive, LocalDateTime createdAt, LocalDateTime updatedAt, String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.isActive = isActive;
        this.isBlocked = isBlocked;
        this.lastActive = lastActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.profilePictureUrl = profilePictureUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public RoleResponseDTO getRole() {
        return role;
    }

    public void setRole(RoleResponseDTO role) {
        this.role = role;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getBlocked() {
        return isBlocked;
    }

    public void setBlocked(Boolean blocked) {
        isBlocked = blocked;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}

