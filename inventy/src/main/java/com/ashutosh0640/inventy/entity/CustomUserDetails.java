package com.ashutosh0640.inventy.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName()));
//    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Add the role as a SimpleGrantedAuthority
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getRoleName()));

        // Add all permissions of the role as authorities
        user.getRole().getPermissions().forEach(permission -> {
            String authority = permission.getResourceType().toString() + "_" + permission.getName(); // e.g., PROJECT_READ
            authorities.add(new SimpleGrantedAuthority(authority));
        });

        return authorities;
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return user.getIsActive();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getIsBlocked();
    }

    @Override
    public boolean isEnabled() {
        return user.getIsActive();
    }

    public Long getId() { return user.getId(); }

    
}
