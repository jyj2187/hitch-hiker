package com.codestates.seb006main.posts.mapper;

import com.codestates.seb006main.Image.mapper.ImageMapper;
import com.codestates.seb006main.matching.mapper.MatchingMapper;
import com.codestates.seb006main.posts.dto.PostsDto;
import com.codestates.seb006main.posts.entity.Posts;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {MemberPostsMapper.class, MatchingMapper.class})
public interface PostsMapper {
    @Mapping(target = "travelPeriod.startDate", source = "startDate")
    @Mapping(target = "travelPeriod.endDate", source = "endDate")
    Posts postDtoToPosts(PostsDto.Post postDto);
    Posts patchDtoToPosts(PostsDto.Patch patchDto);
    @Mapping(target = "participants", qualifiedByName = "memberPostsListToMemberParticipantsList")
    PostsDto.Response postsToResponseDto(Posts posts);
    List<PostsDto.Response> postsListToResponseDtoList(List<Posts> postsList);
}
