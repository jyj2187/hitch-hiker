package com.codestates.seb006main.chat.dto;

import com.codestates.seb006main.chat.entity.Chat;
import lombok.*;

public class ChatDto {
    @Getter
    @Setter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Message {
        private String roomId;
        private Long senderId;
        private Long receiverId;
        private String message;
        private Chat.ChatType chatType;

        @Builder
        public Message(String roomId, Long senderId, Long receiverId, String message, Chat.ChatType chatType) {
            this.roomId = roomId;
            this.senderId = senderId;
            this.receiverId = receiverId;
            this.message = message;
            this.chatType = chatType;
        }
    }
}
