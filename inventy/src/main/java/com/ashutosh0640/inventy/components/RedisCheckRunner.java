package com.ashutosh0640.inventy.components;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public class RedisCheckRunner implements CommandLineRunner {
    private final RedisConnectionFactory connectionFactory;

    public RedisCheckRunner(RedisConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    @Override
    public void run(String... args) {
        try (var conn = connectionFactory.getConnection()) {
            String pong = conn.ping();
            System.out.println("✅ Redis connected from Spring Boot, reply: " + pong);
        } catch (Exception e) {
            System.err.println("❌ Spring Boot Redis failed: " + e.getMessage());
        }
    }
}

