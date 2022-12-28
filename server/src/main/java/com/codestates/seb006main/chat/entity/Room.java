package com.codestates.seb006main.chat.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Room {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    private UUID roomId;
    private String name;
    private Long memberId;
    private Long otherId;
    private String lastChat;
    private LocalDateTime lastChatted;

    @Builder
    public Room(UUID roomId, String name, Long memberId, Long otherId, String lastChat, LocalDateTime lastChatted) {
        this.roomId = roomId;
        this.name = name;
        this.memberId = memberId;
        this.otherId = otherId;
        this.lastChat = lastChat;
        this.lastChatted = lastChatted;
    }

    public void updateLastChat(Chat chat) {
        this.lastChat = chat.getMessage();
        this.lastChatted = chat.getSendDate();
    }
}
