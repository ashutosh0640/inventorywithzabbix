package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.MessageDTO;
import com.ashutosh0640.inventy.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendDirectMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        MessageDTO message = messageService.sendDirectMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/group/send")
    public ResponseEntity<MessageDTO> sendGroupMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long groupId = Long.valueOf(payload.get("groupId").toString());
        String content = payload.get("content").toString();

        MessageDTO message = messageService.sendGroupMessage(senderId, groupId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversation/{user1Id}/{user2Id}")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable Long user1Id, @PathVariable Long user2Id) {
        List<MessageDTO> messages = messageService.getConversation(user1Id, user2Id);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<MessageDTO>> getGroupMessages(@PathVariable Long groupId) {
        List<MessageDTO> messages = messageService.getGroupMessages(groupId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageDTO>> getUnreadMessages(@PathVariable Long userId) {
        List<MessageDTO> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId, @RequestParam Long userId) {
        messageService.markAsRead(messageId, userId);
        return ResponseEntity.ok().build();
    }

    // WebSocket message handling
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO message, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("username");
        // Handle real-time message sending
        if (message.getGroupId() != null) {
            messageService.sendGroupMessage(message.getSenderId(), message.getGroupId(), message.getContent());
        } else {
            messageService.sendDirectMessage(message.getSenderId(), message.getReceiverId(), message.getContent());
        }
    }
}
