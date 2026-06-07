package com.balaji.finance.config.util;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.UserRole;
import com.balaji.finance.entity.Users;
import com.balaji.finance.repo.UserRepo;
import com.balaji.finance.repo.UserRoleRepository;

@Service
public class MyOwnUserDetails implements UserDetailsService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Users user = userRepository.findByName(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"));

        List<UserRole> mappings =
                userRoleRepository.findByUser(user);

        List<GrantedAuthority> authorities =
                mappings.stream()
                        .map(mapping ->
                                new SimpleGrantedAuthority(
                                        "ROLE_" +
                                        mapping.getRole()
                                               .getRoleName()))
                        .collect(Collectors.toList());

        return new CustomUserDetails(
                user,
                authorities);
    }
}