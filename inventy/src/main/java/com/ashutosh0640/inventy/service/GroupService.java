package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.GroupResponseDTO;
import com.ashutosh0640.inventy.entity.Group;
import com.ashutosh0640.inventy.entity.GroupMembers;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.NotificationType;
import com.ashutosh0640.inventy.mapper.GroupMapper;
import com.ashutosh0640.inventy.repository.GroupRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public GroupResponseDTO createGroup(String name, String description) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        User creator = userRepository.getReferenceById(userId);

        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setCreatedBy(creator);

        Set<GroupMembers> members = new HashSet<>();
        GroupMembers gm = new GroupMembers();
        gm.setUser(creator);
        gm.setAdmin(true);
        gm.setGroup(group);
        members.add(gm); // Add creator as member

        group.setMembers(members);

        group = groupRepository.save(group);

        // Notify all members about group creation
        members.forEach(member -> {
            if (!member.getId().equals(userId)) {
                notificationService.createNotification(
                        member.getUser(),
                        "Added to Group",
                        "You've been added to group: " + name,
                        NotificationType.USER_ACTION
                );
            }
        });
        return GroupMapper.toDTO(group, group.getMembers());
    }

    public GroupResponseDTO addMembersToGroup(Long groupId, List<Long> usersId) {
        Group group = groupRepository.getReferenceById(groupId);

        List<User> users = usersId.stream()
                .map(id->userRepository.getReferenceById(id))
                .toList();

        GroupMembers gm = new GroupMembers();
        users.forEach(u->{
            gm.setUser(u);
            group.getMembers().add(gm);
        });
        Group savedGroup =  groupRepository.save(group);

        // Notify user about being added to group
        users.forEach(user -> {
            notificationService.createNotification(
                    user,
                    "Added to a group",
                    "You,ve been added to group: "+savedGroup.getName(),
                    NotificationType.USER_ACTION
            );
        });
        return GroupMapper.toDTO(group, group.getMembers());
    }

    public List<GroupResponseDTO> getUserGroups() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        List<Group> groups = groupRepository.findGroupsByMember(userId);
        return groups.stream().map(group -> {
            return GroupMapper.toDTO(group, group.getMembers());
        }).toList();
    }

    public List<GroupResponseDTO> getAllGroups() {
        List<Group> groups = groupRepository.findByActiveTrue();
        return groups.stream().map(group -> {
            return GroupMapper.toDTO(group, group.getMembers());
        }).toList();
    }
}
