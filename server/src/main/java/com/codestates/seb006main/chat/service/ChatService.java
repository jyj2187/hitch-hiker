package com.codestates.seb006main.chat.service;

import com.codestates.seb006main.chat.dto.ChatDto;
import com.codestates.seb006main.chat.dto.RoomDto;
import com.codestates.seb006main.chat.entity.Chat;
import com.codestates.seb006main.chat.entity.Room;
import com.codestates.seb006main.chat.mapper.RoomMapper;
import com.codestates.seb006main.chat.repository.ChatRepository;
import com.codestates.seb006main.chat.repository.RoomRepository;
import com.codestates.seb006main.dto.MultiResponseDto;
import com.codestates.seb006main.jwt.JwtUtils;
import com.codestates.seb006main.members.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Transactional
@RequiredArgsConstructor
@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final MemberRepository memberRepository;
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    private final JwtUtils jwtUtils;

    public void saveChat(ChatDto.Message message) {
        Chat chat = Chat.builder()
                .roomId(message.getRoomId())
                .senderId(message.getSenderId())
                .message(message.getMessage())
                .build();
        chatRepository.save(chat);
        updateLastChat(chat);
    }

    public String getDisplayName(String accessToken) {
        accessToken = accessToken.replace("Bearer ", "");
        return memberRepository.findById(getMemberIdFromToken(accessToken)).orElseThrow().getDisplayName();
    }

    public Long getMemberIdFromToken(String accessToken) {
        accessToken = accessToken.replace("Bearer ", "");
        return jwtUtils.getMemberIdFromToken(accessToken);
    }

    private void updateLastChat(Chat chat) {
        Room room = roomRepository.findById(UUID.fromString(chat.getRoomId())).orElseThrow();
        room.updateLastChat(chat);
        roomRepository.save(room);
    }

    public RoomDto.Response getRoom(String roomId) {
        Room room = roomRepository.findById(UUID.fromString(roomId)).orElseThrow();
        return roomMapper.roomToResponse(room);
    }

    public MultiResponseDto updateRoomList(Long memberId) {
        PageRequest pageRequest = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "last_chatted"));
        Page<Room> roomPage = roomRepository.findByMemberId(memberId, pageRequest);
        List<Room> roomList = new ArrayList<>(roomPage.getContent());
        roomList.sort(Comparator.comparing(Room::getLastChatted, Comparator.nullsFirst(Comparator.reverseOrder())));
        return new MultiResponseDto(roomMapper.roomListToResponseList(roomList) ,roomPage);
    }
}
