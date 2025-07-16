package com.ashutosh0640.inventy.components;

import com.ashutosh0640.inventy.service.CustomUserDetailsService;
import com.ashutosh0640.inventy.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final CustomUserDetailsService cuds;
    private final Logger LOGGER = LoggerFactory.getLogger(JWTFilter.class);


    public JWTFilter(JWTService jwtService, CustomUserDetailsService cuds) {
        this.jwtService = jwtService;
        this.cuds = cuds;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        LOGGER.info("doFilterInternal");
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                LOGGER.info("Extracting token form request header");
                token = authHeader.replace("Bearer ", "");
                username = jwtService.extractUsername(token);
            }


            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = cuds.loadUserByUsername(username);

                LOGGER.info("Found user: {}. Validating user token.", username);
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

        } catch (UsernameNotFoundException e) {
            LOGGER.error("Username not found");
            throw new RuntimeException("Username not found");
        }
        catch (Exception e) {
            LOGGER.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}
