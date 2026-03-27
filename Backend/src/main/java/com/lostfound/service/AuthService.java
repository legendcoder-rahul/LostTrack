package com.lostfound.service;

import com.lostfound.dto.AuthResponse;
import com.lostfound.dto.LoginRequest;
import com.lostfound.dto.RegisterRequest;
import com.lostfound.entity.User;
import com.lostfound.entity.UserRole;
import com.lostfound.repository.UserRepository;
import com.lostfound.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .message("Email already registered")
                    .build();
        }
        
        // Check if passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return AuthResponse.builder()
                    .message("Passwords do not match")
                    .build();
        }
        
        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(UserRole.USER)
                .build();
        
        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().toString())
                .message("User registered successfully")
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (user == null) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .message("Invalid email or password")
                    .build();
        }
        
        if (!user.getIsActive()) {
            return AuthResponse.builder()
                    .message("User account is inactive")
                    .build();
        }
        
        String token = tokenProvider.generateToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().toString())
                .message("Logged in successfully")
                .build();
    }
}
