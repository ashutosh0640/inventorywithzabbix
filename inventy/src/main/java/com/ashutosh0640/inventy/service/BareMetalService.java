package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.BareMetalServerRequestDTO;
import com.ashutosh0640.inventy.dto.BareMetalServerResponseDTO;
import com.ashutosh0640.inventy.entity.BareMetalServers;
import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.entity.Racks;
import com.ashutosh0640.inventy.entity.User;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.enums.ManagementType;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.mapper.BareMetalMapper;
import com.ashutosh0640.inventy.mapper.InterfaceMapper;
import com.ashutosh0640.inventy.repository.BareMetalRepository;
import com.ashutosh0640.inventy.repository.InterfaceRepository;
import com.ashutosh0640.inventy.repository.RackRepository;
import com.ashutosh0640.inventy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class BareMetalService {

    private final BareMetalRepository bareMetalRepository;
    private final RackRepository rackRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final InterfaceRepository interfaceRepository;
    private final RackSlotsService rackSlotService;
    private static final Logger LOGGER = LoggerFactory.getLogger(BareMetalService.class);

    public BareMetalService(BareMetalRepository bareMetalRepository,
                            RackRepository rackRepository,
                            UserRepository userRepository,
                            ActivityLogService activityLogService,
                            RackSlotsService rackSlotService,
                            InterfaceRepository interfaceRepository) {
        this.bareMetalRepository = bareMetalRepository;
        this.rackRepository = rackRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
        this.rackSlotService = rackSlotService;
        this.interfaceRepository = interfaceRepository;
    }

    public BareMetalServerResponseDTO save(BareMetalServerRequestDTO dto) {
        Boolean isSlot = rackSlotService.isRackSlotEmpty(dto.getRackId(), dto.getRackSlotNumber());
        if (!isSlot) {
            throw new RuntimeException("Slot number: "+dto.getRackSlotNumber()+" is not empty of rack id: "+ dto.getRackId());
        }
        try {
            LOGGER.info("Fetching bare metal server rack with ID: {}", dto.getRackId());
            Racks rack = rackRepository.getReferenceById(dto.getRackId());

            List<User> userEntities = userRepository.findAllById(dto.getUserIds());

            BareMetalServers bareMetal = bareMetalRepository.save(BareMetalMapper.toEntity(dto, rack, new HashSet<>(userEntities)));
            LOGGER.info("Saving bareMetal: {}", bareMetal);

            Set<Interfaces> in = dto.getInterfaces().stream().map(i -> {

                Interfaces interf = InterfaceMapper.toEntity(i, bareMetal);
                return interfaceRepository.save(interf);
            }).collect(Collectors.toSet());

            rackSlotService.assignHostToSlot(bareMetal.getId(), rack.getId(), bareMetal.getRackSlotNumber());

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Physical server is created. ID: "+bareMetal.getId()
            );
            return BareMetalMapper.toDTO(bareMetal, in, bareMetal.getVirtualizations(), bareMetal.getUsers());
        } catch (Exception ex) {
            LOGGER.error("Error while saving bare metal  {}: ", dto.getName(), ex);
            throw new RuntimeException("Error while saving bare metal: "+dto.getName()+". Reason: " + ex.getMessage());
        }
    }


    public void saveAll(Set<BareMetalServerRequestDTO> dtos) {
        try {
            LOGGER.info("Fetching bare metal server's rack");

            Interfaces interf = new Interfaces();

            List<BareMetalServers> servers = dtos.stream().map(b -> {

                Racks r = rackRepository.findById(b.getRackId())
                        .orElseThrow(() -> new ResourceNotFoundException("Rack not found by id: "+b.getRackId()));

                List<User> users = userRepository.findAllById(b.getUserIds());
                return BareMetalMapper.toEntity(b, r, new HashSet<>(users));
            }).toList();

            List<BareMetalServers> bareMetals = bareMetalRepository.saveAll(servers);
            LOGGER.info("Saved bareMetal successfully.");

            bareMetals.forEach(b -> {
                rackSlotService.assignHostToSlot(b.getId(), b.getRack().getId(), b.getRackSlotNumber());
            });

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Many Physical servers are created."
            );

        } catch (Exception ex) {
            LOGGER.error("Error while saving bare metals", ex);
            throw new RuntimeException("Error while saving bare metals. Reason: " + ex.getMessage());
        }
    }

    public BareMetalServerResponseDTO getById(Long id) {
        try {
            LOGGER.info("Fetching bareMetal with ID: {}", id);

            BareMetalServers bareMetal = bareMetalRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetal not found with ID: " + id));

            return BareMetalMapper.toDTO(bareMetal, bareMetal.getInterfaces(), bareMetal.getVirtualizations(), bareMetal.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error fetching bareMetal with ID {}: ", id, ex);
            throw new RuntimeException("Failed to retrieve bareMetal. Reason: " + ex.getMessage());
        }
    }

    public List<BareMetalServerResponseDTO> getByIp(String ip) {
        try {
            LOGGER.info("Fetching bareMetal with IP: {}", ip);

            List<BareMetalServers> bareMetals = bareMetalRepository.findByIp(ip);

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching bareMetal with IP {}: ", ip, ex);
            throw new RuntimeException("Failed to retrieve bareMetal. Reason: " + ex.getMessage());
        }
    }


    public List<BareMetalServerResponseDTO> getByIp(String ip, Long userId) {
        try {
            LOGGER.info("Fetching bareMetal with IP: {}", ip);

            List<BareMetalServers> bareMetals = bareMetalRepository.findByIpAndUser(ip, userId);

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching bareMetal with IP {}: ", ip, ex);
            throw new RuntimeException("Failed to retrieve bareMetal. Reason: " + ex.getMessage());
        }
    }


    public List<BareMetalServerResponseDTO> getAll() {
        try {
            LOGGER.info("Fetching all bareMetals...");
            List<BareMetalServers> bareMetals = bareMetalRepository.findAll();

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching bareMetals: ", ex);
            throw new RuntimeException("Failed to retrieve bareMetals. Reason: " + ex.getMessage());
        }
    }

    public List<BareMetalServerResponseDTO> getAllSorted(String sortOrder, String field) {
        try {
            LOGGER.info("Fetching all bareMetals sorted by {} in {} order", field, sortOrder);

            // Set default sorting to ASC if not provided
            Sort.Direction direction = Sort.Direction.ASC;
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                direction = Sort.Direction.DESC;
            }

            // Apply sorting dynamically based on key
            Sort sort = Sort.by(direction, field);

            List<BareMetalServers> bareMetals = bareMetalRepository.findAll(sort);

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .collect(Collectors.toList());
        } catch (Exception ex) {
            LOGGER.error("Error fetching sorted bareMetals: ", ex);
            throw new RuntimeException("Failed to retrieve bareMetals. Reason: " + ex.getMessage());
        }
    }

    public Page<BareMetalServerResponseDTO> getAllPaginated(int pageSize, int pageNumber) {
        try {
            LOGGER.info("Fetching all bareMetals with pagination - Page: {}, Size: {}", pageNumber, pageSize);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0); // Ensure non-negative page number

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<BareMetalServers> bareMetalsPage = bareMetalRepository.findAll(pageable);

            return bareMetalsPage.map(BareMetalMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated bareMetals: ", ex);
            throw new RuntimeException("Failed to retrieve bareMetals. Reason: " + ex.getMessage());
        }
    }

    public Long count() {
        return bareMetalRepository.count();
    }

    public BareMetalServerResponseDTO update(Long id, BareMetalServerRequestDTO dto) {
        try {
            LOGGER.info("Updating bareMetal with ID: {}", id);

            // Find existing bareMetal
            BareMetalServers existingBareMetal = bareMetalRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetal not found with ID: " + id));

            // Update fields
            existingBareMetal.setHostName(dto.getName());
            existingBareMetal.setManufacturer(dto.getManufacturer());
            existingBareMetal.setModelName(dto.getModelName());
            existingBareMetal.setSerialNumber(dto.getSerialNumber());
            existingBareMetal.setManagement(ManagementType.valueOf(dto.getManagement()));
            existingBareMetal.setRackSlotNumber(dto.getRackSlotNumber());

            Set<Interfaces> interf = dto.getInterfaces().stream()
                    .map(InterfaceMapper::toEntity).collect(Collectors.toSet());

            existingBareMetal.setInterfaces(interf);


            // Save updated bareMetal
            BareMetalServers updatedBareMetal = bareMetalRepository.save(existingBareMetal);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Physical server is updated. ID: "+updatedBareMetal.getId()
            );
            return BareMetalMapper.toDTO(updatedBareMetal);
        } catch (Exception ex) {
            LOGGER.error("Error updating bareMetal with ID {}: ", id, ex);
            throw new RuntimeException("Failed to update bareMetal. Reason: " + ex.getMessage());
        }
    }

    public void delete(Long id) {
        try {
            LOGGER.info("Deleting bareMetal with ID: {}", id);

            // Check if the bareMetal exists
            BareMetalServers bareMetal = bareMetalRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetal not found with ID: " + id));

            // Delete bareMetal
            rackSlotService.removeHostFromSlot(bareMetal.getRack().getId(), bareMetal.getRackSlotNumber());
            bareMetalRepository.delete(bareMetal);
            activityLogService.createEntity(
                    ActivityType.DELETE,
                    "Physical server is delete. ID: "+id
            );
            LOGGER.info("Successfully deleted bareMetal with ID: {}", id);
        } catch (Exception ex) {
            LOGGER.error("Error deleting bareMetal with ID {}: ", id, ex);
            throw new RuntimeException("Failed to delete bareMetal. Reason: " + ex.getMessage());
        }
    }




    public BareMetalServerResponseDTO updateRackToBaremetal(Long baremetalId, Long rackId, Short slot) {
        LOGGER.info("Updating location to rack with ID: {}", rackId);
        try {
            BareMetalServers baremetal = bareMetalRepository.findById(baremetalId)
                    .orElseThrow(() -> new ResourceNotFoundException("Bare metal not found with ID: " + baremetalId));

            Racks rack = rackRepository.findById(rackId)
                    .orElseThrow(() -> new ResourceNotFoundException("Rack not found with ID: " + rackId));

            baremetal.setRack(rack);
            LOGGER.info("Successfully updated bare metal to rack with ID: {}", rackId);
            rackSlotService.removeHostFromSlot(baremetal.getRack().getId(), baremetal.getRackSlotNumber());
            rackSlotService.assignHostToSlot(baremetalId, rackId, slot);
            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Physical server "+ baremetal.getHostName() +"  shifted from rack "+baremetal.getRack().getName()+" to ->  "+rack.getName()+"."
            );
            return BareMetalMapper.toDTO(bareMetalRepository.save(baremetal));
        } catch (Exception ex) {
            LOGGER.error("Error while updating bare metal to racks id {}: ", rackId, ex);
            throw new RuntimeException("Failed to update bare metal to racks. Reason: " + ex.getMessage());
        }
    }


    public void addUserToBaremetal(Long baremetalId, List<Long> userIds) {
        LOGGER.info("Adding user to bare metal with ID: {}", baremetalId);
        try {
            userIds.forEach(userId -> bareMetalRepository.addUser(baremetalId, userId));
            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Some user are added to baremetal. ID: "+baremetalId
            );
        } catch (Exception ex) {
            LOGGER.error("Error while adding user to bare metal id {}: ", baremetalId, ex);
            throw new RuntimeException("Error while adding user to bare metal. Reason: " + ex.getMessage());
        }

    }


    public void removeUserFromBaremetal(Long baremetalId, List<Long> userIds) {
        LOGGER.info("Finding bare metal with ID: {}", baremetalId);
        try {
            userIds.forEach(userId -> bareMetalRepository.removeUser(baremetalId, userId));
            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Some user are removed from baremetal. ID: "+baremetalId
            );
        } catch (Exception ex) {
            LOGGER.error("Error while removing user from bare metal id {}: ", baremetalId, ex);
            throw new RuntimeException("Error while removing user from bare metal. Reason: " + ex.getMessage());
        }

    }




    // ============== User respective methods ===================================== //
    public List<BareMetalServerResponseDTO> getAllByUser() {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching all bareMetals for userId: {}", userId);

            List<BareMetalServers> bareMetals = bareMetalRepository.findAllByUser(userId);

            return bareMetals.stream()
                    .map(BareMetalMapper::toDTO)
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching bareMetals for user: ", ex);
            throw new RuntimeException("Found error while fetching bareMetals. Reason: " + ex.getMessage());
        }
    }

    public BareMetalServerResponseDTO getByUser(Long baremetal_id) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching server for userId: {}", userId);
            BareMetalServers server = bareMetalRepository.findByUser(userId, baremetal_id)
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetalServer not found for userId " + userId));

            return BareMetalMapper.toDTO(server, server.getInterfaces(), server.getVirtualizations(), server.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Found error while fetching server: ", ex);
            throw new RuntimeException("Found error while fetching server. Reason: " + ex.getMessage());
        }
    }

    public List<BareMetalServerResponseDTO> getBareMetalsForUserByIds(List<Long> baremetalIds) {
        if (baremetalIds == null || baremetalIds.isEmpty()) {
            return Collections.emptyList();
        }
        return baremetalIds.stream().map(this::getByUser).toList();
    }

    public List<BareMetalServerResponseDTO> getByIpAndUser(String ip, Long userId) {
        try {
            LOGGER.info("Fetching bareMetal with IP: {}", ip);

            List<BareMetalServers> bareMetals = bareMetalRepository.findByIpAndUser(ip, userId);

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .toList();

        } catch (Exception ex) {
            LOGGER.error("Error fetching bareMetal with IP {}: ", ip, ex);
            throw new RuntimeException("Failed to retrieve bareMetal. Reason: " + ex.getMessage());
        }
    }


    public BareMetalServerResponseDTO getBySerialNumberAndUser(String sNo) {
        try {
            LOGGER.info("Searching bareMetals with serial number: {}", sNo);

            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();

            BareMetalServers bareMetal = bareMetalRepository.findBySerialNumberAndUser(sNo, userId)
                    .orElseThrow(() -> new ResourceNotFoundException("No bare metal found with serial number: " + sNo));

            return BareMetalMapper.toDTO(bareMetal, bareMetal.getInterfaces(), bareMetal.getVirtualizations(), bareMetal.getUsers());

        } catch (Exception ex) {
            LOGGER.error("Error searching bareMetals by serial number {}: ", sNo, ex);
            throw new RuntimeException("Failed to search bare metals. Reason: " + ex.getMessage());
        }
    }

    public List<BareMetalServerResponseDTO> getByServerNameAndUser(String name) {
        try {
            LOGGER.info("Searching bareMetals with name: {}", name);
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            List<BareMetalServers> bareMetals = bareMetalRepository.findByServerNameAndUserContainingIgnoreCase(name, userId);

            if (bareMetals.isEmpty()) {
                LOGGER.warn("No bareMetals found matching: {}", name);
                throw new ResourceNotFoundException("No bareMetals found with name: " + name);
            }

            return bareMetals.stream()
                    .map(b->
                         BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers())
                    )
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching bareMetals by name {}: ", name, ex);
            throw new RuntimeException("Failed to search bareMetals. Reason: " + ex.getMessage());
        }
    }



    public List<BareMetalServerResponseDTO> getByModelAndUser(String name) {
        try {
            LOGGER.info("Searching bareMetals with model name: {}", name);
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            List<BareMetalServers> bareMetals = bareMetalRepository.findByModelNameAndUserContainingIgnoreCase(name, userId);

            if (bareMetals.isEmpty()) {
                LOGGER.warn("No bareMetals found by model name matching: {}", name);
                throw new ResourceNotFoundException("No bareMetals found with name: " + name);
            }

            return bareMetals.stream()
                    .map(b-> BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers()))
                    .collect(Collectors.toList());

        } catch (Exception ex) {
            LOGGER.error("Error searching bareMetals by model name {}: ", name, ex);
            throw new RuntimeException("Failed to search bareMetals. Reason: " + ex.getMessage());
        }
    }



    public List<BareMetalServerResponseDTO> getByRackByUser(Long rackId) {
        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching all bare metal server in rack with rack id: {}", rackId);
            List<BareMetalServers> list = bareMetalRepository.findByRackAndUser(rackId, userId);

            if (list.isEmpty()) {
                LOGGER.warn("No bareMetals found in rack with  rack id: {}", rackId);
                return new ArrayList<>();
            }

            return list.stream()
                    .map(b->{
                        return BareMetalMapper.toDTO(b, b.getInterfaces(), b.getVirtualizations(), b.getUsers());
                    })
                    .toList();


        } catch (ResourceNotFoundException ex) {
            LOGGER.error("No bare metal server found.", ex);
            throw new RuntimeException("No bare metal server found."+ ex.getMessage());

        } catch (Exception ex) {
            LOGGER.error("Error while fetching bare metal server.", ex);
            throw new RuntimeException("Error while fetching bare metal server."+ ex.getMessage());
        }
    }


    public void removeAllForUser() {
        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.warn("Deleting all bareMetals for userId: {}", userId);
            bareMetalRepository.removeAllForUser(userId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project ", ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }


    public void deleteByUser(Long serverId) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.warn("Deleting project with project Id: {}", serverId);
            bareMetalRepository.removeUser(userId, serverId);
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting physical server. ", ex);
            throw new RuntimeException("Found error while deleting physical server. Reason: " + ex.getMessage());
        }

    }

    public BareMetalServerResponseDTO updateByUser(Long baremetalId, BareMetalServerRequestDTO dto) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching baremetal for update: baremetalId={}, userId={}", baremetalId, userId);

            BareMetalServers bareMetal = bareMetalRepository.findByUser(userId, baremetalId)
                    .orElseThrow(() -> new ResourceNotFoundException("BareMetalServer not found or not authorized for update"));

            bareMetal.setHostName(dto.getName());
            bareMetal.setManufacturer(dto.getManufacturer());
            bareMetal.setModelName(dto.getModelName());
            bareMetal.setSerialNumber(dto.getSerialNumber());
            bareMetal.setManagement(ManagementType.valueOf(dto.getManagement()));
            Set<Interfaces> intf = dto.getInterfaces().stream()
                    .map(InterfaceMapper::toEntity).collect(Collectors.toSet());
            bareMetal.setInterfaces(intf);
            return BareMetalMapper.toDTO(bareMetalRepository.save(bareMetal));
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting project for user: ", ex);
            throw new RuntimeException("Found error while deleting project. Reason: " + ex.getMessage());
        }
    }

    public Page<BareMetalServerResponseDTO> getAllByUserPaginated(int pageSize, int pageNumber) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Fetching paginated bareMetals for userId: {}", userId);
            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);
            Page<BareMetalServers> bareMetalsPage = bareMetalRepository.findAllByUserPaginated(userId, pageable);

            return bareMetalsPage.map(BareMetalMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated bareMetals: ", ex);
            throw new RuntimeException("Failed to retrieve bareMetals. Reason: " + ex.getMessage());
        }
    }

    public Page<BareMetalServerResponseDTO> searchByName(String name, int pageSize, int pageNumber) {

        try {
            final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
            LOGGER.info("Searching bareMetals by name '{}' for userId: {}", name, userId);

            // Default to page size 10 if not provided
            int effectivePageSize = (pageSize <= 0) ? 10 : pageSize;
            int effectivePageNumber = Math.max(pageNumber, 0);

            Pageable pageable = PageRequest.of(effectivePageNumber, effectivePageSize);

            Page<BareMetalServers> bareMetalsPage = bareMetalRepository.searchByNameAndUser(name, userId, pageable);

            return bareMetalsPage.map(BareMetalMapper::toDTO);

        } catch (Exception ex) {
            LOGGER.error("Error fetching paginated bareMetals for user with user ", ex);
            throw new RuntimeException("Failed to retrieve bareMetals. Reason: " + ex.getMessage());
        }
    }

    public long countByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Counting bareMetals for userId: {}", userId);
        return bareMetalRepository.countByUser(userId);
    }

    public boolean isAccessibleByUser(Long serverId) {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Checking access for serverId: {} and userId: {}", serverId, userId);
        return bareMetalRepository.existsByIdAndUser(serverId, userId);
    }

    public List<Long> getIdsByUser() {
        final Long userId = CustomUserDetailsService.getCurrentUserIdFromContext();
        LOGGER.info("Fetching all accessible server IDs for userId: {}", userId);
        return bareMetalRepository.findAllIdsByUser(userId);
    }
}
