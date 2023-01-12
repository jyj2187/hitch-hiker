import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";

const Matching = ({
	matchingId,
	setMatchingData,
	matchingData,
	loadMatching,
}) => {
	const navigate = useNavigate();

	// 매칭 데이터 가져오기
	useEffect(() => {
		axios(`${process.env.REACT_APP_URL}/api/matching/${matchingId}`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setMatchingData(res.data);
				loadMatching();
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	}, [matchingId]);

	// 채팅 요청 핸들러
	const askChatHandler = () => {
		axios(`${process.env.REACT_APP_URL}/api/chat/rooms`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
			method: "POST",
			data: {
				otherId: matchingData.memberId,
			},
		}).then(() => {
			alert("대화 요청을 전송하였습니다.");
			// window.location.reload();
		});
	};

	// 채팅방이 존재하는지 확인
	// 채팅방이 존재하면 채팅하기
	const goChatHandler = () => {
		axios(
			`${process.env.REACT_APP_URL}/api/chat/rooms/check?checkMemberId=${matchingData.memberId}`,
			{
				headers: {
					access_hh: sessionStorage.getItem("AccessToken"),
				},
			}
		)
			.then((res) => {
				if (res.data.roomId) {
					navigate(`/chat/${res.data.roomId}`);
				}
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	const acceptHandler = () => {
		axios(`${process.env.REACT_APP_URL}/api/matching/${matchingId}/accept`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then(() => {
				alert("요청을 수락하였습니다.");
				loadMatching();
			})
			.catch((err) => {
				ErrorHandler(err);
				window.location.reload();
			});
	};

	const refuseHandler = () => {
		axios(`${process.env.REACT_APP_URL}/api/matching/${matchingId}/refuse`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then(() => {
				alert("요청을 거절하였습니다.");
				loadMatching();
			})
			.catch((err) => {
				ErrorHandler(err);
				window.location.reload();
			});
	};

	return (
		<MatchingContainer>
			<ContentWrap>
				<p>매칭 게시글 :</p>
				<h1 className="title"> {matchingData.postTitle}</h1>
				<p>매칭 신청자 : </p>
				<div className="person">{matchingData.memberName}</div>
				<p>매칭 내용 :</p>
				<div className="contents"></div>
				<MatchBody>{matchingData.body}</MatchBody>
				<span>
					<Button
						onClick={() => {
							acceptHandler();
						}}>
						수락
					</Button>
					<Button
						onClick={() => {
							refuseHandler();
						}}>
						거절
					</Button>
					<Button
						onClick={() => {
							askChatHandler();
						}}>
						대화요청
					</Button>
					<Button
						onClick={() => {
							goChatHandler();
						}}>
						대화하기
					</Button>
				</span>
			</ContentWrap>
		</MatchingContainer>
	);
};

export default Matching;
const MatchingContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: #f5f5dc;
	box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	font-family: Roboto;
	box-sizing: border-box;
`;
const ContentWrap = styled.div`
	p {
		font-size: 1rem;
	}
	h1 {
		font-size: 2.6rem;
		font-weight: 700;
		color: #666;
	}
	.person {
		font-size: 2rem;
		color: #425049;
		font-weight: 600;
	}
	.contents {
		font-size: 1.5rem;
		color: #425049;
		font-weight: 400;
	}
`;
const MatchBody = styled.div`
	background-color: #d5eaf1;
	width: 70%;
	height: 30vh;
`;

const Button = styled.button`
	cursor: pointer;
	font-size: 1rem;
	background-color: #dabbc9;
	width: fit-content;
	border: 1px solid #dabbc9;
	padding: 0.5rem 1rem;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
	color: #425049;
	&:hover {
		background-color: #efd5c8;
		border-color: #efd5c8;
	}
`;
