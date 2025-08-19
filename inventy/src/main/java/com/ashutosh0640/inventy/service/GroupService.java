package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Group createGroup(String name, String description, Long createdById, List<Long> memberIds) {
        Optional<User> creator = userRepository.findById(createdById);

        if (creator.isPresent()) {
            Group group = new Group(name, description, creator.get());

            Set<User> members = new HashSet<>();
            members.add(creator.get()); // Add creator as member

            // Add other members
            for (Long memberId : memberIds) {
                userRepository.findById(memberId).ifPresent(members::add);
            }

            group.setMembers(members);
            group = groupRepository.save(group);

            // Notify all members about group creation
            members.forEach(member -> {
                if (!member.getId().equals(createdById)) {
                    notificationService.createNotification(
                            member,
                            "Added to Group",
                            "You've been added to group: " + name,
                            NotificationType.USER_ACTION
                    );
                }
            });

            return group;
        }
        throw new RuntimeException("Creator not found");
    }

    public Group addMemberToGroup(Long groupId, Long userId) {
        Optional<Group> group = groupRepository.findById(groupId);
        Optional<User> user = userRepository.findById(userId);

        if (group.isPresent() && user.isPresent()) {
            group.get().getMembers().add(user.get());
            Group savedGroup = groupRepository.save(group.get());

            // Notify user about being added to group
            notificationService.createNotification(
                    user.get(),
                    "Added to Group",
                    "You've been added to group: " + group.get().getName(),
                    NotificationType.USER_ACTION
            );

            return savedGroup;
        }
        throw new RuntimeException("Group or user not found");
    }

    public List<Group> getUserGroups(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return groupRepository.findGroupsByMember(user.get());
        }
        return List.of();
    }

    public List<Group> getAllGroups() {
        return groupRepository.findByActiveTrue();
    }
}
