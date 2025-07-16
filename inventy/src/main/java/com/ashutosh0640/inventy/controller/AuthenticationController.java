package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.LoginRequestDTO;
import com.ashutosh0640.inventy.dto.LoginResponseDTO;
import com.ashutosh0640.inventy.dto.UserRequestDTO;
import com.ashutosh0640.inventy.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public void register(@RequestBody UserRequestDTO dto) {
        try {
            LOGGER.info("Received request to register user: {}", dto.getUsername());
            authenticationService.register(dto);
            LOGGER.info("User registered successfully");
        } catch (Exception ex) {
            LOGGER.error("Error occurred while registering user: ", ex);
            throw new RuntimeException("Error occurred while registering user: " + ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        try {
            LOGGER.info("Received request to login user: {}", dto.getUsername());
            LoginResponseDTO res = authenticationService.login(dto);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while login user: ", ex);
            throw new RuntimeException("Error occurred while login user: " + ex.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Boolean> verifyToken(@RequestBody String token) {
        try {
            LOGGER.info("Received request to verify token: {}", token);
            boolean res = authenticationService.verifyToken(token);
            return ResponseEntity.ok(res);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while login user: ", ex);
            throw new RuntimeException("Error occurred while login user: " + ex.getMessage());
        }
    }
}
