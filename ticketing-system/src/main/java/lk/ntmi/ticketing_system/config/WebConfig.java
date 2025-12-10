package lk.ntmi.ticketing_system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // <--- TRICK: This allows ALL ports (5173, 5174, 5175...)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}