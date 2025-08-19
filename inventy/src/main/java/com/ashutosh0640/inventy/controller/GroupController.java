package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, Object> payload) {
        String name = payload.get("name").toString();
        String description = payload.get("description").toString();
        Long createdById = Long.valueOf(payload.get("createdById").toString());
        List<Long> memberIds = (List<Long>) payload.get("memberIds");

        Group group = groupService.createGroup(name, description, createdById, memberIds);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMember(@PathVariable Long groupId, @PathVariable Long userId) {
        Group group = groupService.addMemberToGroup(groupId, userId);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable Long userId) {
        List<Group> groups = groupService.getUserGroups(userId);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }
}
