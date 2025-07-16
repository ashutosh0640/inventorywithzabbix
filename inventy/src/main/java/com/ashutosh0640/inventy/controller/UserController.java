package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.RoleResponseDTO;
import com.ashutosh0640.inventy.dto.UserRequestDTO;
import com.ashutosh0640.inventy.dto.UserResponseDTO;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasPermission(null, 'USER', 'WRITE')")
    @PostMapping
    public ResponseEntity<UserResponseDTO> saveUser(@Valid @RequestBody UserRequestDTO dto) {
        try {
            LOGGER.info("Received request to save user: {}", dto.getUsername());
            UserResponseDTO savedUser = userService.saveUser(dto);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving user: ", ex);
            throw new RuntimeException("Error occurred while saving user: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'USER', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> saveUsersInBatches(@RequestBody List<UserRequestDTO> users,
                                                     @RequestParam(defaultValue = "100") int batchSize) {
        try {
            LOGGER.info("Received request to save {} users in batches of {}", users.size(), batchSize);
            userService.saveUsersInBatches(users, batchSize);
            return ResponseEntity.status(HttpStatus.CREATED).body("Users saved successfully in batches.");
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving users: ", ex);
            throw new RuntimeException("Error occurred while saving users: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'USER', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        try {
            LOGGER.info("Received request to fetch user with ID: {}", id);
            UserResponseDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching user with ID {}: ", id, ex);
            throw new ResourceNotFoundException("Error occur while fetching user with id: "+id+".\n "+ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/username")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@RequestParam String username) {
        try {
            LOGGER.info("Received request to fetch user with username: {}", username);
            UserResponseDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching user with username {}: ", username, ex);
            throw new ResourceNotFoundException("Error occur while fetching user with username: "+username+".\n "+ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        try {
            LOGGER.info("Received request to fetch all users");
            List<UserResponseDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching users: ", ex);
            throw new RuntimeException("Error occur while fetching all users: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<UserResponseDTO>> getAllUserSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        try {
            LOGGER.info("Received request to fetch users sorted by {} in {} order", field, sortOrder);
            List<UserResponseDTO> sortedUsers = userService.getAllUserSorted(sortOrder, field);
            return new ResponseEntity<>(sortedUsers, HttpStatus.OK);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching sorted users: ", ex);
            throw new RuntimeException("Error fetching sorted users: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<UserResponseDTO>> getAllUserPageable(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            LOGGER.info("Received request to fetch users - Page: {}, Size: {}", page, size);
            Page<UserResponseDTO> pagedUsers = userService.getAllUserPageable(page, size);
            return ResponseEntity.ok(pagedUsers);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching paginated users: ", ex);
            throw new RuntimeException("Error fetching users: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'USER', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO dto) {
        LOGGER.info("Received request to update user with ID: {}", id);
        try {
            UserResponseDTO updatedUser = userService.updateUser(id, dto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating user with ID: {}", id, ex);
            throw new RuntimeException("Error updating user: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(#userId, 'USER', 'EDIT')")
    @PutMapping("/update-role")
    public void updateUserRole(@RequestParam Long userId, @RequestParam int roleId) {
        LOGGER.info("Received request to update user role with ID: {}", userId);
        try {
            userService.updateUserRole(userId, roleId);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating user role with ID: {}", userId, ex);
            throw new RuntimeException("Error updating user role: " + ex.getMessage());
        }
    }



    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDTO>> searchUserByFullName(@RequestParam String n) {
        LOGGER.info("Received request to search users with name: {}", n);
        try {
            List<UserResponseDTO> users = userService.searchUserByFullName(n);
            return ResponseEntity.ok(users);
        } catch (RuntimeException ex) {
            LOGGER.error("Error searching users with name: {}", n, ex);
            throw new RuntimeException("Error searching users: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/email")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@RequestParam String e) {
        LOGGER.info("Received request to search users with email: {}", e);
        try {
            UserResponseDTO users = userService.getUserByEmail(e);
            return ResponseEntity.ok(users);
        } catch (RuntimeException ex) {
            LOGGER.error("Error searching users with name: {}", e, ex);
            throw new RuntimeException("Error searching users: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'USER', 'READ')")
    @GetMapping("/roles")
    public ResponseEntity<RoleResponseDTO> getRoleByUserId(@RequestParam Long id) {
        LOGGER.info("Received request to search role of user with id: {}", id);
        try {
            RoleResponseDTO role = userService.getRoleByUserId(id);
            return ResponseEntity.ok(role);
        } catch (RuntimeException ex) {
            LOGGER.error("Error searching users with name: {}", id, ex);
            throw new RuntimeException("Error searching users: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(#id, 'USER', 'EDIT')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        LOGGER.info("Received request to delete user with ID: {}", id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            LOGGER.error("Error deleting user with ID: {}", id, ex);
            throw new RuntimeException("Error deleting user: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'USER', 'DELETE')")
    @DeleteMapping
    public ResponseEntity<Void> deleteUsers(@RequestBody List<Long> ids) {
        LOGGER.info("Received request to delete users with ids: {}", ids.toString());
        try {
            userService.deleteUsers(ids);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            LOGGER.error("Error deleting users with ids: {}", ids, ex);
            throw new RuntimeException("Error while deleting users: " + ex.getMessage());
        }
    }
}
