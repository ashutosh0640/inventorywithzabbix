package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.components.JWTConfig;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;


@Service
public class JWTService {

    private final JWTConfig config;
    private final CustomUserDetailsService cuds;
    private final Logger LOGGER = LoggerFactory.getLogger(JWTService.class);

    public JWTService(JWTConfig config, CustomUserDetailsService cuds) {
        this.config = config;
        this.cuds = cuds;
    }

    public String getToken(String username) {
        LOGGER.info("Getting token for user {}", username);
        try {
            if (username == null || username.isEmpty()) {
                LOGGER.warn("Username is null or empty");
                throw new IllegalArgumentException("Username is null or empty");
            }
            Date exp = calculateExpirationDate();
            Collection<? extends GrantedAuthority> authorities = getAuthorities(username);
            Map<String, Object> claims = buildClaims(username, authorities);
            return buildToken(claims, exp);
        } catch (Exception e) {
            LOGGER.error("Error getting token", e);
            throw new RuntimeException("Error while generating token for username: "+username+" Reason: "+e);
        }
    }

    private Date calculateExpirationDate() {
        String expiration = config.getExpiration();
        if (expiration == null) {
            expiration = "3600";
        }
        try {
            long expirationSeconds = Long.parseLong(expiration);
            Instant now = Instant.now().plusSeconds(expirationSeconds);
            return Date.from(now);
            // return new Date(System.currentTimeMillis() + expirationSeconds*1000);
        } catch (NumberFormatException e) {
            LOGGER.error("Invalid expiration value", e);
            throw new IllegalArgumentException("Invalid expiration value. Reason: "+ e.getMessage());
        }
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String username) {
        if (username == null) {
            LOGGER.error("Username cannot be null");
            throw new IllegalArgumentException("Username cannot be null");
        }
        try {
            LOGGER.info("Getting authorities for username {}", username);
            return cuds.loadUserByUsername(username).getAuthorities();
        } catch (UsernameNotFoundException e) {
            LOGGER.error("Username not found", e);
            throw new IllegalArgumentException("Username not found. Reason: "+ e.getMessage());
        }
    }

    private Map<String, Object> buildClaims(String username, Collection<? extends GrantedAuthority> authorities) {
        LOGGER.info("Building Claims for username {}", username);
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", username);
            claims.put("iss", "inventory-app");
            claims.put("aud", "hughes");
            claims.put("iat", Instant.now().getEpochSecond());
            claims.put("roles", authorities);
            return claims;
        } catch (Exception e) {
            LOGGER.error("Error building Claims for username {}", username, e);
            throw new IllegalArgumentException("Error building Claims for username " + username);
        }
    }

    private String buildToken(Map<String, Object> claims, Date expiration) {
        return Jwts.builder()
                .claims(claims)
                .issuedAt(Date.from(Instant.now()))
                .expiration(expiration)
                .signWith(generateKey())
                .compact();
    }

    public String extractUsername(String token) {
        LOGGER.info("Extracting username from token {}", token);
        try {
            if (token == null) {
                LOGGER.warn("Token is null");
                throw new IllegalArgumentException("Token is null");
            }
            return extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
            LOGGER.error("Error extracting username from token", e);
            throw new RuntimeException("Error extracting username from token " + token);
        }
    }

    private SecretKey generateKey() {
        try {
            LOGGER.info("Generating key");
            byte[] encoded = Base64.getEncoder().encode(config.getSecretKey().getBytes());
            if (encoded.length < 32) {
                LOGGER.error("Invalid secret key length. Not secure.");
                throw new IllegalArgumentException("Invalid secret key length. Not secure.");
            }

            return Keys.hmacShaKeyFor(encoded);

        } catch (Exception e) {
            LOGGER.error("Error generating key", e);
            throw new IllegalArgumentException("Error generating key. Reason: "+ e.getMessage());
        }

    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claim = extractAllClaims(token);
        return claimResolver.apply(claim);
    }

    private Claims extractAllClaims(String token) {
        LOGGER.info("Extracting all claims");
        try {
            return Jwts.parser()
                    .verifyWith(generateKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

        } catch (ExpiredJwtException e) {
            LOGGER.error("Expired JWT exception", e);
            throw new SecurityException("Expired JWT exception. Reason: "+ e.getMessage());
        } catch (MalformedJwtException e) {
            LOGGER.error("Malformed JWT exception", e);
            throw new SecurityException("Malformed JWT exception. Reason: "+ e.getMessage());
        } catch (UnsupportedJwtException e) {
            LOGGER.error("Unsupported JWT exception", e);
            throw new SecurityException("Unsupported JWT exception. Reason: "+ e.getMessage());
        } catch (IllegalArgumentException e) {
            LOGGER.error("Invalid token", e);
            throw new IllegalArgumentException("Invalid token. Reason: "+ e.getMessage());
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        LOGGER.info("Validating token for user {}", userDetails.getUsername());
        try {
            Claims claims = extractAllClaims(token); // securely parses token
            String username = claims.getSubject();
            String issuer = claims.getIssuer();

            // Additional validations
            return username.equals(userDetails.getUsername())
                    && !isTokenExpired(token)
                    && issuer.equals("inventory-app");

        } catch (Exception e) {
            LOGGER.error("Error validating token for user {}", userDetails.getUsername(), e);
            throw new SecurityException("Error validating token for user " + userDetails.getUsername());
        }

    }

    public boolean isTokenExpired(String token) {
        LOGGER.info("Validating token expiration");
        return tokenExpirationDate(token).before(Date.from(Instant.now()));
    }


    private Date tokenExpirationDate(String token) {
        LOGGER.info("Finding token expiration date.");
        try {
            if (token == null) {
                LOGGER.warn("Token is null");
                throw new IllegalArgumentException("Token is null");
            }
            return extractClaim(token, Claims::getExpiration);
        } catch (Exception e) {
            LOGGER.error("Error extracting token expiration", e);
            throw new IllegalArgumentException("Error extracting token expiration date " + e.getMessage());
        }
    }

}
