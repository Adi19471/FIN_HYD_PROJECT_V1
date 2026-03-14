package com.balaji.finance.config.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.balaji.finance.entity.Users;
import com.balaji.finance.repo.UserRepo;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepo userRepository;
    
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepo userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {

        	Users user = new Users();
            user.setName("admin");
            user.setPassword(passwordEncoder.encode("admin"));
            user.setRole("ADMIN");

            userRepository.save(user);

            System.out.println("Default admin user created.");
        }
        
        
        
    }
}
