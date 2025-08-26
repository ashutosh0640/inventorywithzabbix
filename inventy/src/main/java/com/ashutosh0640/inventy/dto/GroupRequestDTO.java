package com.ashutosh0640.inventy.dto;

public class GroupRequestDTO {

    private String name;
    private String description;

    public GroupRequestDTO() {    }

    public GroupRequestDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
