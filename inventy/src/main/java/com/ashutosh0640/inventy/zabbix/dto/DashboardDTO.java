package com.ashutosh0640.inventy.zabbix.dto;


public class DashboardDTO {

    private boolean isHostActive;
    private Integer totalHostNumber;
    private Integer enableHstsNumber;
    private Integer disableHostsNumber;
    private Integer templatesNumber;
    private Integer itemsNumber;
    private Integer triggersNumber;
    private Integer usersNumber;

    public DashboardDTO() {    }

    public DashboardDTO(boolean isHostActive, Integer totalHostNumber, Integer enableHstsNumber, Integer disableHostsNumber, Integer templatesNumber, Integer itemsNumber, Integer triggersNumber, Integer usersNumber) {
        this.isHostActive = isHostActive;
        this.totalHostNumber = totalHostNumber;
        this.enableHstsNumber = enableHstsNumber;
        this.disableHostsNumber = disableHostsNumber;
        this.templatesNumber = templatesNumber;
        this.itemsNumber = itemsNumber;
        this.triggersNumber = triggersNumber;
        this.usersNumber = usersNumber;
    }

    public boolean isHostActive() {
        return isHostActive;
    }

    public void setHostActive(boolean hostActive) {
        isHostActive = hostActive;
    }

    public Integer getTotalHostNumber() {
        return totalHostNumber;
    }

    public void setTotalHostNumber(Integer totalHostNumber) {
        this.totalHostNumber = totalHostNumber;
    }

    public Integer getEnableHstsNumber() {
        return enableHstsNumber;
    }

    public void setEnableHstsNumber(Integer enableHstsNumber) {
        this.enableHstsNumber = enableHstsNumber;
    }

    public Integer getDisableHostsNumber() {
        return disableHostsNumber;
    }

    public void setDisableHostsNumber(Integer disableHostsNumber) {
        this.disableHostsNumber = disableHostsNumber;
    }

    public Integer getTemplatesNumber() {
        return templatesNumber;
    }

    public void setTemplatesNumber(Integer templatesNumber) {
        this.templatesNumber = templatesNumber;
    }

    public Integer getItemsNumber() {
        return itemsNumber;
    }

    public void setItemsNumber(Integer itemsNumber) {
        this.itemsNumber = itemsNumber;
    }

    public Integer getTriggersNumber() {
        return triggersNumber;
    }

    public void setTriggersNumber(Integer triggersNumber) {
        this.triggersNumber = triggersNumber;
    }

    public Integer getUsersNumber() {
        return usersNumber;
    }

    public void setUsersNumber(Integer usersNumber) {
        this.usersNumber = usersNumber;
    }
}
