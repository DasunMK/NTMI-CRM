package lk.ntmi.ticketing_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Allow React to send POST requests
            .cors(cors -> cors.configure(http)) // Allow React to connect
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()  // <--- DISABLE LOGIN PAGE
            );
        return http.build();
    }
}