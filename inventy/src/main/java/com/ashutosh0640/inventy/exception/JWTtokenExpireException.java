package com.ashutosh0640.inventy.exception;

public class JWTtokenExpireException extends RuntimeException{
    public JWTtokenExpireException(String message) {
        super(message);
    }
}
