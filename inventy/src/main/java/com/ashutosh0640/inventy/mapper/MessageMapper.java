package com.ashutosh0640.inventy.mapper;

import com.ashutosh0640.inventy.dto.MessageDTO;
import com.ashutosh0640.inventy.entity.Message;

public class MessageMapper {

    public static MessageDTO convertToDTO(Message message) {

        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderUsername(message.getSender().getUsername());

        if (message.getReceiver() != null) {
            dto.setReceiverId(message.getReceiver().getId());
            dto.setReceiverUsername(message.getReceiver().getUsername());
        }

        if (message.getGroup() != null) {
            dto.setGroupId(message.getGroup().getId());
            dto.setGroupName(message.getGroup().getName());
        }

        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setTimestamp(message.getTimestamp());
        dto.setDelivered(message.isDelivered());
        dto.setRead(message.isRead());
        return dto;
    }
}
