package com.codestates.seb006main.chat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class RoomDto {
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Post{
        // TODO: 추가 정보가 필요할 수 있음.
        private Long otherId;

        @Builder
        public Post(Long otherId) {
            this.otherId = otherId;
        }
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Response {
        private String roomId;
        private String name;
        private Long memberId;
//        private String member;
        private Long otherId;
//        private String other;
//        private String lastChatter;
        private String lastChat;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private LocalDateTime lastChatted;
        @Builder
        public Response(String roomId, String name, Long memberId, Long otherId, String lastChat, LocalDateTime lastChatted) {
            this.roomId = roomId;
            this.name = name;
            this.memberId = memberId;
            this.otherId = otherId;
            this.lastChat = lastChat;
            this.lastChatted = lastChatted;
        }
    }
}
