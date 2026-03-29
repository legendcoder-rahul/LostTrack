package com.lostfound.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("DEBUG JWT Filter: Request path: " + request.getRequestURI() + ", JWT present: " + (jwt != null));
            
            if (StringUtils.hasText(jwt)) {
                System.out.println("DEBUG JWT Filter: Token found, validating...");
                if (tokenProvider.validateToken(jwt)) {
                    String email = tokenProvider.getEmailFromToken(jwt);
                    System.out.println("DEBUG JWT Filter: Token valid, email: " + email);
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("DEBUG JWT Filter: Authentication set for: " + email);
                } else {
                    System.out.println("DEBUG JWT Filter: Token validation failed");
                }
            } else {
                System.out.println("DEBUG JWT Filter: No JWT token found in request");
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            System.out.println("DEBUG JWT Filter: Exception - " + ex.getMessage());
            ex.printStackTrace();
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        System.out.println("DEBUG JWT Filter: Authorization header: " + bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
