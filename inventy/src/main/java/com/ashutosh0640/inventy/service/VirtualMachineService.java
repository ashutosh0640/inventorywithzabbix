package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.*;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.VirtualMachines;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.entity.Virtualizations;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.OsType;
import com.ashutosh0640.inventy.enums.StorageUnit;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.InterfaceMapper;
import com.ashutosh0640.inventy.mapper.VirtualMachineMapper;
import com.ashutosh0640.inventy.repository.InterfaceRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import com.ashutosh0640.inventy.repository.VirtualMachineRepository;
import com.ashutosh0640.inventy.repository.VirtualizationRepository;
import com.ashutosh0640.inventy.zabbix.mapper.ZabbixHostMapper;
import com.ashutosh0640.inventy.zabbix.service.ZabbixHostService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VirtualMachineService {

    private final VirtualMachineRepository virtualMachineRepository;
    private final VirtualizationRepository virtualizationPlatformRepository;
    private final UserRepository userRepository;
    private final ZabbixHostService zabbixHostService;
    private final ActivityLogService activityLogService;
    private final InterfaceRepository interfaceRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(VirtualMachineService.class);

    public VirtualMachineService(VirtualMachineRepository virtualMachineRepository,
                                 VirtualizationRepository virtualizationPlatformRepository,
                                 UserRepository userRepository,
                                 ZabbixHostService zabbixHostService,
                                 InterfaceRepository interfaceRepository,
                                 ActivityLogService activityLogService) {
        this.virtualMachineRepository = virtualMachineRepository;
        this.virtualizationPlatformRepository = virtualizationPlatformRepository;
        this.userRepository = userRepository;
        this.zabbixHostService = zabbixHostService;
        this.interfaceRepository = interfaceRepository;
        this.activityLogService = activityLogService;
    }

    public VirtualMachineResponseDTO save(VirtualMachineRequestDTO dto, Boolean isZabbix, Long projectId) {
        try {
            LOGGER.info("Saving vm with name: {}", dto.getHostName());

            if (isZabbix) {
                try {
                    zabbixHostService.createHost(projectId, ZabbixHostMapper.toZabbixHostMap(dto));
                } catch (Exception ex) {
                    throw new RuntimeException("Found exception while creating zabbix host. "+ex.getMessage());
                }
            }

            Virtualizations virtualizationPlatform = virtualizationPlatformRepository.findById(dto.getVpId())
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualizationPlatform not found with ID: " + dto.getVpId()));

            Set<User> users = new HashSet<>(userRepository.findAllById(dto.getUsersId()));



            VirtualMachines vm = virtualMachineRepository.save(
                     VirtualMachineMapper.toEntity(dto, virtualizationPlatform, users)
             );

            Set<Interfaces> in = dto.getInterfaces().stream().map(i -> {

                Interfaces interf = InterfaceMapper.toEntity(i, vm);
                return interfaceRepository.save(interf);
            }).collect(Collectors.toSet());


            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "A Virtual Machine is created. Name: "+dto.getHostName()
            );

            LOGGER.info("Saving virtualMachine: {}", vm);
            return VirtualMachineMapper.toDTO(vm, in, vm.getVirtualizations(), vm.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error saving virtualMachine: ", ex);
            throw new RuntimeException("Failed to save virtualMachine. Reason: " + ex.getMessage());
        }
    }

    public VirtualMachineResponseDTO getById(Long id) {
        try {
            LOGGER.info("Fetching virtualMachine with ID: {}", id);
            VirtualMachines vm = virtualMachineRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found with ID: " + id));

            return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching virtualMachine with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve virtualMachine. Reason: " + ex.getMessage());
        }
    }

    public VirtualMachineResponseDTO getByIp(Long ip) {
        try {
            LOGGER.info("Fetching virtualMachine with IP: {}", ip);
            VirtualMachines vm = virtualMachineRepository.findById(ip)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found with ID: " + ip));

            return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching virtualMachine with ID {}: ", ip, ex);
            throw new RuntimeException("Failed to retrieve virtualMachine. Reason: " + ex.getMessage());
        }
    }


    public List<VirtualMachineResponseDTO> getAll() {
        try {
            LOGGER.info("Fetching all virtualMachines...");
            List<VirtualMachines> virtualMachines = virtualMachineRepository.findAll();

            return virtualMachines.stream()
                    .map(vm->{
                        return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching virtualMachines: ", ex);
            throw new RuntimeException("Failed to retrieve virtualMachines. Reason: " + ex.getMessage());
        }
    }

    public Long count() {
        return virtualMachineRepository.count();
    }


    public List<VirtualMachineResponseDTO> getAllSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all virtualMachines sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<VirtualMachines> virtualMachines = virtualMachineRepository.findAll(sort);

            return virtualMachines.stream()
                    .map(vm->{
                        return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted virtualMachines: ", ex);
            throw new RuntimeException("Failed to retrieve virtualMachines. Reason: " + ex.getMessage());
        }
    }


    public Page<VirtualMachineResponseDTO> getAllPaginated(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all virtualMachines with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<VirtualMachines> virtualMachinesPage = virtualMachineRepository.findAll(pageable);

            return virtualMachinesPage.map(VirtualMachineMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualMachines: ", ex);
            throw new RuntimeException("Failed to retrieve virtualMachines. Reason: " + ex.getMessage());
        }
    }


    public VirtualMachineResponseDTO update(Long id, VirtualMachineRequestDTO dto) {
        try {
            LOGGER.info("Updating virtualMachine with ID: {}", id);

            // Find existing virtualMachine
            VirtualMachines existingVirtualMachine = virtualMachineRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found with ID: " + id));

            // Update fields
            existingVirtualMachine.setHostName(dto.getHostName());

            // Save updated virtualMachine
            VirtualMachines vm = virtualMachineRepository.save(existingVirtualMachine);

            return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error updating virtualMachine with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update virtualMachine. Reason: " + ex.getMessage());
        }
    }


    public void delete(Long id) {
        try {
            LOGGER.info("Deleting virtualMachine with ID: {}", id);

            // Check if the virtualMachine exists
            VirtualMachines virtualMachine = virtualMachineRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found with ID: " + id));

            // Delete virtualMachine
            virtualMachineRepository.delete(virtualMachine);
            LOGGER.info("Successfully deleted virtualMachine with ID: {}", id);

        } catch (Exception ex) {
            LOGGER.error("Error deleting virtualMachine with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete virtualMachine. Reason: " + ex.getMessage());
        }
    }


    public List<VirtualMachineResponseDTO> searchByName(String name) {
        try {
            LOGGER.info("Searching virtualMachines by name: {}", name);

            List<VirtualMachines> virtualMachines = virtualMachineRepository.findByHostNameContainingIgnoreCase(name);

            if (virtualMachines.isEmpty()) {
                LOGGER.warn("No virtualMachines found with name: {}", name);
                throw new ResourceNotFoundException("No virtualMachines found matching: " + name);
            }

            return virtualMachines.stream()
                    .map(vm->{
                        return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching virtualMachines by name {}: ", name, ex);
            throw new RuntimeException("Failed to search virtualMachines. Reason: " + ex.getMessage());
        }
    }

    public boolean updateVirtualPlatform(Long vmId, Long vpId) {
        try {
            LOGGER.info("Updating virtual platform with ID: {}", vmId);

            // Find existing virtualMachine
            VirtualMachines existingVirtualMachine = virtualMachineRepository.findById(vmId)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found with ID: " + vmId));

            Virtualizations virtualizationPlatform = virtualizationPlatformRepository.findById(vpId)
                    .orElseThrow(() -> new ResourceNotFoundException("Virtual Platform not found by ID: " + vpId));

            existingVirtualMachine.setVirtualizations(virtualizationPlatform);
            VirtualMachines updatedVirtualMachine = virtualMachineRepository.save(existingVirtualMachine);
            return true;

        } catch (Exception ex) {
            LOGGER.error("Error while updating virtual platform  for virtual machine with id {}: ", vmId, ex);
            throw new RuntimeException("Error while updating virtual platform  for virtual machine. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void addUsersToVM(Long vmId, List<Long> userIds) {
        LOGGER.info("Adding user to virtual machine with ID: {}", vmId);
        try {
            userIds.forEach(userId ->{
                virtualMachineRepository.addUserToVm(vmId, userId);
            });
            LOGGER.info("Successfully added users to virtual machine with ID: {}", vmId);
        } catch (Exception ex) {
            LOGGER.error("Error while adding user to virtual platform id {}: ", vmId, ex);
            throw new RuntimeException("Error while adding user to virtual platform. Reason: " + ex.getMessage());
        }

    }

    @Transactional
    public void removeUsersFromVm(Long vmId, List<Long> userIds) {
        LOGGER.info("Finding virtual machine with ID: {}", vmId);
        try {
                userIds.forEach(userId ->{
                    virtualMachineRepository.removeUserFromVm(vmId, userId);
                });
            LOGGER.info("Successfully removed from virtual machine with ID: {}", vmId);

        } catch (Exception ex) {
            LOGGER.error("Error while removing user from virtual platform id {}: ", vmId, ex);
            throw new RuntimeException("Error while removing user from virtual platform. Reason: " + ex.getMessage());
        }
    }





    // ============== User respective methods ===================================== //
    public List<VirtualMachineResponseDTO> getAllByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {

            LOGGER.info("Fetching all virtualMachines for userId: {}", userId);

            List<VirtualMachines> virtualMachines = virtualMachineRepository.findAllByUser(userId);

            return virtualMachines.stream()
                    .map(vm->{
                        return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
                    })
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching virtualMachines for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching virtualMachines. Reason: " + ex.getMessage());
        }
    }

    public VirtualMachineResponseDTO getByUser(Long virtualMachineId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching virtualMachine for userId: {}", userId);
            VirtualMachines vm = virtualMachineRepository.findByUser(userId, virtualMachineId)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found for userId " + userId));

            return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching virtualMachine for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching virtualMachine. Reason: " + ex.getMessage());
        }
    }


    public void deleteVmByUser(Long vmId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Deleting Virtual Machine Id: {} by user Id: {}", vmId, userId);
            boolean flag = virtualMachineRepository.existsByIdAndUser(vmId, userId);
            if (flag) {
                virtualMachineRepository.deleteById(vmId);
            }
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting virtualMachine for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting virtualMachine. Reason: " + ex.getMessage());
        }
    }

    public void deleteVmsByUser(List<Long> vmIds) {
        vmIds.forEach(this::deleteVmByUser);
    }

    public VirtualMachineResponseDTO updateForUser(Long virtualMachineId, VirtualMachineRequestDTO dto) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching virtualMachine for update: virtualMachineId={}, userId={}", virtualMachineId, userId);
            VirtualMachines vm = virtualMachineRepository.findByUser(userId, virtualMachineId)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualMachine not found or not authorized for update"));
            vm.setHostName(dto.getHostName());
            vm.setHostType(HostType.valueOf(dto.getHostType()));
            vm.setOs(OsType.valueOf(dto.getOs()));
            vm.setOsVersion(dto.getOsVersion());
            vm.setCpuModel(dto.getCpuModel());
            vm.setCpuCores(dto.getCpuCores());
            vm.setRamSize(dto.getRamSize());
            vm.setRamSizeUnit(StorageUnit.valueOf(dto.getRamSizeUnit()));
            vm.setStorageSize(dto.getStorageSize());
            vm.setStorageSizeUnit(StorageUnit.valueOf(dto.getStorageSizeUnit()));

            if (dto.getVpId() != vm.getVirtualizations().getId()) {
                Virtualizations v = virtualizationPlatformRepository.findById(dto.getVpId())
                        .orElseThrow(() -> new ResourceNotFoundException("Virtual Platform not found by id: "+ dto.getVpId()));
                vm.setVirtualizations(v);
            }

            vm = virtualMachineRepository.save(vm);

            return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while deleting virtualMachine for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting virtualMachine. Reason: " + ex.getMessage());
        }
    }

    public Page<VirtualMachineResponseDTO> findAllByUserPaginated(int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching paginated virtualMachines for userId: {}", userId);
            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<VirtualMachines> virtualMachinesPage = virtualMachineRepository.findAllByUserPaginated(userId, pageable);

            return virtualMachinesPage.map(vm->{
                return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
            });

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualMachines: ", ex);
            throw new RuntimeException("Failed to retrieve virtualMachines. Reason: " + ex.getMessage());
        }
    }

    public Page<VirtualMachineResponseDTO> searchByNameAndUserPaginated(String name, int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Searching virtualMachines by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<VirtualMachines> virtualMachinesPage = virtualMachineRepository.searchByNameAndUser(name, userId, pageable);

            return virtualMachinesPage.map(vm->{
                return VirtualMachineMapper.toDTO(vm, vm.getInterfaces(), vm.getVirtualizations(), vm.getUsers());
            });

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualMachines for user with user id: {} ", userId, ex);
            throw new RuntimeException("Failed to retrieve virtualMachines. Reason: " + ex.getMessage());
        }
    }

    public long countByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting virtualMachines for userId: {}", userId);
        return virtualMachineRepository.countByUser(userId);
    }

    public boolean isAccessibleByUser(Long virtualMachineId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for virtualMachineId: {} and userId: {}", virtualMachineId, userId);
        return virtualMachineRepository.existsByIdAndUser(virtualMachineId, userId);
    }

    public List<Long> getIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible virtualMachine IDs for userId: {}", userId);
        return virtualMachineRepository.findAllIdsByUser(userId);
    }

}
