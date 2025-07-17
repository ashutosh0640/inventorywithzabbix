package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.NetworkDeviceRequestDTO;
import com.ashutosh0640.inventy.dto.NetworkDeviceResponseDTO;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.NetworkDevices;
import com.ashutosh0640.inventy.entity.Racks;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.InterfaceMapper;
import com.ashutosh0640.inventy.mapper.NetworkDeviceMapper;
import com.ashutosh0640.inventy.repository.InterfaceRepository;
import com.ashutosh0640.inventy.repository.NetworkDeviceRepository;
import com.ashutosh0640.inventy.repository.RackRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NetworkDeviceService {

    private final NetworkDeviceRepository networkDeviceRepository;
    private final RackRepository rackRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final RackSlotsService rackSlotService;
    private static final Logger LOGGER = LoggerFactory.getLogger(NetworkDeviceService.class);


    public NetworkDeviceService(NetworkDeviceRepository networkDeviceRepository,
                                RackRepository rackRepository,
                                UserRepository userRepository,
                                ActivityLogService activityLogService,
                                RackSlotsService rackSlotService) {
        this.networkDeviceRepository = networkDeviceRepository;
        this.rackRepository = rackRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
        this.rackSlotService = rackSlotService;
    }

    public NetworkDeviceResponseDTO getById(Long id) {
        if (id < 0 ) {
            LOGGER.warn("Network device id must be greater than 0. Id: {}", id);
            throw new InvalidParameterException("Network device id must be greater than 0. Id: "+id);
        }

        try {
            NetworkDevices entity = networkDeviceRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found by device id: "+id));
            return NetworkDeviceMapper.toDTO(entity, entity.getInterfaces(), entity.getUsers());
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Network device not found by id: "+ id+" Message: "+e.getMessage());
        }
    }


    public List<NetworkDeviceResponseDTO> getByNameOrIpAndUser(String name, String ip) {
        if(!isValidIPv4(ip)) {
            LOGGER.warn("IP is null or invalid. IP: {}",ip);
            throw new InvalidParameterException("IP is null or invalid. IP: "+ip);
        }
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            List<NetworkDevices> entity = networkDeviceRepository.getByNameOrIpAndUser(name, ip,  userId);
            return entity.stream().map(NetworkDeviceMapper::toDTO).toList();
        } catch (Exception e) {
            LOGGER.error("Found exception while fetch items by name or ip: {}", name);
            throw new RuntimeException("Found exception while fetch items by name or ip: "+ name+" Message: "+e.getMessage());
        }
    }

    public List<NetworkDeviceResponseDTO> getByRackAndUser(Long rackId) {
        if (rackId < 0 ) {
            LOGGER.warn("Rack id must be greater than 0. rack id: {}", rackId);
            throw new InvalidParameterException("Rack id must be greater than 0. rack id: "+rackId);
        }
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            List<NetworkDevices> entity = networkDeviceRepository.getByRackAndUser(rackId,  userId);
            return entity.stream().map(NetworkDeviceMapper::toDTO).toList();
        } catch (Exception e) {
            LOGGER.error("Found exception while fetch items by rack id. ID: {}", rackId);
            throw new RuntimeException("Found exception while fetch items by rack id. ID: {}"+ rackId+" Message: "+e.getMessage());
        }
    }

    public List<NetworkDeviceResponseDTO> getAll() {
        try {
            List<NetworkDevices> entity = networkDeviceRepository.findAll();
            return entity.stream().map(NetworkDeviceMapper::toDTO).toList();
        } catch (Exception e) {
            LOGGER.error("Found exception while fetching all network device.");
            throw new RuntimeException("Found exception while fetching all network device.");
        }
    }

    public Page<NetworkDeviceResponseDTO> getByPage(Integer page, Integer size) {
        if (page<0) {
            page = 0;
        }
        if (size<1) {
            size = 5;
        }
        Pageable pageable = PageRequest.of(page, size);
        return networkDeviceRepository.findAll(pageable).map(NetworkDeviceMapper::toDTO);
    }

    public NetworkDeviceResponseDTO getByIdAndUser(Long id) {
        if (id < 0 ) {
            LOGGER.warn("Network device id must be greater than 0. Id: {}", id);
            throw new InvalidParameterException("Network device id must be greater than 0. Id: "+id);
        }
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            NetworkDevices entity = networkDeviceRepository.getByIdAndUser(id, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found by device id: "+id));
            return NetworkDeviceMapper.toDTO(entity, entity.getInterfaces(), entity.getUsers());
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Network device not found by id: "+ id+" Message: "+e.getMessage());
        }
    }


    public List<NetworkDeviceResponseDTO> getAllAndUser() {
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            List<NetworkDevices> entity = networkDeviceRepository.getAllByUser(userId);
            return entity.stream().map(NetworkDeviceMapper::toDTO).toList();
        } catch (Exception e) {
            LOGGER.warn("Found exception while fetching items.");
            throw new RuntimeException("Found exception while fetching items.");
        }
    }

    public Page<NetworkDeviceResponseDTO> geAllByUserPageable(Integer page, Integer size) {
        if (page<0) {
            page = 0;
        }
        if (size<1) {
            size = 5;
        }
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            Pageable pageable = PageRequest.of(page, size);
            return networkDeviceRepository.geAllByUserPageable(userId, pageable).map(NetworkDeviceMapper::toDTO);
        } catch (Exception e) {
            LOGGER.error("Found exception while fetching items. Message: {}",e.getMessage());
            throw new RuntimeException("Found exception while fetching items. Message: {}"+e.getMessage());
        }

    }


    public NetworkDeviceResponseDTO save(NetworkDeviceRequestDTO dto) {
        Boolean isSlot = rackSlotService.isRackSlotEmpty(dto.getRackId(), dto.getRackSlotNumber());
        if (!isSlot) {
            throw new RuntimeException("Slot number: "+dto.getRackSlotNumber()+" is not empty of rack id: "+ dto.getRackId());
        }

        try {
            Racks rackEntity = rackRepository.getReferenceById(dto.getRackId());
            List<User> userEntities = userRepository.findAllById(dto.getUserIds());
            NetworkDevices entity = NetworkDeviceMapper.toEntity(dto, rackEntity, new HashSet<>(userEntities));
            entity=  networkDeviceRepository.save(entity);

            rackSlotService.assignHostToSlot(entity.getId(), rackEntity.getId(), entity.getRackSlotNumber());

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Network device is created. Name: "+entity.getHostName()
            );
            return NetworkDeviceMapper.toDTO(entity);
        } catch (Exception e) {
            LOGGER.error("Found exception while saving network device. Name: {}",dto.getName());
            throw new RuntimeException("Found exception while saving network device. Name: "+dto.getName()+ " Message: "+e.getMessage());
        }
    }

    public void saveAll(Set<NetworkDeviceRequestDTO> dtos) {
        try {
            Set<NetworkDevices> entities = dtos.stream().map(dto -> {
                Racks rackEntity = rackRepository.getReferenceById(dto.getRackId());
                List<User> userEntities = userRepository.findAllById(dto.getUserIds());
                return NetworkDeviceMapper.toEntity(dto, rackEntity, new HashSet<>(userEntities));
            }).collect(Collectors.toSet());
            List<NetworkDevices> savedEntities = networkDeviceRepository.saveAll(entities);
            savedEntities.forEach(n->{
                rackSlotService.assignHostToSlot(n.getId(), n.getRack().getId(), n.getRackSlotNumber());
            });
        } catch (Exception e) {
            LOGGER.error("Found exception while saving all network devices.");
            throw new RuntimeException("Found exception while saving all network devices. Message: "+e.getMessage());
        }
    }

    public NetworkDeviceResponseDTO update(Long id, NetworkDeviceRequestDTO dto) {
        try {
            NetworkDevices existing = networkDeviceRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Device not found with ID: " + id));


            List<User> userEntities = userRepository.findAllById(dto.getUserIds());

            existing.setHostName(dto.getName());
            existing.setHostType(HostType.valueOf(dto.getType().toUpperCase()));
            existing.setManufacturer(dto.getManufacturer());
            existing.setModel(dto.getModel());
            existing.setOsVersion(dto.getOsVersion());
            existing.setSerialNumber(dto.getSerialNumber());

            if (dto.getNumberOfPort() != null) {
                existing.setNumberOfPort(dto.getNumberOfPort());
            }

            if(dto.getInterfaces() != null) {
                Set<Interfaces> interfaces = dto.getInterfaces().stream()
                        .map(InterfaceMapper::toEntity).collect(Collectors.toSet());
                existing.setInterfaces(interfaces);

            }


            if (!existing.getRack().getId().equals(dto.getRackId())) {
                Racks rackEntity = rackRepository.getReferenceById(dto.getRackId());
                existing.setRack(rackEntity);
            }


            if (!existing.getRack().getId().equals(dto.getRackId()) || !existing.getRackSlotNumber().equals(dto.getRackSlotNumber())) {
                Boolean isSlot = rackSlotService.isRackSlotEmpty(dto.getRackId(), dto.getRackSlotNumber());
                if(!isSlot) {
                    throw new RuntimeException("Slot number: "+dto.getRackSlotNumber()+" is not empty of rack id: "+ dto.getRackId());
                } else {
                    rackSlotService.removeHostFromSlot(existing.getRack().getId(), existing.getRackSlotNumber());
                    existing.setRackSlotNumber(dto.getRackSlotNumber());
                    rackSlotService.assignHostToSlot(existing.getId(), dto.getRackId(), dto.getRackSlotNumber());
                }
            }

            existing.setUsers(new HashSet<>(userEntities));

            existing = networkDeviceRepository.save(existing);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Network device is updated. Name: "+existing.getHostName()
            );

            return NetworkDeviceMapper.toDTO(existing);
        } catch (Exception e) {
            LOGGER.error("Found exception while updating network device. ID: {}", id);
            throw new RuntimeException("Found exception while updating network device. ID: " + id+ " Message: "+e.getMessage());
        }
    }


    public void deleteById(Long id) {
        try {

            NetworkDevices entity = networkDeviceRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Device not found by id: "+id));
            rackSlotService.removeHostFromSlot(entity.getRack().getId(), entity.getRackSlotNumber());
            networkDeviceRepository.deleteById(id);

            activityLogService.createEntity(
                    ActivityType.DELETE,
                    "Network device is deleted. Name: "+entity.getHostName()
            );
        } catch (Exception e) {
            LOGGER.error("Found exception while deleting device by ID: {}. Message: {}", id, e.getMessage());
            throw new RuntimeException("Found exception while deleting device by ID: " + id+ " Message: "+e.getMessage());
        }
    }

    public void deleteAll() {
        try {
            networkDeviceRepository.deleteAll();
        } catch (Exception e) {
            LOGGER.error("Found exception while deleting all devices.");
            throw new RuntimeException("Found exception while deleting all devices.");
        }
    }

    public void deleteByIdAndUser(Long id) {
        try {
            Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            NetworkDevices entity = networkDeviceRepository.getByIdAndUser(id, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Device not found by id: "+id));

                networkDeviceRepository.deleteById(entity.getId());
                rackSlotService.removeHostFromSlot(entity.getId(), entity.getRackSlotNumber());
        } catch (Exception e) {
            LOGGER.error("Found exception while deleting device by ID and user. ID: {}", id);
            throw new RuntimeException("Found exception while deleting device by ID and user.");
        }
    }


    public boolean isValidIPv4(String ip) {
        if (ip == null || ip.isEmpty()) {
            return false;
        }

        String[] parts = ip.split("\\.");

        // Check for exactly four parts
        if (parts.length != 4) {
            return false;
        }

        for (String part : parts) {
            // Check if each part is a number
            try {
                int num = Integer.parseInt(part);
                // Check if the number is in the valid range
                if (num < 0 || num > 255) {
                    return false;
                }
                // Optional: Check for leading zeros (to exclude "01", "001", etc.)
                if (part.startsWith("0") && part.length() > 1) {
                    return false;
                }
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return true;
    }



}
