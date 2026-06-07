package com.balaji.finance.config.util;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.balaji.finance.entity.Users;

public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Users user;

    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(
            Users user,
            List<GrantedAuthority> authorities) {

        this.user = user;
        this.authorities = authorities;
    }

    public Users getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}