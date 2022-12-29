package com.codestates.seb006main.chat.mapper;

import com.codestates.seb006main.chat.dto.RoomDto;
import com.codestates.seb006main.chat.entity.Room;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    RoomDto.Response roomToResponse(Room room);
    List<RoomDto.Response> roomListToResponseList(List<Room> roomList);
}
