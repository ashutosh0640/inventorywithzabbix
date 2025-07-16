package com.ashutosh0640.inventy.components;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JWTConfig {

    private String secretKey;
    private String algorithm;
    private String expiration;
}
