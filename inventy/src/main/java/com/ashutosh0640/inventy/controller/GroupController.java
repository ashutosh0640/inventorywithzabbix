package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.GroupResponseDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<GroupResponseDTO> createGroup(@RequestBody Map<String, Object> payload) {
        String name = payload.get("name").toString();
        String description = payload.get("description").toString();

        GroupResponseDTO group = groupService.createGroup(name, description);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}")
    public ResponseEntity<GroupResponseDTO> addMember(@PathVariable Long groupId, @RequestBody List<Long> usersId) {
        GroupResponseDTO group = groupService.addMembersToGroup(groupId, usersId);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/user")
    public ResponseEntity<List<GroupResponseDTO>> getUserGroups() {
        List<GroupResponseDTO> groups = groupService.getUserGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GroupResponseDTO>> getAllGroups() {
        List<GroupResponseDTO> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }
}
