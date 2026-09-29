package com.example.GrantTrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder) {

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        UserDetails faculty = User.builder()
                .username("faculty")
                .password(passwordEncoder.encode("faculty123"))
                .roles("FACULTY")
                .build();

        return new InMemoryUserDetailsManager(admin, faculty);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Login/test endpoint
                .requestMatchers("/api/auth/**").authenticated()

                // Faculty - GET only
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/faculties/**"
                ).hasAnyRole("ADMIN", "FACULTY")

                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/applications/**"
                ).hasAnyRole("ADMIN", "FACULTY")

                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/api/expenditures/**"
                ).hasAnyRole("ADMIN", "FACULTY")

                // Faculty modification - ADMIN only
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/faculties/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/faculties/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.DELETE,
                    "/api/faculties/**"
                ).hasRole("ADMIN")

                // Application modification - ADMIN only
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/applications/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/applications/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.DELETE,
                    "/api/applications/**"
                ).hasRole("ADMIN")

                // Expenditure modification - ADMIN only
                .requestMatchers(
                    org.springframework.http.HttpMethod.POST,
                    "/api/expenditures/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.PUT,
                    "/api/expenditures/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    org.springframework.http.HttpMethod.DELETE,
                    "/api/expenditures/**"
                ).hasRole("ADMIN")

                // Everything else requires login
                .anyRequest().authenticated()
            )

            .httpBasic(httpBasic -> {});

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                    "http://127.0.0.1:5500",
                    "http://localhost:5500"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}