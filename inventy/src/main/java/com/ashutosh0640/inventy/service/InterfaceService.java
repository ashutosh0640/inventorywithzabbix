package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.entity.Interfaces;
import com.ashutosh0640.inventy.enums.ActivityType;
import com.ashutosh0640.inventy.enums.Status;
import com.ashutosh0640.inventy.exception.ResourceNotFoundException;
import com.ashutosh0640.inventy.repository.InterfaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.stream.Collectors;

@Service
public class InterfaceService {

    private final InterfaceRepository interfaceRepository;
    private final ActivityLogService activityLogService;
    private final ExecutorService executor;
    private final Logger LOGGER = LoggerFactory.getLogger(InterfaceService.class);

    public InterfaceService(InterfaceRepository interfaceRepository,
                            ActivityLogService activityLogService,
                            ExecutorService executor
    ) {
        this.interfaceRepository = interfaceRepository;
        this.activityLogService = activityLogService;
        this.executor = executor;
    }

    public Interfaces createEntity(Interfaces intf) {
        if ( intf == null ) {
            LOGGER.warn("Interface is null.");
            throw new InvalidParameterException("Interface is null.");
        }
        try {
            intf = interfaceRepository.save(intf);
            activityLogService.createEntity(
                    ActivityType.WRITE,
                    "Interface is created. ID: "+intf.getId()
            );
            return intf;
        } catch (Exception ex) {
            LOGGER.error("Found exception while saving interface entity with IP: {}", intf.getIp());
            throw new RuntimeException("Found exception while saving interface entity with IP: "+ intf.getIp());
        }
    }

    public List<Interfaces> createAllEntity(Set<Interfaces> intfs) {
        if ( intfs == null ) {
            LOGGER.warn("List of interface is null.");
            throw new InvalidParameterException("List of interface is null.");
        }
        
        try {

            activityLogService.createEntity(
                    ActivityType.WRITE,
                    intfs.size()+" interfaces are created."
            );
            return interfaceRepository.saveAll(intfs);
        } catch (Exception ex) {
            LOGGER.error("Found exception while saving interface entities.");
            throw new RuntimeException("Found exception while saving interface entities.");
        }
    }

    public Interfaces getEntityById(Long id) {
        if ( id == null ) {
            LOGGER.warn("Id is null.");
            throw new InvalidParameterException("Interface id is null.");
        }
        try {
            return interfaceRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Interface not found by id: "+id));
        } catch (Exception ex) {
            LOGGER.error("Found error while fetching interface by id: {}",id);
            throw new RuntimeException("Found error while fetching interface by id: "+id);
        }
    }

    public List<Interfaces> getAllEntity() {
        try {
            return interfaceRepository.findAll();
        } catch (Exception ex) {
            LOGGER.error("Found error while fetching all interface.");
            throw new RuntimeException("Found error while fetching all interface.");

        }
    }

    public Interfaces updateEntity(Long id, Interfaces intf) {
        try {
            Interfaces interfaces = interfaceRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Interface not found by id: "+ id));
            interfaces.setHost(intf.getHost());
            interfaces.setIp(intf.getIp());

            intf = interfaceRepository.save(intf);

            activityLogService.createEntity(
                    ActivityType.UPDATE,
                    "Interface is updated. ID: "+intf.getId()
            );
            return intf;
        }
        catch (Exception ex) {
            LOGGER.error("Found error while updating interface with id: {}", id);
            throw new RuntimeException("Found error while updating interface with id:"+ id);
        }
    }

    public Long countInterface() {
        return interfaceRepository.count();
    }

    public void deleteEntityById(Long id) {
        if (id == null) {
            LOGGER.warn("Interface id is null");
            throw new InvalidParameterException("Interface id is null.");
        }
        try {
            interfaceRepository.deleteById(id);
            activityLogService.createEntity(
                    ActivityType.DELETE,
                    "Interface is created. ID: "+id
            );
        } catch (Exception ex) {
            LOGGER.error("Found error while deleting interface by id: {}",id);
            throw new RuntimeException("Found error while deleting interface by id: "+id);
        }

    }

    public void deleteAllEntity() {
        interfaceRepository.deleteAll();
        LOGGER.info("All interface deleted.");
        activityLogService.createEntity(
                ActivityType.DELETE,
                "All interfaces are deleted."
        );
    }


    public static boolean isHostReachable(String ip) {
        if (ip != null) {
            System.out.println("Checking reachability: "+ ip);
            String os = System.getProperty("os.name").toLowerCase();
            String command = os.contains("win") ?
                    "ping -n 1 -w 1000 " + ip :
                    "ping -c 1 -W 1 " + ip;
            try {
                Process process = Runtime.getRuntime().exec(command);
                return process.waitFor() == 0;
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }


    @Scheduled(fixedRate = 120000) // Every 2 minute
    public void scanAndUpdateStatuses() {
        LOGGER.info("Scanning and updating interface status...");
        List<Interfaces> interfaces = interfaceRepository.findAll();

        List<Callable<Void>> tasks = interfaces.stream().map(iface -> (Callable<Void>) () -> {
            String ip = iface.getIp();
            boolean isOnline = isHostReachable(ip);
            String newStatus = isOnline ? "ONLINE" : "OFFLINE";

            // Only update if status changed
            if (!newStatus.equalsIgnoreCase(iface.getStatus().toString())) {
                iface.setStatus(Status.valueOf(newStatus));
                interfaceRepository.save(iface);
                System.out.println("Updated " + ip + " to " + newStatus);
            }
            return null;
        }).collect(Collectors.toList());

        try {
            executor.invokeAll(tasks);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Ping thread pool interrupted: " + e.getMessage());
        }
    }

}
