package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.LoginRequestDTO;
import com.ashutosh0640.inventy.dto.LoginResponseDTO;
import com.ashutosh0640.inventy.dto.UserRequestDTO;
import com.ashutosh0640.inventy.entity.CustomUserDetails;
import com.ashutosh0640.inventy.entity.Role;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.UserMapper;
import com.ashutosh0640.inventy.repository.RoleRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {


    public final UserRepository userRepository;
    public final RoleRepository roleRepository;
    public final PasswordEncoder passwordEncoder;
    public final AuthenticationManager authenticationManager;
    public final JWTService jwtService;
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationService.class);


    public AuthenticationService(UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager,
                                 JWTService jwtService ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public void register(UserRequestDTO dto) {
        try {

            Role role = roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + dto.getRoleId()));

            dto.setPassword(passwordEncoder.encode(dto.getPassword()));

            User user = userRepository.save(UserMapper.toEntity(dto, role));
            LOGGER.info("Registered user: {}", user.getUsername());
        } catch (Exception ex) {
            LOGGER.error("Error while registering user: ", ex);
            throw new RuntimeException("Failed to register user. Reason: " + ex.getMessage());
        }
    }


    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        try {
            LOGGER.info("Login request received");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // If authentication is successful
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtService.getToken(userDetails.getUsername());
            LOGGER.info("Login successful, JWT token generated.");
            userRepository.updateLastActive(userDetails.getUsername());
            return new LoginResponseDTO( userDetails.getId(), userDetails.getUsername(), userDetails.getAuthorities().toString(), token);
        } catch (BadCredentialsException ex) {
            LOGGER.error("Invalid username or password", ex);
            throw new UsernameNotFoundException("Invalid username or password");
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            throw new RuntimeException(ex.getMessage());
        }
    }

    public boolean verifyToken(String token) {
        try {
            LOGGER.info("Verifying token.");
            return jwtService.isTokenExpired(token);
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            throw new RuntimeException("Error verifying token. Reason "+ex.getMessage());
        }
    }
}
