package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/status")
@CrossOrigin(origins = "*")
public class StatusController {

    @Autowired
    private RedisService redisService;

    @GetMapping("/online-users")
    public ResponseEntity<List<String>> getOnlineUsers() {
        List<String> onlineUsers = redisService.getOnlineUsers();
        return ResponseEntity.ok(onlineUsers);
    }

    @GetMapping("/user/{username}/online")
    public ResponseEntity<Map<String, Boolean>> isUserOnline(@PathVariable String username) {
        boolean isOnline = redisService.isUserOnline(username);
        return ResponseEntity.ok(Map.of("online", isOnline));
    }
}
