package com.ashutosh0640.inventy.controller;


import com.ashutosh0640.inventy.dto.VirtualMachineRequestDTO;
import com.ashutosh0640.inventy.dto.VirtualMachineResponseDTO;
import com.ashutosh0640.inventy.service.VirtualMachineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vm")
public class VirtualMachineController {

    private final VirtualMachineService virtualMachineService;
    private static final Logger LOGGER = LoggerFactory.getLogger(VirtualMachineController.class);

    public VirtualMachineController(VirtualMachineService virtualMachineService) {
        this.virtualMachineService = virtualMachineService;
    }

    @PreAuthorize("hasPermission(null, 'VM', 'WRITE')")
    @PostMapping
    public ResponseEntity<VirtualMachineResponseDTO> save(@RequestBody VirtualMachineRequestDTO dto, @RequestParam Boolean isZabbix, @RequestParam Long projectId) {
        LOGGER.info("Received request to save virtual machine: {}", dto.getHostName());
        VirtualMachineResponseDTO savedVirtualMachine = virtualMachineService.save(dto, isZabbix, projectId);
        return new ResponseEntity<>(savedVirtualMachine, HttpStatus.CREATED);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<VirtualMachineResponseDTO> getById(@PathVariable Long id) {
        LOGGER.info("Received request to fetch virtualMachine with ID: {}", id);
        VirtualMachineResponseDTO virtualMachine = virtualMachineService.getById(id);
        return new ResponseEntity<>(virtualMachine, HttpStatus.OK);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping
    public ResponseEntity<List<VirtualMachineResponseDTO>> getAll() {
        LOGGER.info("Received request to fetch all virtualMachines");
        List<VirtualMachineResponseDTO> virtualMachines = virtualMachineService.getAll();
        return ResponseEntity.ok(virtualMachines);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<VirtualMachineResponseDTO>> getAllSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        LOGGER.info("Received request to fetch virtualMachines sorted by {} in {} order", field, sortOrder);
        List<VirtualMachineResponseDTO> sortedVirtualMachines = virtualMachineService.getAllSorted(sortOrder, field);
        return ResponseEntity.ok(sortedVirtualMachines);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<VirtualMachineResponseDTO>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        LOGGER.info("Received request to fetch virtualMachines - Page: {}, Size: {}", page, size);
        Page<VirtualMachineResponseDTO> pagedVirtualMachines = virtualMachineService.getAllPaginated(page, size);
        return ResponseEntity.ok(pagedVirtualMachines);
    }


    @PreAuthorize("hasPermission(#id, 'VM', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<VirtualMachineResponseDTO> updateVirtualMachine(@PathVariable Long id, @RequestBody VirtualMachineRequestDTO dto) {
        LOGGER.info("Received request to update virtualMachine with ID: {}", id);
        VirtualMachineResponseDTO updatedVirtualMachine = virtualMachineService.update(id, dto);
        return ResponseEntity.ok(updatedVirtualMachine);
    }


    @PreAuthorize("hasPermission(#id, 'VM', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVirtualMachine(@PathVariable Long id) {
        LOGGER.info("Received request to delete virtualMachine with ID: {}", id);
        virtualMachineService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/search")
    public ResponseEntity<List<VirtualMachineResponseDTO>> searchVirtualMachineByName(@RequestParam String name) {
        LOGGER.info("Received request to search virtualMachines with name: {}", name);
        List<VirtualMachineResponseDTO> virtualMachines = virtualMachineService.searchByName(name);
        return ResponseEntity.ok(virtualMachines);
    }


    @PreAuthorize("hasPermission(#vm_id, 'VM', 'EDIT')")
    @PatchMapping
    public ResponseEntity<Boolean> updateVirtualPlatform(@RequestParam Long vm_id, @RequestParam Long vp_id) {
        LOGGER.info("Received request to update virtual platform with ID: {}", vm_id);
        Boolean b = virtualMachineService.updateVirtualPlatform(vm_id, vp_id);
        return ResponseEntity.ok(b);
    }


    @PreAuthorize("hasPermission(#vm_id, 'VM', 'EDIT')")
    @PostMapping("/{vm_id}/add-user")
    public void addUsersToVM(@PathVariable Long vm_id, @RequestBody List<Long> user_ids) {
        LOGGER.info("Received request to add users to virtual machine with ID: {}", vm_id);
        virtualMachineService.addUsersToVM(vm_id, user_ids);
    }


    @PreAuthorize("hasPermission(#vm_id, 'VM', 'EDIT')")
    @DeleteMapping("/{vm_id}/remove-user")
    public void removeUserSFromVm(@PathVariable Long vm_id, @RequestBody List<Long> user_ids) {
        LOGGER.info("Receive request to  remove users from virtual machine with ID: {}", vm_id);
        virtualMachineService.removeUsersFromVm(vm_id, user_ids);
    }



    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/users")
    public ResponseEntity<List<VirtualMachineResponseDTO>> getAllVirtualMachinesByUser() {
        LOGGER.info("Received request to get all virtual machines.");
        List<VirtualMachineResponseDTO> dtos = virtualMachineService.getAllByUser();
        return ResponseEntity.ok(dtos);
    }


    @PreAuthorize("hasPermission(#vm_id, 'VM', 'READ')")
    @GetMapping("/{vm_id}/users")
    public ResponseEntity<VirtualMachineResponseDTO> getVirtualMachineByUser(@PathVariable Long vm_id) {
        LOGGER.info("Received request to get virtual machine with ID: {}", vm_id);
        VirtualMachineResponseDTO dto = virtualMachineService.getByUser(vm_id);
        return ResponseEntity.ok(dto);
    }


    @PreAuthorize("hasPermission(#/{vm_id}, 'VM', 'DELETE')")
    @DeleteMapping("/{vm_id}/users")
    public void deleteVirtualMachineByUser(@PathVariable Long vm_id) {
        LOGGER.info("Received request to delete virtual machine with ID: {}", vm_id);
        virtualMachineService.deleteVmByUser(vm_id);
    }


    @PreAuthorize("hasPermission(#vmId, 'VM', 'EDIT')")
    @PutMapping("/{vm_id}/users")
    public ResponseEntity<VirtualMachineResponseDTO> updateForUser(@PathVariable Long vmId, @RequestBody VirtualMachineRequestDTO dto) {
        LOGGER.info("Received request to update virtual machine with ID: {}", vmId);
        VirtualMachineResponseDTO vm = virtualMachineService.updateForUser(vmId, dto);
        return ResponseEntity.ok(vm);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/users/paged")
    public ResponseEntity<Page<VirtualMachineResponseDTO>> getAllVirtualMachinesByUserPaged(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        LOGGER.info("Received request to get all virtual machines in page.");
        Page<VirtualMachineResponseDTO> vm = virtualMachineService.findAllByUserPaginated(page, size);
        return ResponseEntity.ok(vm);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/search/{name}")
    public ResponseEntity<Page<VirtualMachineResponseDTO>> searchByNameAndUserPaginated(@PathVariable String name, @RequestParam int page, @RequestParam int size) {
        LOGGER.info("Received request to search virtual machines with name: {}", name);
        Page<VirtualMachineResponseDTO> vm = virtualMachineService.searchByNameAndUserPaginated(name, page, size);
        return ResponseEntity.ok(vm);
    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/count")
    public ResponseEntity<Long> countVirtualMachinesByUser() {
        LOGGER.info("Received request to count virtual machines.");
        Long l = virtualMachineService.countByUser();
        return ResponseEntity.ok(l);
    }

    @PreAuthorize("hasPermission(#vm_id, 'VM', 'READ')")
    @GetMapping("/{vm_id}/access")
    public ResponseEntity<Boolean> isVirtualMachineAccessibleByUser(Long vm_id) {
        LOGGER.info("Receive request to check access of vm.");
        Boolean isAccessible = virtualMachineService.isAccessibleByUser(vm_id);
        return ResponseEntity.ok(isAccessible);

    }


    @PreAuthorize("hasPermission(null, 'VM', 'READ')")
    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getVirtualMachineIdsByUser() {
        LOGGER.info("Receive request to get virtual machines.");
        List<Long> ids = virtualMachineService.getIdsByUser();
        return ResponseEntity.ok(ids);
    }

}
