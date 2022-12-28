package com.codestates.seb006main.chat.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Chat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;
    private String roomId;
    private Long senderId;
    private String message;
    private LocalDateTime sendDate;
//    @Enumerated(EnumType.STRING)
//    private ChatType chatType;
//    @Enumerated(EnumType.STRING)
//    private ChatStatus chatStatus;

    @Builder
    public Chat(Long chatId, String roomId, Long senderId, String message) {
        this.chatId = chatId;
        this.roomId = roomId;
        this.senderId = senderId;
        this.message = message;
        this.sendDate = LocalDateTime.now();
    }

    public enum ChatType{
        ENTER, EXIT, CHAT
    }

//    public enum ChatStatus {
//        READ, NOT_READ, EXPIRED, INACTIVE
//    }
}
