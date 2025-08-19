package com.ashutosh0640.inventy.controller;


import com.ashutosh0640.inventy.dto.ProjectRequestDTO;
import com.ashutosh0640.inventy.dto.ProjectResponseDTO;
import com.ashutosh0640.inventy.service.ProjectService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/project")
public class ProjectController {
    
    private final ProjectService projectService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PreAuthorize("hasPermission(null, 'PROJECT', 'WRITE')")
    @PostMapping
    public ResponseEntity<ProjectResponseDTO> saveProject(@RequestBody ProjectRequestDTO dto) {
        LOGGER.info("Received request to save project: {}", dto.getName());
        ProjectResponseDTO savedProject = projectService.saveProject(dto);
        return new ResponseEntity<>(savedProject, HttpStatus.CREATED);
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'WRITE')")
    @PostMapping("/batch")
    public ResponseEntity<String> saveProjectsInBatches(@RequestBody List<ProjectRequestDTO> projects,
                                                         @RequestParam(defaultValue = "100") int batchSize) {
        LOGGER.info("Received request to save {} projects in batches of {}", projects.size(), batchSize);
        projectService.saveProjectsInBatches(projects, batchSize);
        return ResponseEntity.status(HttpStatus.CREATED).body("Projects saved successfully in batches.");
    }


    @PreAuthorize("hasPermission(#id, 'PROJECT', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) {
        LOGGER.info("Received request to fetch project with ID: {}", id);
        ProjectResponseDTO project = projectService.getProjectByUser(id);
        return new ResponseEntity<>(project, HttpStatus.OK);
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/user")
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjectsByUser() {
        LOGGER.info("Received request to fetch all projects");
        List<ProjectResponseDTO> projects = projectService.getAllProjectsByUser();
        return ResponseEntity.ok(projects);
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<ProjectResponseDTO>> getAllProjectSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        LOGGER.info("Received request to fetch projects sorted by {} in {} order", field, sortOrder);
        List<ProjectResponseDTO> sortedProjects = projectService.getAllProjectSorted(sortOrder, field);
        return ResponseEntity.ok(sortedProjects);
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<ProjectResponseDTO>> getAllProjectPageable(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LOGGER.info("Received request to fetch projects - Page: {}, Size: {}", page, size);
        Page<ProjectResponseDTO> pagedProjects = projectService.getAllProjectsByUserPaged(page, size);
        return ResponseEntity.ok(pagedProjects);
    }


    @PreAuthorize("hasPermission(#id, 'PROJECT', 'EDIT')")
    @PutMapping("/{id}/update/users")
    public ResponseEntity<ProjectResponseDTO> updateProject(@PathVariable Long id, @RequestBody ProjectRequestDTO dto) {
        LOGGER.info("Received request to update project with ID: {}", id);
        ProjectResponseDTO updatedProject = projectService.updateProjectForUser(id, dto);
        return ResponseEntity.ok(updatedProject);
    }

    @PreAuthorize("hasPermission(#id, 'PROJECT', 'DELETE')")
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        LOGGER.info("Deleting project with ID: {}", id);
        projectService.deleteProject(id);
    }

    @PreAuthorize("hasPermission(null, 'PROJECT', 'DELETE')")
    @DeleteMapping
    public ResponseEntity<Void> deleteProjectList(@RequestBody List<Long> ids) {
        LOGGER.info("Received request to delete projects with IDs: {}", ids);
        projectService.deleteProjects(ids);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/search")
    public ResponseEntity<Page<ProjectResponseDTO>> searchProjectByName(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size) {
        LOGGER.info("Received request to search projects with name: {}", name);
        Page<ProjectResponseDTO> projects = projectService.searchProjectsByName(name, page, size);
        return ResponseEntity.ok(projects);
    }


    @Transactional
    @PreAuthorize("hasPermission(#id, 'PROJECT', 'EDIT')")
    @PostMapping("/{id}/add-locations")
    public void addLocationsToProject(@PathVariable Long id, @RequestBody Set<Long> locationIds) {
        System.out.println("locationIds: "+locationIds.toString());
        projectService.addLocationsToProject(id, locationIds);
    }

    @Transactional
    @PreAuthorize("hasPermission(#id, 'PROJECT', 'EDIT')")
    @PostMapping("/{id}/add-users")
    public void addUsersToProject(@PathVariable Long id, @RequestBody Set<Long> userIds) {
        projectService.addUsersToProject(id, userIds);
    }


    @PreAuthorize("hasPermission(#id, 'PROJECT', 'EDIT')")
    @DeleteMapping("/{id}/remove-locations")
    public void removeLocationsFromProject(@PathVariable Long id, @RequestBody Set<Long> locationIds) {
        projectService.removeLocationsFromProject(id, locationIds);
    }


    @PreAuthorize("hasPermission(#id, 'PROJECT', 'EDIT')")
    @DeleteMapping("/{id}/remove-users")
    public void removeUsersFromProject(@PathVariable Long id, @RequestBody Set<Long> userIds) {
        projectService.removeUserFromProject(id, userIds);
    }

    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/count")
    public ResponseEntity<Long> countProjectsByUser() {
        LOGGER.info("Received request to count projects by user");
        Long l = projectService.countProjectsByUser();
        return ResponseEntity.ok(l);
    }

    @PreAuthorize("hasPermission(#id, 'PROJECT', 'READ')")
    @GetMapping("/{id}/access")
    public ResponseEntity<Boolean> isProjectAccessibleByUser(@PathVariable Long id) {
        LOGGER.info("Received request to check if project accessible by user: {}", id);
        Boolean b = projectService.isProjectAccessibleByUser(id);
        return ResponseEntity.ok(b);
    }


    @PreAuthorize("hasPermission(null, 'PROJECT', 'READ')")
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getProjectIdsByUser() {
        LOGGER.info("Received request to get projects by user");
        List<Long> l = projectService.getProjectIdsByUser();
        return ResponseEntity.ok(l);
    }
}
