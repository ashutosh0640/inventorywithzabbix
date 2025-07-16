package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.VirtualizationsRequestDTO;
import com.ashutosh0640.inventy.dto.VirtualizationsResponseDTO;
import com.ashutosh0640.inventy.entity.BareMetalServers;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.Virtualizations;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.*;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.InterfaceMapper;
import com.ashutosh0640.inventy.mapper.VirtualizationsMapper;
import com.ashutosh0640.inventy.repository.BareMetalRepository;
import com.ashutosh0640.inventy.repository.InterfaceRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import com.ashutosh0640.inventy.repository.VirtualizationRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VirtualizationsService {
    
    private final VirtualizationRepository virtualizationsRepository;
    private final BareMetalRepository bareMetalRepository;
    private final UserRepository userRepository;
    private final InterfaceRepository interfaceRepository;
    private final ActivityLogService activityLogService;
    private static final Logger LOGGER = LoggerFactory.getLogger(VirtualizationsService.class);

    public VirtualizationsService(VirtualizationRepository virtualizationsRepository,
                                  BareMetalRepository bareMetalRepository,
                                  UserRepository userRepository,
                                  InterfaceRepository interfaceRepository,
                                  ActivityLogService activityLogService ) {
        this.virtualizationsRepository = virtualizationsRepository;
        this.bareMetalRepository = bareMetalRepository;
        this.userRepository = userRepository;
        this.interfaceRepository = interfaceRepository;
        this.activityLogService = activityLogService;
    }

    public VirtualizationsResponseDTO save(VirtualizationsRequestDTO dto) {
        try {
            LOGGER.info("Fetching bareMetal with ID: {}", dto.getServerId());
            BareMetalServers bareMetal = bareMetalRepository.findById(dto.getServerId())
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetal not found with ID: " + dto.getServerId()));

            Set<User> userList = dto.getUsersId().stream()
                    .map(id -> userRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found by ID: " + id)))
                    .collect(Collectors.toSet());

            Virtualizations vp = virtualizationsRepository.save(VirtualizationsMapper.toEntity(dto, bareMetal, userList));

            Set<Interfaces> in = dto.getInterfaces().stream().map(i -> {

                Interfaces interf = InterfaceMapper.toEntity(i, vp);
                return interfaceRepository.save(interf);
            }).collect(Collectors.toSet());

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "A Virtualization platform is created. Name: "+dto.getName()
            );
            LOGGER.info("Saving virtualizationPlatform: {}", vp);
            return VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error saving virtualizationPlatform: ", ex);
            throw new RuntimeException("Failed to save virtualizationPlatform. Reason: " + ex.getMessage());
        }
    }

    public VirtualizationsResponseDTO getById(Long id) {
        try {
            LOGGER.info("Fetching Virtualization Platform with ID: {}", id);
            Virtualizations vp = virtualizationsRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Virtualization Platform not found with ID: " + id));

            return VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching Virtualization Platform with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve Virtualization Platform. Reason: " + ex.getMessage());
        }
    }


    public List<VirtualizationsResponseDTO> getByIp(String ip) {
        try {
            LOGGER.info("Fetching Virtualization Platform with IP: {}", ip);
            List<Virtualizations> vps = virtualizationsRepository.findByIp(ip);

            return vps.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers())
                    )
                    .toList();
        } catch (Exception ex) {
            LOGGER.error("Error fetching Virtualization Platform with IP {}: ", ip, ex);
            throw new RuntimeException("Failed to fetch Virtualization Platform. Reason: " + ex.getMessage());
        }
    }


    public List<VirtualizationsResponseDTO> getAll() {
        try {
            LOGGER.info("Fetching all virtualizationPlatforms...");
            List<Virtualizations> virtualizationPlatforms = virtualizationsRepository.findAll();

            return virtualizationPlatforms.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers())
                    )
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error fetching virtualizationPlatforms: ", ex);
            throw new RuntimeException("Failed to retrieve virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public Long countVP() {
        return virtualizationsRepository.count();
    }

    public List<VirtualizationsResponseDTO> getAllSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all virtualizationPlatforms sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<Virtualizations> virtualizationPlatforms = virtualizationsRepository.findAll(sort);

            return virtualizationPlatforms.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers())
                    ).toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted virtualizationPlatforms: ", ex);
            throw new RuntimeException("Failed to retrieve virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public Page<VirtualizationsResponseDTO> getAllPaginated(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all virtualizationPlatforms with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Virtualizations> virtualizationsPage = virtualizationsRepository.findAll(pageable);

            return virtualizationsPage.map(VirtualizationsMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualizationPlatforms: ", ex);
            throw new RuntimeException("Failed to retrieve virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public VirtualizationsResponseDTO update(Long id, VirtualizationsRequestDTO dto) {
        try {
            LOGGER.info("Updating virtualizationPlatform with ID: {}", id);

            // Find existing Virtualization Platform
            Virtualizations vp = virtualizationsRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualizationPlatform not found with ID: " + id));

            // Update fields
            vp.setHostName(dto.getName());
            vp.setHostType(HostType.valueOf(dto.getHostType().toUpperCase()));
            vp.setType(VirtualizationType.valueOf(dto.getType()));
            vp.setRamSize(dto.getRamSize());
            vp.setRamSizeUnit(StorageUnit.valueOf(dto.getRamSizeUnit().toUpperCase()));
            vp.setStorageSize(dto.getStorageSize());
            vp.setStorageSizeUnit(StorageUnit.valueOf(dto.getStorageSizeUnit().toUpperCase()));
            vp.setStorageType(StorageType.valueOf(dto.getStoreageType().toUpperCase()));

            if (dto.getServerId() != null) {
                BareMetalServers b = bareMetalRepository.findById(dto.getServerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Baremetal not found by id: "+ dto.getServerId()));
                vp.setBareMetalServer(b);
            }

            // Save updated virtualizationPlatform
            vp = virtualizationsRepository.save(vp);

            return VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error updating virtualizationPlatform with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update virtualizationPlatform. Reason: " + ex.getMessage());
        }
    }

    public void delete(Long id) {
        try {
            LOGGER.info("Deleting virtualization Platform with ID: {}", id);

            // Check if the virtualizationPlatform exists
            Virtualizations virtualizationPlatform = virtualizationsRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualizationPlatform not found with ID: " + id));

            // Delete virtualizationPlatform
            virtualizationsRepository.delete(virtualizationPlatform);
            LOGGER.info("Successfully deleted virtualizationPlatform with ID: {}", id);

        } catch (Exception ex) {
            LOGGER.error("Error deleting virtualizationPlatform with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete virtualizationPlatform. Reason: " + ex.getMessage());
        }
    }

    public List<VirtualizationsResponseDTO> searchByName(String name) {
        try {
            LOGGER.info("Searching virtualizationPlatforms by name: {}", name);

            List<Virtualizations> virtualizationPlatforms = virtualizationsRepository.findByHostNameContainingIgnoreCase(name);

            if (virtualizationPlatforms.isEmpty()) {
                LOGGER.warn("No virtualizationPlatforms found with name: {}", name);
                throw new ResourceNotFoundException("No virtualizationPlatforms found matching: " + name);
            }

            return virtualizationPlatforms.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers()))
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching virtualizationPlatforms by name {}: ", name, ex);
            throw new RuntimeException("Failed to search virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void addUsersToVP(Long vpId, List<Long> userIds) {
        LOGGER.info("Adding user to virtual platform with ID: {}", vpId);
        try {
            userIds.forEach(userId -> virtualizationsRepository.addUserToVP(vpId, userId));
            LOGGER.info("Successfully added users to virtual platform with ID: {}", vpId);
        } catch (Exception ex) {
            LOGGER.error("Error while adding user to virtual platform id {}: ", vpId, ex);
            throw new RuntimeException("Error while adding user to virtual platform. Reason: " + ex.getMessage());
        }
    }

    @Transactional
    public void removeUsersToVP(Long vpId, List<Long> userIds) {
        LOGGER.info("Finding virtual platform with ID: {}", vpId);
        try {
            userIds.forEach(userId -> virtualizationsRepository.removeUserFromVP(vpId, userId));
            LOGGER.info("Successfully removed from bare metal with ID: {}", vpId);
        } catch (Exception ex) {
            LOGGER.error("Error while removing user from virtual platform id {}: ", vpId, ex);
            throw new RuntimeException("Error while removing user from virtual platform. Reason: " + ex.getMessage());
        }
    }


    // ============== User respective methods ===================================== //
    public List<VirtualizationsResponseDTO> getAllByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {

            LOGGER.info("Fetching all virtualizationPlatforms for userId: {}", userId);

            List<Virtualizations> virtualizationPlatforms = virtualizationsRepository.findAllByUser(userId);

            return virtualizationPlatforms.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers()))
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching virtualizationPlatforms for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public VirtualizationsResponseDTO getByUser(Long virtualizationPlatformId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching virtualizationPlatform for userId: {}", userId);
            Virtualizations vp = virtualizationsRepository.findByUser(userId, virtualizationPlatformId)
                    .orElseThrow(() -> new ResourceNotFoundException("VirtualizationPlatform not found for userId " + userId));

            return VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching virtualizationPlatform for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while fetching virtualizationPlatform. Reason: " + ex.getMessage());
        }
    }

    public List<VirtualizationsResponseDTO> getByIpAndUser(String ip, Long userId) {
        try {
            LOGGER.info("Fetching Virtualization Platform with IP: {}", ip);
            List<Virtualizations> vps = virtualizationsRepository.findByIpAndUser(ip, userId);

            return vps.stream()
                    .map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers())
                    )
                    .toList();
        } catch (Exception ex) {
            LOGGER.error("Error fetching Virtualization Platform with IP {}: ", ip, ex);
            throw new RuntimeException("Failed to fetch Virtualization Platform. Reason: " + ex.getMessage());
        }
    }


    public void removeUserFromVP(Long vpId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.warn("Deleting virtualizationPlatformId: {} for userId: {}", vpId, userId);
            virtualizationsRepository.removeUserFromVP(vpId, userId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting virtualizationPlatform for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting virtualizationPlatform. Reason: " + ex.getMessage());
        }

    }


    public VirtualizationsResponseDTO updateByUser(Long vpId, VirtualizationsRequestDTO dto) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching virtualizationPlatform for update: virtualizationPlatformId={}, userId={}", vpId, userId);
            Virtualizations vp = virtualizationsRepository.findByUser(userId, vpId)
                    .orElseThrow(() -> new ResourceNotFoundException("Virtualization Platform not found or not authorized for update"));

            vp.setHostName(dto.getName());
            vp.setHostType(HostType.valueOf(dto.getHostType().toUpperCase()));
            vp.setType(VirtualizationType.valueOf(dto.getType()));
            vp.setRamSize(dto.getRamSize());
            vp.setRamSizeUnit(StorageUnit.valueOf(dto.getRamSizeUnit().toUpperCase()));
            vp.setStorageSize(dto.getStorageSize());
            vp.setStorageSizeUnit(StorageUnit.valueOf(dto.getStorageSizeUnit().toUpperCase()));
            vp.setStorageType(StorageType.valueOf(dto.getStoreageType().toUpperCase()));

            if (dto.getServerId() != null) {
                BareMetalServers b = bareMetalRepository.findById(dto.getServerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Bare metal not found by id: "+ dto.getServerId()));
                vp.setBareMetalServer(b);
            }

            // Save updated virtualizationPlatform
            vp = virtualizationsRepository.save(vp);

            return VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting Virtualization Platform for userId {}: ", userId, ex);
            throw new RuntimeException("Found error while deleting Virtualization Platform. Reason: " + ex.getMessage());
        }
    }

    public Page<VirtualizationsResponseDTO> getAllByUserPaginated(int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Fetching paginated virtualizationPlatforms for userId: {}", userId);
            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<Virtualizations> virtualizationPlatformsPage = virtualizationsRepository.findAllByUser(userId, pageable);

            return virtualizationPlatformsPage.map(VirtualizationsMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualizationPlatforms: ", ex);
            throw new RuntimeException("Failed to retrieve virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public Page<VirtualizationsResponseDTO> searchByNameAndUserPaginated(String name, int pageSize, int pageNumber) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        try {
            LOGGER.info("Searching virtualizationPlatforms by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<Virtualizations> virtualizationPlatformsPage = virtualizationsRepository.searchByNameAndUser(name, userId, pageable);

            return virtualizationPlatformsPage.map(vp-> VirtualizationsMapper.toDTO(vp, vp.getInterfaces(), vp.getBareMetalServer(), vp.getVirtualMachines(), vp.getUsers()));

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated virtualizationPlatforms for user with user id: {} ", userId, ex);
            throw new RuntimeException("Failed to retrieve virtualizationPlatforms. Reason: " + ex.getMessage());
        }
    }

    public long countByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting virtualizationPlatforms for userId: {}", userId);
        return virtualizationsRepository.countByUser(userId);
    }

    public boolean isAccessibleByUser(Long virtualizationPlatformId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for virtualizationPlatformId: {} and userId: {}", virtualizationPlatformId, userId);
        return virtualizationsRepository.existsByIdAndUser(virtualizationPlatformId, userId);
    }

    public List<Long> getIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible virtualizationPlatform IDs for userId: {}", userId);
        return virtualizationsRepository.findAllIdsByUser(userId);
    }
}
