package com.ashutosh0640.inventy.service;


import com.ashutosh0640.inventy.enums.HostType;
import com.ashutosh0640.inventy.enums.Status;
import com.ashutosh0640.inventy.repository.HostRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class HostService {

    private final HostRepository hostRepository;

    public HostService(HostRepository hostRepository) {
        this.hostRepository = hostRepository;
    }


    public Long countHost(String hostType, String status) {
        try {
//            HostType ht = HostType.valueOf(hostType.trim().toUpperCase());
//            Status st = Status.valueOf(status.trim().toUpperCase());

//            System.out.println("host type: "+ hostType +" status: "+status);
            return hostRepository.countHost(hostType, status);
        } catch (Exception e) {
            throw new RuntimeException("Illegal Argument Exception: "+ e.getMessage());
        }
    }


}
