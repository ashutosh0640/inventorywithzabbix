package com.ashutosh0640.inventy.controller;

import com.ashutosh0640.inventy.dto.NetworkDeviceRequestDTO;
import com.ashutosh0640.inventy.dto.NetworkDeviceResponseDTO;
import com.ashutosh0640.inventy.service.NetworkDeviceService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/network-devices")
public class NetworkDeviceController {

    private final NetworkDeviceService networkDeviceService;

    public NetworkDeviceController(NetworkDeviceService networkDeviceService) {
        this.networkDeviceService = networkDeviceService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<NetworkDeviceResponseDTO> getById(@PathVariable Long id) {
        NetworkDeviceResponseDTO response = networkDeviceService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<NetworkDeviceResponseDTO>> getByNameOrIpAndUser(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String ip) {
        List<NetworkDeviceResponseDTO> response = networkDeviceService.getByNameOrIpAndUser(name, ip);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rack/{rackId}")
    public ResponseEntity<List<NetworkDeviceResponseDTO>> getByRackAndUser(@PathVariable Long rackId) {
        List<NetworkDeviceResponseDTO> response = networkDeviceService.getByRackAndUser(rackId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<NetworkDeviceResponseDTO>> getAll() {
        List<NetworkDeviceResponseDTO> response = networkDeviceService.getAll();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<NetworkDeviceResponseDTO>> getByPage(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size) {
        Page<NetworkDeviceResponseDTO> response = networkDeviceService.getByPage(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<NetworkDeviceResponseDTO> getByIdAndUser(@PathVariable Long id) {
        NetworkDeviceResponseDTO response = networkDeviceService.getByIdAndUser(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<List<NetworkDeviceResponseDTO>> getAllAndUser() {
        List<NetworkDeviceResponseDTO> response = networkDeviceService.getAllAndUser();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/page")
    public ResponseEntity<Page<NetworkDeviceResponseDTO>> getAllByUserPageable(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size) {
        Page<NetworkDeviceResponseDTO> response = networkDeviceService.geAllByUserPageable(page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<NetworkDeviceResponseDTO> save(@RequestBody NetworkDeviceRequestDTO dto) {
        NetworkDeviceResponseDTO response = networkDeviceService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> saveAll(@RequestBody Set<NetworkDeviceRequestDTO> dtos) {
        networkDeviceService.saveAll(dtos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<NetworkDeviceResponseDTO> update(@PathVariable Long id, @RequestBody NetworkDeviceRequestDTO dto) {
        NetworkDeviceResponseDTO response = networkDeviceService.update(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        networkDeviceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        networkDeviceService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteByIdAndUser(@PathVariable Long id) {
        networkDeviceService.deleteByIdAndUser(id);
        return ResponseEntity.noContent().build();
    }
}

