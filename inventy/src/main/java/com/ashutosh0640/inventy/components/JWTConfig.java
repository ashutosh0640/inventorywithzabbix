package com.ashutosh0640.inventy.components;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JWTConfig {

    private String secretKey;
    private String algorithm;
    private String expiration;

    public JWTConfig() {    }

    public JWTConfig(String secretKey, String algorithm, String expiration) {
        this.secretKey = secretKey;
        this.algorithm = algorithm;
        this.expiration = expiration;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getExpiration() {
        return expiration;
    }

    public void setExpiration(String expiration) {
        this.expiration = expiration;
    }
}
