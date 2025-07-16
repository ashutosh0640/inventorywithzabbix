package com.ashutosh0640.inventy.service;

import com.ashutosh0640.inventy.dto.DashboardDTO;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final LocationService locationService;
    private final ProjectService projectService;
    private final RackService rackService;
    private final BareMetalService bareMetalService;
    private final VirtualizationsService virtualizationsService;
    private final VirtualMachineService virtualMachineService;
    private final HostService hostService;

    public DashboardService(LocationService locationService,
                        ProjectService projectService,
                        RackService rackService,
                        BareMetalService bareMetalService,
                        VirtualizationsService virtualizationsService,
                        VirtualMachineService virtualMachineService,
                            HostService hostService) {
        this.locationService = locationService;
        this.projectService = projectService;
        this.rackService = rackService;
        this.bareMetalService = bareMetalService;
        this.virtualizationsService = virtualizationsService;
        this.virtualMachineService = virtualMachineService;
        this.hostService = hostService;

    }


    public DashboardDTO dashboardDetails() {
        DashboardDTO dto = new DashboardDTO();
        dto.setLocationCount(locationService.countLocation());
        dto.setProjectCount(projectService.countProject());
        dto.setRackCount(rackService.count());
        dto.setBaremetalCount(bareMetalService.count());
        dto.setBaremetalOnlineCount(hostService.countHost("PHYSICAL_SERVER", "ONLINE"));
        dto.setVpCount(virtualizationsService.countVP());
        dto.setVpOnlineCount(hostService.countHost("VIRTUALIZATION", "ONLINE"));
        dto.setVmCount(virtualMachineService.count());
        dto.setVmOnlineCount(hostService.countHost("VIRTUAL_SERVER", "ONLINE"));
        return dto;
    }
}
