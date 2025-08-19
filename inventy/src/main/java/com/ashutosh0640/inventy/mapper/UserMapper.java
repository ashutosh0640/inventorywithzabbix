package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.dto.UserRequestDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.service.ProfilePictureService;

import java.io.IOException;
import java.time.LocalDateTime;

public class UserMapper {

    // Convert UserRequestDTO to User entity
    public static User toEntity(UserRequestDTO dto, Role role ) throws IOException {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "");
        user.setRole(role);
        user.setActive(dto.getActive() != null ? dto.getActive() : true);
        user.setBlocked(dto.getBlocked() != null ? dto.getBlocked() : false);
        user.setLastActive(LocalDateTime.now());

        if (dto.getProfilePicture() != null) {
            String url = ProfilePictureService.getprofileUrl(dto.getProfilePicture());
            user.setProfilePictureUrl(url);
        }
        return user;
    }

    // Convert User entity to UserResponseDTO
    public static UserResponseDTO toDTO(User user) {

        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setActive(user.getActive());
        dto.setBlocked(user.getBlocked());
        dto.setLastActive(user.getLastActive());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }


    public static UserResponseDTO toDTO(User user, Role role) {
        UserResponseDTO userDto = toDTO(user);
        userDto.setRole(RoleMapper.toDTO(role));
        return userDto;
    }
}

