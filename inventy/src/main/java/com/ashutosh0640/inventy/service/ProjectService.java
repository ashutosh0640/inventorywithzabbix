package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.ProjectRequestDTO;
import com.ashutosh0640.inventy.dto.ProjectResponseDTO;
import com.ashutosh0640.inventy.entity.Location;
import com.ashutosh0640.inventy.entity.Project;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.ProjectMapper;
import com.ashutosh0640.inventy.repository.LocationRepository;
import com.ashutosh0640.inventy.repository.ProjectRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import com.ashutosh0640.inventy.zabbix.dto.ZabbixServerResponseDTO;
import com.ashutosh0640.inventy.zabbix.entity.ZabbixServer;
import com.ashutosh0640.inventy.zabbix.service.ZabbixServerService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final ZabbixServerService zabbixServerService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class);

    public ProjectService(ProjectRepository projectRepository,
                          LocationRepository locationRepository,
                          UserRepository userRepository,
                          ActivityLogService activityLogService,
                          ZabbixServerService zabbixServerService) {
        this.projectRepository = projectRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
        this.zabbixServerService = zabbixServerService;
    }

    public ProjectResponseDTO saveProject(ProjectRequestDTO dto) {
        try {
            Set<Location> locations = new HashSet<>();
            Set<User> users = new HashSet<>();
            if (dto.getLocationIds() != null && !dto.getLocationIds().isEmpty()) {
                locations = dto.getLocationIds().stream()
                        .map(id -> {
                            return locationRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("Location not found by id: "+id));
                        })
                        .collect(Collectors.toSet());
            }

            if (dto.getUsersId() != null && !dto.getUsersId().isEmpty()) {
                users = dto.getUsersId().stream()
                        .map(id -> {
                            return userRepository.findById(id)
                                    .orElseThrow(() -> new ResourceNotFoundException("User not found by id: "+id));
                        })
                        .collect(Collectors.toSet());
            }

            Project project = projectRepository.save(ProjectMapper.toEntity(dto, locations, users));

            LOGGER.info("Saving project: {}", project);
            return ProjectMapper.toDTO(project, project.getLocations(), project.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error saving project: ", ex);
            throw new RuntimeException("Failed to save project. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void saveProjectsInBatches(List<ProjectRequestDTO> projects, int batchSize) {
        try {
            LOGGER.info("Saving {} projects in batches of {}", projects.size(), batchSize);

            List<Project> entities = projects.stream()
                    .map(dto -> {
                        Set<Location> locations = new HashSet<>();
                        Set<User> users = new HashSet<>();
                        if (dto.getLocationIds() != null &&  !dto.getLocationIds().isEmpty()) {

                            locations = dto.getLocationIds().stream()
                                    .map(id -> {
                                        return locationRepository.findById(id)
                                                .orElseThrow(() -> new ResourceNotFoundException("Location not found by id: "+id));
                                    })
                                    .collect(Collectors.toSet());
                        }

                        if (!dto.getUsersId().isEmpty()) {
                            users = dto.getUsersId().stream()
                                    .map(id -> {
                                        return userRepository.findById(id)
                                                .orElseThrow(() -> new ResourceNotFoundException("User not found by id: "+id));
                                    })
                                    .collect(Collectors.toSet());
                        }
                        //return projectRepository.save(ProjectMapper.toEntity(dto, locations, users));
                        return ProjectMapper.toEntity(dto, locations, users);

                    })
                    .collect(Collectors.toList());

            int totalProjects = entities.size();
            for (int i = 0; i < totalProjects; i += batchSize) {
                List<Project> batch = entities.subList(i, Math.min(i + batchSize, totalProjects));
                projectRepository.saveAll(batch);
                LOGGER.info("Saved batch {} to {}", i + 1, Math.min(i + batchSize, totalProjects));
            }

            LOGGER.info("All projects saved successfully.");
        } catch (Exception ex) {
            LOGGER.error("Error saving projects: ", ex);
            throw new RuntimeException("Failed to save projects. Reason: " + ex.getMessage());
        }
    }


    public ProjectResponseDTO getProjectById(Long id) {
        try {
            LOGGER.info("Fetching project with ID: {}", id);
            Project project = projectRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

            return ProjectMapper.toDTO(project, project.getLocations(), project.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching project with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve project. Reason: " + ex.getMessage());
        }
    }

    public Page<ProjectResponseDTO> getProjectByName(String projectname, Integer page, Integer size) {
        try {
            LOGGER.info("Fetching project with project name: {}", projectname);
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();

            // Validate `size`: must be non-null, > 0
            if (size == null || size <= 0 ) {
                size = 10;
            }

            // Validate `page`: must be non-null and ≥ 0
            if (page == null || page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, size);

            Page<Project> projects = projectRepository.searchByNameAndUserId(projectname, userId, pageable);

            if (projects.isEmpty()) {
                throw new ResourceNotFoundException("Project not found with project name: " + projectname);
            }

            List<ProjectResponseDTO> dtos = projects.stream()
                    .map(p->{
                        return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
                    })
                    .toList();

            return new PageImpl<>(dtos, pageable, dtos.size());
        } catch (Exception ex) {
            LOGGER.error("Error fetching project with project name {}: ", projectname, ex);
            throw new RuntimeException("Failed to retrieve project. Reason: " + ex.getMessage());
        }
    }



    public List<ProjectResponseDTO> getAllProjects() {
        try {
            LOGGER.info("Fetching all projects...");
            List<Project> projects = projectRepository.findAll();

            return projects.stream()
                    .map(p->{
                        return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching projects: ", ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public Long countProject() {
        return projectRepository.count();
    }


    public List<ProjectResponseDTO> getAllProjectSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all projects sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<Project> projects = projectRepository.findAll(sort);

            return projects.stream()
                    .map(p->{
                        return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted projects: ", ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public Page<ProjectResponseDTO> getAllProjectPageable(Integer page, Integer size) {
        try {
            LOGGER.info("Fetching all projects with pagination - Page: {}, Size: {}", page, size);

            // Validate `size`: must be non-null, > 0
            if (size == null || size <= 0 ) {
                size = 10;
            }

            // Validate `page`: must be non-null and ≥ 0
            if (page == null || page < 0) {
                page = 0;
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Project> projectsPage = projectRepository.findAll(pageable);

            return projectsPage.map(p->{
                return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
            });

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated projects: ", ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO dto) {
        try {
            LOGGER.info("Updating project with ID: {}", id);

            // Find existing project
            Project existingProject = projectRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

            // Update fields
            existingProject.setName(dto.getName());
            existingProject.setDescription(dto.getDescription());

            Set<User> users = dto.getUsersId().stream()
                    .map(userRepository::getReferenceById)     // returns a proxy, no query
                    .collect(Collectors.toSet());
            existingProject.setUsers(users);

            // Save updated project
            Project project = projectRepository.save(existingProject);
            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Location is updated. Name: "+existingProject.getName()
            );
            return ProjectMapper.toDTO(project, project.getLocations(), project.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error updating project with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update project. Reason: " + ex.getMessage());
        }
    }

    public void deleteProject(Long id) {
        try {
            LOGGER.info("Deleting project with ID: {}", id);

            // Check if the project exists
            Project project = projectRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + id));

            try {
                ZabbixServerResponseDTO zabbix = zabbixServerService.findByProjectIdAndUserId(id);
                if (zabbix != null) {
                    zabbixServerService.deleteEntityById(zabbix.getId());
                    activityLogService.createEntity(
                            ActivityType.DELETE,
                            "A Zabbix server details is delete. Name: "+zabbix.getName()
                    );
                }
            } catch (ResourceNotFoundException ex) {
                LOGGER.warn("No Zabbix server found for project ID: {}", id);
            }
            // delete project now
            projectRepository.delete(project);
            activityLogService.createEntity(
                    ActivityType.DELETE,
                    "A Project is delete. Name: "+project.getName()
            );
            LOGGER.info("Successfully deleted project with ID: {}", id);
        } catch (Exception ex) {
            LOGGER.error("Error deleting project with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete project. Reason: " + ex.getMessage());
        }
    }

    public void deleteProjects(List<Long> ids) {
        try {
            LOGGER.info("Deleting list of projects with IDs: {}", ids);
            if (!ids.isEmpty()) {
                ids.forEach(id -> {
                    boolean isExist = projectRepository.existsById(id);
                    if (isExist) {
                        throw new ResourceNotFoundException("Project not found with ID: " + id);
                    }
                });
            }

            // Delete all project
            projectRepository.deleteAllById(ids);
            LOGGER.info("Successfully deleted project with IDs: {}", ids);
            activityLogService.createEntity(
                    ActivityType.DELETE,
                    ids.size()+ " projects are deleted: "
            );
        } catch (Exception ex) {
            LOGGER.error("Error deleting projects with IDs {}: ", ids, ex);
            throw new RuntimeException("Failed to delete projects. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void addLocationsToProject(Long projectId, List<Long> locationIds) {
        LOGGER.info("Finding project with ID: {}", projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found by ID: " + projectId));

        Set<Location> locationsToAdd = locationIds.stream()
                .map(id -> locationRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Location not found by ID: " + id)))
                .collect(Collectors.toSet());

        project.getLocations().addAll(locationsToAdd);
        projectRepository.save(project);
    }

    @Transactional
    public void addUsersToProject(Long projectId, List<Long> userIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found by ID: " + projectId));

        Set<User> usersToAdd = userIds.stream()
                .map(id -> userRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found by ID: " + id)))
                .collect(Collectors.toSet());

        project.getUsers().addAll(usersToAdd);
        projectRepository.save(project);
    }



    @Transactional
    public void removeLocationsFromProject(Long projectId, List<Long> locationIds) {
        LOGGER.info("Finding project with ID: {}", projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found by ID: " + projectId));

        LOGGER.info("Finding Location with ID's: {}", locationIds);
        Set<Location> locationsToRemove = project.getLocations().stream()
                .filter(location -> locationIds.contains(location.getId()))
                .collect(Collectors.toSet());

        if (locationsToRemove.isEmpty()) {
            throw new RuntimeException("No matching locations found for removal in the project.");
        }

        LOGGER.info("Removing Locations with ID's: {}", locationIds);
        project.getLocations().removeAll(locationsToRemove);
        projectRepository.save(project);
    }


    @Transactional
    public void removeUsersFromProject(Long projectId, List<Long> userIds) {
        LOGGER.info("Finding project with ID: {}", projectId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found by ID: " + projectId));

        LOGGER.info("Finding Location with ID's: {}", userIds);
        Set<User> usersToRemove = project.getUsers().stream()
                .filter(user -> userIds.contains(user.getId()))
                .collect(Collectors.toSet());

        if (usersToRemove.isEmpty()) {
            throw new RuntimeException("No matching users found for removal in the project.");
        }

        project.getUsers().removeAll(usersToRemove);
        projectRepository.save(project);
    }



    // ============== User respective methods ===================================== //
    public List<ProjectResponseDTO> getAllProjectsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {

            LOGGER.info("Fetching all projects for userId: {}", userId);

            List<Project> projects = projectRepository.findAllByUser(userId);

            return projects.stream()
                    .map(p->{
                        return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching projects for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching projects. Reason: " + ex.getMessage());
        }
    }

    public ProjectResponseDTO getProjectByUser(Long projectId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching project for userId: {}", userId);
            Project project = projectRepository.findByUserId(userId, projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found for userId " + userId));

            return ProjectMapper.toDTO(project, project.getLocations(), project.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching project for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching project. Reason: " + ex.getMessage());
        }
    }




    public void addUsersToProject(Long  projectId, Set<Long> userIds) {
        LOGGER.info("Adding users to projectId: {}", projectId);
        try {
            userIds.forEach(userId -> projectRepository.addUserToProject(projectId, userId));
        } catch (Exception ex) {
            LOGGER.error("Found error while adding users to projectId {}: ", projectId, ex);
            throw new RuntimeException("Found error while adding users to project. Reason: " + ex.getMessage());
        }
    }

    public void removeUserFromProject(Long  projectId, Set<Long> userIds) {
        LOGGER.info("Revoking users to projectId: {}", projectId);
        try {
            userIds.forEach(userId -> projectRepository.removeUserFromProject(projectId, userId));
        } catch (Exception ex) {
            LOGGER.error("Found error while revoking users to projectId {}: ", projectId, ex);
            throw new RuntimeException("Found error while revoking users to project. Reason: " + ex.getMessage());
        }
    }

    public void addLocationsToProject(Long  projectId, Set<Long> locationIds) {
        LOGGER.info("Adding locations to projectId: {}", projectId);
        try {
            locationIds.forEach(locationId -> projectRepository.addLocationToProject(projectId, locationId));
        } catch (Exception ex) {
            LOGGER.error("Found error while adding locations to projectId {}: ", projectId, ex);
            throw new RuntimeException("Found error while adding locations to project. Reason: " + ex.getMessage());
        }
    }

    public void removeLocationsFromProject(Long  projectId, Set<Long> locationIds) {
        LOGGER.info("Revoking locations to projectId: {}", projectId);
        try {
            locationIds.forEach(userId -> projectRepository.removeLocationFromProject(projectId, userId));
        } catch (Exception ex) {
            LOGGER.error("Found error while revoking locations to projectId {}: ", projectId, ex);
            throw new RuntimeException("Found error while revoking locations to project. Reason: " + ex.getMessage());
        }
    }


    @Transactional
    public ProjectResponseDTO updateProjectForUser(Long projectId, ProjectRequestDTO dto) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching project for update: projectId={}, userId={}", projectId, userId);
            Project project = projectRepository.findByUserId(userId, projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found or not authorized for update"));
            project.setName(dto.getName());
            project.setDescription(dto.getDescription());

            Set<User> users = dto.getUsersId().stream()
                    .map(userRepository::getReferenceById)     // returns a proxy, no query
                    .collect(Collectors.toSet());

            LOGGER.info("list of users: {}", users);
            project.setUsers(users);


            Set<Location> locations = dto.getLocationIds().stream()
                            .map(locationRepository::getReferenceById)
                            .collect(Collectors.toSet());
            LOGGER.info("list of locations: {}", locations);
            project.setLocations(locations);

            project = projectRepository.save(project);
            return ProjectMapper.toDTO(project, project.getLocations(), project.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }

    public Page<ProjectResponseDTO> getAllProjectsByUserPaged(int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching paginated projects for userId: {}", userId);
            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Project> projectsPage = projectRepository.findAllByUserId(userId, pageable);

            return projectsPage.map(p->{
                return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
            });

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated projects: ", ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public Page<ProjectResponseDTO> searchProjectsByName(String name, int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Searching projects by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<Project> projectsPage = projectRepository.searchByNameAndUserId(name, userId, pageable);

            return projectsPage.map(p->{
                return ProjectMapper.toDTO(p, p.getLocations(), p.getUsers());
            });

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated projects for user with user id: {} ", userId, ex);
            throw new RuntimeException("Failed to retrieve projects. Reason: " + ex.getMessage());
        }
    }

    public long countProjectsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting projects for userId: {}", userId);
        return projectRepository.countByUserId(userId);
    }

    public boolean isProjectAccessibleByUser(Long projectId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for projectId: {} and userId: {}", projectId, userId);
        return projectRepository.existsByIdAndUserId(projectId, userId);
    }

    public List<Long> getProjectIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible project IDs for userId: {}", userId);
        return projectRepository.findAllProjectIdsByUserId(userId);
    }
}
