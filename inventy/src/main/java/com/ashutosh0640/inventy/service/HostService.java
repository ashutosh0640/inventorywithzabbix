package com.ashutosh0640.inventy.service;


import com.ashutosh0640.inventy.repository.HostRepository;
import org.springframework.stereotype.Service;

@Service
public class HostService {

    private final HostRepository hostRepository;

    public HostService(HostRepository hostRepository) {
        this.hostRepository = hostRepository;
    }


    public Long countHost(String hostType, String status) {
        try {
            return hostRepository.countHost(hostType, status);
        } catch (Exception e) {
            throw new RuntimeException("Illegal Argument Exception: "+ e.getMessage());
        }
    }
}
