package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.dto.UserRequestDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.RoleMapper;
import com.ashutosh0640.inventy.mapper.UserMapper;
import com.ashutosh0640.inventy.repository.RoleRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO saveUser(UserRequestDTO dto) {
        try {

            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + dto.getRoleId()));

            dto.setPassword(passwordEncoder.encode(dto.getPassword()));

            User user = userRepository.save(UserMapper.toEntity(dto, role));
            LOGGER.info("Saving user: {}", user.getUsername());
            return UserMapper.toDTO(user, user.getRole());
        } catch (Exception ex) {
            LOGGER.error("Error saving user: ", ex);
            throw new RuntimeException("Failed to save user. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void saveUsersInBatches(List<UserRequestDTO> users, int batchSize) {
        try {
            LOGGER.info("Saving {} users in batches of {}", users.size(), batchSize);

            List<User> entities = users.stream()
                    .map(dto -> {
                        Role role = roleRepository.findById(dto.getRoleId())
                                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + dto.getRoleId()));
                        try {
                            dto.setPassword(passwordEncoder.encode(dto.getPassword()));

                            return UserMapper.toEntity(dto, role);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());

            int totalUsers = entities.size();
            for (int i = 0; i < totalUsers; i += batchSize) {
                List<User> batch = entities.subList(i, Math.min(i + batchSize, totalUsers));
                userRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalUsers));
            }

            LOGGER.info("All users saved successfully.");
        } catch (Exception ex) {
            LOGGER.error("Error saving users: ", ex);
            throw new RuntimeException("Failed to save users. Reason: " + ex.getMessage());
        }
    }


    public UserResponseDTO getUserById(Long id) {
        try {
            LOGGER.info("Fetching user with ID: {}", id);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

            return UserMapper.toDTO(user, user.getRole());

        } catch (Exception ex) {
            LOGGER.error("Error fetching user with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve user. Reason: " + ex.getMessage());
        }
    }

    public UserResponseDTO getUserByUsername(String username) {
        try {
            LOGGER.info("Fetching user with username: {}", username);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

            return UserMapper.toDTO(user, user.getRole());

        } catch (Exception ex) {
            LOGGER.error("Error fetching user with username {}: ", username, ex);
            throw new RuntimeException("Failed to retrieve user. Reason: " + ex.getMessage());
        }
    }

    public UserResponseDTO getUserByEmail(String email) {
        try {
            LOGGER.info("Fetching user with email: {}", email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

            return UserMapper.toDTO(user, user.getRole());

        } catch (Exception ex) {
            LOGGER.error("Error fetching user with email {}: ", email, ex);
            throw new RuntimeException("Failed to retrieve user. Reason: " + ex.getMessage());
        }
    }


    public List<UserResponseDTO> getAllUsers() {
        try {
            LOGGER.info("Fetching all users...");
            List<User> users = userRepository.findAll();

            return users.stream()
                    .map(u->{
                        return UserMapper.toDTO(u, u.getRole());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching users: ", ex);
            throw new RuntimeException("Failed to retrieve users. Reason: " + ex.getMessage());
        }
    }

    public RoleResponseDTO getRoleByUserId(Long id) {
        try {
            LOGGER.info("Fetching role for user id: {}", id);
             Role role = userRepository.findRoleByUserId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found for user id: " + id));
            return RoleMapper.toDTO(role);
        } catch(Exception ex) {
            LOGGER.error("Error fetching user's role: ", ex);
            throw new RuntimeException("Failed to retrieve users. Reason: " + ex.getMessage());
        }
    }

    public List<UserResponseDTO> getAllUserSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all users sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<User> users = userRepository.findAll(sort);

            return users.stream()
                    .map(u->{
                        return UserMapper.toDTO(u, u.getRole());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted users: ", ex);
            throw new RuntimeException("Failed to retrieve users. Reason: " + ex.getMessage());
        }
    }

    public Page<UserResponseDTO> getAllUserPageable(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all users with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<User> usersPage = userRepository.findAll(pageable);

            return usersPage.map(UserMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated users: ", ex);
            throw new RuntimeException("Failed to retrieve users. Reason: " + ex.getMessage());
        }
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        try {
            LOGGER.info("Updating user with ID: {}", id);

            // Find existing user
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

            // Update fields
            existingUser.setFullName(dto.getFullName());
            existingUser.setPhoneNumber(dto.getPhoneNumber());
            existingUser.setActive(dto.getActive());
            existingUser.setBlocked(dto.getBlocked());

            if (dto.getProfilePicture() !=  null) {
                String url = ProfilePictureService.getprofileUrl(dto.getProfilePicture());
                existingUser.setProfilePictureUrl(url);
            }

            // Save updated user
            User user = userRepository.save(existingUser);

            return UserMapper.toDTO(user, user.getRole());

        } catch (Exception ex) {
            LOGGER.error("Error updating user with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update user. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void updateUserRole(Long userId, int roleId) {
        LOGGER.info("Updating user role with ID: {}", userId);
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Role newRole = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(newRole);
            userRepository.save(user);
        } catch (ResourceNotFoundException ex) {
            LOGGER.error("Resource not found while updating role of User: {}", userId, ex);
            throw new ResourceNotFoundException("Resource not found. Reason: " + ex.getMessage());
        }

    }

    public void deleteUser(Long id) {
        try {
            LOGGER.info("Deleting user with ID: {}", id);

            // Check if the user exists
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

            // Delete user
            userRepository.delete(user);
            LOGGER.info("Successfully deleted user with ID: {}", id);

        } catch (Exception ex) {
            LOGGER.error("Error deleting user with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete user. Reason: " + ex.getMessage());
        }
    }

    public void deleteUsers(List<Long> userIds) {
        try {
            LOGGER.info("Deleting users with IDs: {}", userIds);

            // Fetch all users in the list
            List<User> users = userRepository.findAllById(userIds);

            if (users.isEmpty()) {
                throw new ResourceNotFoundException("No users found with the given IDs: " + userIds);
            }

            // Delete users
            userRepository.deleteAll(users);
            LOGGER.info("Successfully deleted users with IDs: {}", userIds);

        } catch (Exception ex) {
            LOGGER.error("Error deleting users with IDs {}: ", userIds, ex);
            throw new RuntimeException("Failed to delete users. Reason: " + ex.getMessage());
        }
    }


    public List<UserResponseDTO> searchUserByFullName(String fullName) {
        try {
            LOGGER.info("Searching users by name: {}", fullName);

            List<User> users = userRepository.findByFullNameContainingIgnoreCase(fullName);

            if (users.isEmpty()) {
                LOGGER.warn("No users found with name: {}", fullName);
                throw new ResourceNotFoundException("No users found matching: " + fullName);
            }

            return users.stream()
                    .map(u->{
                        return UserMapper.toDTO(u, u.getRole());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching users by name {}: ", fullName, ex);
            throw new RuntimeException("Failed to search users. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void updateUserLastActive(String username) {
        userRepository.updateLastActive(username);
    }
}
