import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";

const Matching = ({
	matchingId,
	setMatchingData,
	matchingData,
	loadMatching,
	loadParticipants,
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
				loadParticipants();
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
				<p>
					신청자 : <span className="memberName">{matchingData.memberName}</span>
				</p>
				<p>신청 내용 : </p>
				<div className="matchingBody">
					<MatchBody>{matchingData.body}</MatchBody>
				</div>
				<span className="actions">
					<button className="actionButton" onClick={acceptHandler}>
						수락
					</button>
					<button className="actionButton" onClick={refuseHandler}>
						거절
					</button>
					<button className="actionButton" onClick={askChatHandler}>
						대화요청
					</button>
					<button className="actionButton" onClick={goChatHandler}>
						대화하기
					</button>
				</span>
			</ContentWrap>
		</MatchingContainer>
	);
};

export default Matching;
const MatchingContainer = styled.div`
	margin: 1rem auto;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	width: 90% !important;
	max-width: 800px;
	box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.3);
`;
const ContentWrap = styled.div`
	margin: 0 auto;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	p {
		padding-bottom: 0.5rem;
		font-size: 1rem;
	}

	.memberName {
		font-size: 1.75rem;
		font-weight: 600;
	}

	.matchingBody {
		flex: 1;
		width: 100%;
		height: fit-content;
		font-size: 1.25rem;
		font-weight: 400;
	}

	.actions {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	// .actionButton {
	// 	margin: auto;
	// }
`;
const MatchBody = styled.div`
	width: 100%;
	height: fit-content;
`;
