package com.ashutosh0640.inventy.controller;


import com.ashutosh0640.inventy.dto.BareMetalServerRequestDTO;
import com.ashutosh0640.inventy.dto.BareMetalServerResponseDTO;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.service.BareMetalService;
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
@RequestMapping("/api/v1/baremetal")
public class BareMetalController {

    private final BareMetalService bareMetalService;
    private static final Logger LOGGER = LoggerFactory.getLogger(BareMetalController.class);

    public BareMetalController(BareMetalService bareMetalService) {
        this.bareMetalService = bareMetalService;
    }

    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'WRITE')")
    @PostMapping
    public ResponseEntity<BareMetalServerResponseDTO> save(@RequestBody BareMetalServerRequestDTO dto) {
        try {
            LOGGER.info("Received request to save bareMetal: {}", dto.getSerialNumber());
            BareMetalServerResponseDTO savedBareMetal = bareMetalService.save(dto);
            return new ResponseEntity<>(savedBareMetal, HttpStatus.CREATED);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving bareMetal: ", ex);
            throw new RuntimeException("Error occurred while saving bareMetal: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'WRITE')")
    @PostMapping("/batch")
    public void saveAll(@RequestBody Set<BareMetalServerRequestDTO> dto) {
        try {
            LOGGER.info("Received request to save bareMetal list.");
            bareMetalService.saveAll(dto);
        } catch (Exception ex) {
            LOGGER.error("Error occurred while saving bareMetals: ", ex);
            throw new RuntimeException("Error occurred while saving bareMetals: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'READ')")
    @GetMapping("/{id}")
    public ResponseEntity<BareMetalServerResponseDTO> getById(@PathVariable Long id) {
        try {
            LOGGER.info("Received request to fetch bareMetal with ID: {}", id);
            BareMetalServerResponseDTO bareMetal = bareMetalService.getById(id);
            return new ResponseEntity<>(bareMetal, HttpStatus.OK);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching bareMetal with ID {}: ", id, ex);
            throw new ResourceNotFoundException("Error occur while fetching bareMetal with id: "+id+".\n "+ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'READ')")
    @GetMapping("/ip")
    public ResponseEntity<List<BareMetalServerResponseDTO>> getByIp(@RequestParam String ip) {
        try {
            LOGGER.info("Received request to fetch bare metal with IP: {}", ip);
            List<BareMetalServerResponseDTO> bareMetals = bareMetalService.getByIp(ip);
            return ResponseEntity.ok(bareMetals);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching bare metal with ID {}: ", ip, ex);
            throw new ResourceNotFoundException("Error occur while fetching bare metal with IP: "+ip+".\n "+ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping
    public ResponseEntity<List<BareMetalServerResponseDTO>> getAll() {
        try {
            LOGGER.info("Received request to fetch all bareMetals");
            List<BareMetalServerResponseDTO> bareMetals = bareMetalService.getAll();
            return ResponseEntity.ok(bareMetals);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching bareMetals: ", ex);
            throw new RuntimeException("Error occur while fetching all bareMetals: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/sorted")
    public ResponseEntity<List<BareMetalServerResponseDTO>> getAllSorted(
            @RequestParam(defaultValue = "ASC") String sortOrder,
            @RequestParam String field) {
        try {
            LOGGER.info("Received request to fetch bareMetals sorted by {} in {} order", field, sortOrder);
            List<BareMetalServerResponseDTO> sortedBareMetals = bareMetalService.getAllSorted(sortOrder, field);
            return ResponseEntity.ok(sortedBareMetals);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching sorted bareMetals: ", ex);
            throw new RuntimeException("Error fetching sorted bareMetals: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/paged")
    public ResponseEntity<Page<BareMetalServerResponseDTO>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            LOGGER.info("Received request to fetch bareMetals - Page: {}, Size: {}", page, size);
            Page<BareMetalServerResponseDTO> pagedBareMetals = bareMetalService.getAllPaginated(page, size);
            return ResponseEntity.ok(pagedBareMetals);
        } catch (RuntimeException ex) {
            LOGGER.error("Error fetching paginated bareMetals: ", ex);
            throw new RuntimeException("Error fetching bareMetals: " + ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'EDIT')")
    @PutMapping("/{id}")
    public ResponseEntity<BareMetalServerResponseDTO> update(@PathVariable Long id, @RequestBody BareMetalServerRequestDTO dto) {
        LOGGER.info("Received request to update bareMetal with ID: {}", id);
        try {
            BareMetalServerResponseDTO updatedBareMetal = bareMetalService.update(id, dto);
            return ResponseEntity.ok(updatedBareMetal);
        } catch (RuntimeException ex) {
            LOGGER.error("Error updating bareMetal with ID: {}", id, ex);
            throw new RuntimeException("Error updating bareMetal: " + ex.getMessage());
        }
    }

    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'EDIT')")
    @PatchMapping("/{id}/update")
    public ResponseEntity<BareMetalServerResponseDTO> updateByRack(@PathVariable Long id, @RequestParam Long rackId, Short slot) {
        LOGGER.info("Received request to update rack with ID: {}", rackId);
        BareMetalServerResponseDTO dto = bareMetalService.updateRackToBaremetal(id, rackId, slot);
        return ResponseEntity.ok().body(dto);
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        LOGGER.info("Received request to delete bareMetal with ID: {}", id);
        try {
            bareMetalService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            LOGGER.error("Error deleting bareMetal with ID: {}", id, ex);
            throw new RuntimeException("Error deleting bareMetal: " + ex.getMessage());
        }
    }



    @Transactional
    @PreAuthorize("hasPermission(#baremetalId, 'BAREMETAL', 'EDIT')")
    @PostMapping("/{id}/add-users")
    public void addUsers(@PathVariable Long id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to add users to baremetal: {}", userIds);
        bareMetalService.addUserToBaremetal(id, userIds);
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'EDIT')")
    @DeleteMapping("/{id}/remove-users")
    public void removeUsers(@PathVariable Long id, @RequestBody List<Long> userIds) {
        LOGGER.info("Received request to remove users from bare metal: {}", userIds);
        bareMetalService.removeUserFromBaremetal(id, userIds);
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/users")
    public ResponseEntity<List<BareMetalServerResponseDTO>> getAllByUsers() {
        LOGGER.info("Received request to get all bareMetalServers by user");
        List<BareMetalServerResponseDTO> dtos =  bareMetalService.getAllByUser();
        return ResponseEntity.ok(dtos);
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'READ')")
    @GetMapping("/{id}/users")
    public BareMetalServerResponseDTO getByUsers(@PathVariable Long id) {
        LOGGER.info("Received request to get BareMetalServer by user");
        return bareMetalService.getByUser(id);
    }

    @GetMapping("/users/ids")
    public List<BareMetalServerResponseDTO> getBareMetalsForUserByIds(@RequestBody List<Long> ids) {
        LOGGER.info("Received request to get baremetal by ids");
        return bareMetalService.getBareMetalsForUserByIds(ids);
    }

    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'READ')")
    @GetMapping("/ip/user")
    public ResponseEntity<List<BareMetalServerResponseDTO>> getByIpAndUser(@RequestParam String ip) {
        try {
            LOGGER.info("Received request to fetch bareMetal with IP: {}", ip);
            List<BareMetalServerResponseDTO> bareMetals = bareMetalService.getByIpAndUser(ip);
            return ResponseEntity.ok(bareMetals);
        } catch (RuntimeException ex) {
            LOGGER.error("Error occur while fetching bareMetal with ID {}: ", ip, ex);
            throw new ResourceNotFoundException("Error occur while fetching bareMetal with IP: "+ip+".\n "+ex.getMessage());
        }
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/search/by-sno")
    public BareMetalServerResponseDTO searchBySno(String sNo) {
        LOGGER.info("Received request to get BareMetalServer by sNo: {}", sNo);
        return bareMetalService.getBySerialNumberAndUser(sNo);
    }



    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/search/by-model")
    public ResponseEntity<List<BareMetalServerResponseDTO>> searchByModel(String name) {
        LOGGER.info("Received request to get BareMetalServer by model: {}", name);
        List<BareMetalServerResponseDTO> bareMetals = bareMetalService.getByModelAndUser(name);
        return ResponseEntity.ok(bareMetals);
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/rack/{rack_id}")
    public ResponseEntity<List<BareMetalServerResponseDTO>> getByRacksAndUsers(@PathVariable Long rack_id) {
        LOGGER.info("Received request to get BareMetalServers by rack: {}", rack_id);
        List<BareMetalServerResponseDTO> bareMetals = bareMetalService.getByRackByUser(rack_id);
        return ResponseEntity.ok(bareMetals);
    }

    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'DELETE')")
    @DeleteMapping("/users")
    public void removeAllForUser() {
        LOGGER.info("Received request to delete all bareMetalServers by user");
        bareMetalService.removeAllForUser();
    }


    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'DELETE')")
    @DeleteMapping("/{id}/users")
    public void deleteByUsers(@PathVariable Long id) {
        LOGGER.info("Received request to delete bareMetalServers by user");
        bareMetalService.deleteByUser(id);
    }

    @PreAuthorize("hasPermission(#id, 'BAREMETAL', 'EDIT')")
    @PutMapping("/{id}/update")
    public ResponseEntity<BareMetalServerResponseDTO> updateByUsers(@PathVariable Long id, @RequestBody BareMetalServerRequestDTO dto) {
        LOGGER.info("Received request to update BareMetalServer for user: {}", dto);
        BareMetalServerResponseDTO server = bareMetalService.updateByUser(id, dto);
        return ResponseEntity.ok(server);
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/count")
    public long countByUsers() {
        LOGGER.info("Received request to count bare metal.");
        return bareMetalService.countByUser();
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/users/paged")
    public Page<BareMetalServerResponseDTO> getAllByUsersPaged(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size) {
        LOGGER.info("Received request to get all bareMetalServers by user in page");
        return bareMetalService.getAllByUserPaginated(page, size);
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/access/users")
    public boolean isAccessibleByUser(@RequestParam Long serverId) {
        LOGGER.info("Received request to check bare metal is accessible to user: {}", serverId);
        return bareMetalService.isAccessibleByUser(serverId);
    }


    @PreAuthorize("hasPermission(null, 'BAREMETAL', 'READ')")
    @GetMapping("/id")
    public List<Long> getIdsByUsers() {
        LOGGER.info("Received request to get BareMetalServer Ids by user");
        return bareMetalService.getIdsByUser();
    }
}
