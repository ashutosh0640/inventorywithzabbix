package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.entity.GroupMembers;
import com.ashutosh0640.inventy.service.GroupMembersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gm")
public class GroupMembersController {

    private final GroupMembersService groupMembersService;

    public GroupMembersController(GroupMembersService groupMembersService) {
        this.groupMembersService = groupMembersService;
    }

    @PostMapping
    public ResponseEntity<List<GroupMembers>> saveAll(@RequestBody List<GroupMembers> members) {
        List<GroupMembers> savedMembers = groupMembersService.saveAll(members);
        return new ResponseEntity<>(savedMembers, HttpStatus.CREATED);
    }

    @PostMapping("/save")
    public ResponseEntity<GroupMembers> save(GroupMembers member) {
        GroupMembers savedMember = groupMembersService.save(member);
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PostMapping("/add")
    public ResponseEntity<GroupMembers> addMember(@RequestParam Long groupId, @RequestParam Long userId, @RequestParam(defaultValue = "false") Boolean isAdmin) {
        GroupMembers savedMember = groupMembersService.addMember(groupId, userId, isAdmin);
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PostMapping("/group")
    public ResponseEntity<List<GroupMembers>> getByGroup(@RequestParam Long groupId) {
        List<GroupMembers> savedMembers = groupMembersService.getByGroup(groupId);
        return new ResponseEntity<>(savedMembers, HttpStatus.CREATED);
    }

    @PatchMapping("/changeAdmin")
    public ResponseEntity<Boolean> changeAdmin(Long memberId) {
        Boolean isAdmin = groupMembersService.changeAdmin(memberId);
        return new ResponseEntity<>(isAdmin, HttpStatus.OK);
    }

    @DeleteMapping("/member")
    public void removeMemberFromGroup(Long memberId, Long groupId) {
        groupMembersService.removeMemberFromGroup(memberId, groupId);
    }

    @DeleteMapping
    public void deleteById(@RequestParam Long id) {
        groupMembersService.deleteById(id);
    }

    @DeleteMapping("/ids")
    public void deleteByIds(@RequestBody List<Long> ids) {
        groupMembersService.deleteByIds(ids);
    }

}
