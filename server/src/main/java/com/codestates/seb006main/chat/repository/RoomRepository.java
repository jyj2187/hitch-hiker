package com.codestates.seb006main.chat.repository;

import com.codestates.seb006main.chat.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    @Query(value = "select * from room where member_id=:memberId or other_id=:memberId",
            countQuery = "select count(*) from room where member_id=:memberId or other_id=:memberId"
            ,nativeQuery = true)
    Page<Room> findByMemberId(Long memberId, PageRequest pageRequest);

    @Query(value = "select * from room where member_id=:memberId and other_id=:otherId", nativeQuery = true)
    Optional<Room> findByBothId(Long memberId, Long otherId);
}
