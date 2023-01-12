import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";

// Toast-UI Viewer 임포트
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { ErrorHandler } from "../../util/ErrorHandler";
import MatchingList from "./MatchingList";
import ParticipantsList from "./ParticipantsList";

const PostDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const memberId = sessionStorage.getItem("memberId");

	const [detail, setDetail] = useState({});
	const [matching, setMatching] = useState([]);
	const [participants, setParticipants] = useState([]);
	const [matchBody, setMatchBody] = useState("");
	const [isbookmark, setIsBookmark] = useState(false);
	const [mybookmark, setMyBookmark] = useState([]);
	const [disabled, setDisabled] = useState(false);
	const [matchingOpen, setMatchingOpen] = useState(false);
	const [participantsOpen, setParticipantsOpen] = useState(false);

	const openMatchingModal = () => {
		setMatchingOpen(true);
	};

	const closeMatchingModal = () => {
		setMatchingOpen(false);
	};

	const openParticipantsModal = () => {
		setParticipantsOpen(true);
	};

	const closeParticipantsModal = () => {
		setParticipantsOpen(false);
	};

	useEffect(() => {
		setMatching([]);
		setParticipants([]);
		setDetail({});
		axios(`${process.env.REACT_APP_URL}/api/posts/${id}`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setDetail(res.data);
				if (
					res.data.postsStatus === "모집 마감" ||
					res.data.postsStatus === "모집 완료"
				) {
					setDisabled(true);
				} else {
					setDisabled(false);
				}
			})
			.catch((err) => {
				ErrorHandler(err);
				setTimeout(300);
				navigate(-1);
			});
	}, [id]);

	useEffect(() => {
		axios(`${process.env.REACT_APP_URL}/api/members/my-bookmark`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setMyBookmark(res.data.postIds);
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	}, [isbookmark]);

	useEffect(() => {
		// mybookmark.map((el) => (el === detail.postId ? setIsBookmark(true) : null));
		const bookmarked = mybookmark.includes(detail.postId) ? true : false;
		setIsBookmark(bookmarked);
	}, [mybookmark, detail.postId]);

	const loadParticipants = () => {
		axios(`${process.env.REACT_APP_URL}/api/posts/${id}/participants`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setParticipants(res.data.data);
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	//TODO: pagination 필요. 화살표 등으로 넘기면 다음 20개를 가져오도록 설정하기
	const loadMatching = () => {
		axios(`${process.env.REACT_APP_URL}/api/posts/${id}/matching`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setMatching(res.data.data);
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	const chatHandler = () => {
		axios(
			`${process.env.REACT_APP_URL}/api/chat/rooms/check?checkMemberId=${detail.leaderId}`,
			{
				headers: {
					access_hh: sessionStorage.getItem("AccessToken"),
				},
			}
		)
			.then((res) => {
				if (res.data.roomId) {
					navigate(`/chat/${res.data.roomId}`);
					return;
				}
			})
			.catch((err) => {
				ErrorHandler(err);
			});

		axios(`${process.env.REACT_APP_URL}/api/chat/rooms`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
			method: "POST",
			data: {
				otherId: detail.leaderId,
			},
		}).then((res) => {
			alert("대화 요청을 전송하였습니다. 대화방으로 이동합니다.");
			navigate(`/chat/${res.data.roomId}`);
			// window.location.reload();
		});
	};

	const bookmarkHandler = () => {
		setIsBookmark(!isbookmark);
		axios(
			`${process.env.REACT_APP_URL}/api/members/bookmark?postId=${detail.postId}`,
			{
				headers: {
					access_hh: sessionStorage.getItem("AccessToken"),
				},
			}
		).catch((err) => {
			ErrorHandler(err);
			window.location.reload();
		});
	};

	const deleteHandler = () => {
		axios(`${process.env.REACT_APP_URL}/api/posts/${id}`, {
			method: "DELETE",
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				if (res.headers.access_hh) {
					sessionStorage.setItem("AccessToken", res.headers.access_hh);
				}
				navigate(`/main`);
				window.location.reload();
			})
			.catch((err) => {
				ErrorHandler(err);
				window.location.reload();
			});
	};

	const matchSubmitHandler = () => {
		axios(`${process.env.REACT_APP_URL}/api/matching/posts/${id}`, {
			method: "POST",
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
			data: { body: matchBody },
		})
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	const withdrawal = (matchingId) => {
		axios(`${process.env.REACT_APP_URL}/api/matching/${matchingId}`, {
			method: "DELETE",
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				ErrorHandler(err);
				window.location.reload();
			});
	};

	return (
		<PageContainer isModalOpen={participantsOpen || matchingOpen}>
			<ContainerWrap>
				<div className="titleWrapper">
					<span className="title">{detail.title}</span>
					<span className="postsStatus">{detail.postsStatus}</span>
					<button
						className="heart"
						onClick={() => {
							bookmarkHandler();
						}}>
						{isbookmark ? "❤️" : "🤍"}
					</button>
					{memberId === String(detail.leaderId) ? (
						<div className="postButton">
							<button
								onClick={() => {
									navigate(`/edit/${id}`);
								}}>
								수정
							</button>
							<button
								onClick={() => {
									deleteHandler();
								}}>
								삭제
							</button>
						</div>
					) : null}
				</div>
				<div id="author" className="author">
					{" "}
					{detail.leaderName}
					{memberId !== String(detail.leaderId) ? (
						<button onClick={chatHandler}>대화 요청</button>
					) : null}
				</div>
				<Container>
					<MatchingContainer>
						<div className="participants">
							<div className="listInfo">
								<p className="listLabel">참여자 명단</p>
								<span className="count">{detail.participantsCount} 명</span>
							</div>
							{participants.length > 0 ? (
								<>
									<div className="scrollList">
										{participants.map((el, idx) => (
											<Match key={idx}>
												<span>
													<div className="memberItem">
														<img src={el.profileImage} alt={el.profileImage} />
														<span className="memberName">{el.displayName}</span>
													</div>
												</span>
											</Match>
										))}
									</div>
									<button
										className="manageButton"
										onClick={openParticipantsModal}>
										자세히 보기
									</button>
									{participantsOpen && (
										<ParticipantsList
											open={openParticipantsModal}
											close={closeParticipantsModal}
											participants={participants}
											loadParticipants={loadParticipants}
											post={detail}
										/>
									)}
								</>
							) : (
								<button className="loadData" onClick={loadParticipants}>
									보기
								</button>
							)}
						</div>
						<div className="applicants">
							<div className="listInfo">
								<p className="listLabel">매칭 신청자</p>
								<span className="count">{detail.matchingCount} 명</span>
							</div>
							{matching.length > 0 ? (
								<>
									<div className="scrollList">
										{matching.map((el, idx) => (
											<Match key={idx} status={el.matchingStatus}>
												<div className="memberItem">
													<img src={el.profileImage} alt={el.profileImage} />
													<span className="memberName"> {el.memberName} </span>
													<span className="matchingStatus">
														{el.matchingStatus === "READ" && <span>읽음</span>}
														{el.matchingStatus === "NOT_READ" && (
															<span>읽지 않음</span>
														)}
														{el.matchingStatus === "REFUSED" && (
															<span>거절</span>
														)}
														{el.matchingStatus === "ACCEPTED" && (
															<span>수락</span>
														)}
													</span>
												</div>
											</Match>
										))}
									</div>
									{memberId === String(detail.leaderId) && (
										<>
											<button
												className="manageButton"
												onClick={openMatchingModal}>
												매칭관리
											</button>
											{matchingOpen && (
												<MatchingList
													open={openMatchingModal}
													close={closeMatchingModal}
													matchingList={matching}
													loadMatching={loadMatching}
													loadParticipants={loadParticipants}
												/>
											)}
										</>
									)}
								</>
							) : (
								memberId === String(detail.leaderId) &&
								detail.matchingCount > 0 && (
									<button className="loadData" onClick={loadMatching}>
										보기
									</button>
								)
							)}
						</div>
					</MatchingContainer>
					<ContentContainer>
						<FlexContainer>
							<span className="flexbody">
								<span className="span-title">여행일정</span>
								<span className="span-content">
									{detail.startDate} 부터 {detail.endDate} 까지
								</span>
							</span>
							<span className="flexbody">
								<span className="span-title">여행지역</span>
								<span className="span-content">{detail.location}</span>
							</span>
							<span className="flexbody">
								<span className="span-title">매칭기간</span>
								<span className="span-content">{detail.closeDate} 까지</span>
							</span>
							<span className="flexbody">
								<span className="span-title"> 모집 인원</span>
								<span className="span-content">
									{detail.participantsCount} / {detail.totalCount}
								</span>
							</span>
						</FlexContainer>
						<BodyContainer>
							{/* <ReactMarkdown className="viewer">{detail.body}</ReactMarkdown> */}
							{detail.body && <Viewer initialValue={detail.body} />}
						</BodyContainer>
					</ContentContainer>
					<div className="application">
						{memberId !== String(detail.leaderId) ? (
							<Matchtext>
								<p>매칭 신청하기</p>
								<textarea
									placeholder={
										disabled
											? "이미 완료 / 마감된 모집입니다."
											: "10글자 이상 작성해주세요."
									}
									onChange={(e) => {
										setMatchBody(e.target.value);
									}}
									disabled={disabled}></textarea>
								<button
									onClick={() => {
										matchSubmitHandler();
									}}>
									매칭 신청
								</button>
							</Matchtext>
						) : null}
					</div>
				</Container>
			</ContainerWrap>
		</PageContainer>
	);
};

export default PostDetail;
const PageContainer = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const ContainerWrap = styled.div`
	overflow-y: auto;
	box-sizing: border-box;
	margin: 1rem auto;
	padding: 1rem;
	width: 87.72% !important;
	max-width: 1080px;
	height: fit-content;
	min-height: 1024px;
	background-color: rgba(255, 255, 255, 0.5);
	box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.1);
	border-radius: 8px;

	.titleWrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		.title {
			font-size: 2rem;
			font-weight: 500;
			color: #444;
		}

		.postsStatus {
			padding: 0.25rem;
			font-size: 1.25rem;
			font-weight: 300;
			color: rgba(0, 0, 138, 0.7);
		}

		.heart {
			border-radius: 50%;
			padding: 5px;
			background-color: white;
			width: 36px;
			height: 36px;
			font-size: 1rem;
			box-sizing: border-box;
		}

		.postButton {
			margin-left: auto;
		}
	}

	#author {
		margin: 0.5rem 0.2rem;
		color: darkblue;
		font-weight: 600;
		font-size: 1.3rem;
	}

	button {
		font-size: 1.25rem;
		background-color: #dabbc9;
		width: fit-content;
		border: 1px solid #dabbc9;
		padding: 5px 10px;
		margin: 0.5rem;
		min-width: fit-content;
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
		color: #425049;
		cursor: pointer;
		&:hover {
			background-color: #efd5c8;
			border-color: #efd5c8;
		}
	}

	@media screen and (max-width: 500px) {
		padding: 30px 25px 30px 25px;
		height: 455px;
	}
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	grid-gap: 0.5rem;
	gap: 0.5rem;
`;

const ContentContainer = styled.div`
	flex: 2;
	height: 100%;
`;

const FlexContainer = styled.div`
	width: 100%;
	margin: 0.5rem 0 0;
	display: flex;
	justify-content: space-between;

	.span-title {
		font-weight: 600;
		font-size: 1rem;
	}

	.span-content {
		color: darkblue;
		font-weight: 600;
		font-size: 1.125rem;
		text-align: center;
	}

	.flexbody {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 25%;
		border-right: 0.025rem solid rgba(0, 0, 0, 0.3);

		&:nth-child(4) {
			border: none;
		}
	}
`;

const BodyContainer = styled.div`
	border-top: 0.1rem solid black;
	width: 100%;
	overflow-x: auto;

	.toastui-editor-contents {
		padding: 0.625rem;
		min-height: 25rem;
	}

	.toastui-editor-contents p {
		font-size: 1rem;
		line-height: 120%;
	}
`;

const MatchingContainer = styled.div`
	display: flex;
	flex-direction: column;

	.listLabel {
		font-size: 1.25rem;
		border-bottom: 0.025rem solid rgba(0, 0, 0, 0.3);
		padding-bottom: 0.25rem;
		margin-right: 0.5rem;
	}

	button {
		margin-left: auto;
	}

	.loadData {
		margin-left: 1rem;
	}

	.participants {
		display: flex;
		align-items: center;
		height: 5rem;
	}

	.applicants {
		display: flex;
		align-items: center;
		height: 6rem;
	}

	.application {
		margin: 0.5rem 0;
	}

	.listInfo {
		display: flex;
		flex-direction: column;
		align-items: center;

		.count {
			padding-top: 0.5rem;
			text-align: center;
		}
	}

	.scrollList {
		display: flex;
		overflow-x: auto;
	}
`;

const Match = styled.div`
	display: flex;
	margin: 0.5rem;

	button {
		margin-left: 5px;
		margin-right: 5px;
	}

	img {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
	}

	.memberItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 5rem;
	}

	.manageButton {
		padding: 1rem;
		width: fit-content;
	}

	.matchingStatus {
		margin-top: auto;
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.5);
	}

	${(props) =>
		props.status === "REFUSED" &&
		css`
			img {
				border: 1px solid red;
				// TODO: filter 추가하면 z-index가 앞으로 튀어나온다. 배경 투명도를 조절 한 뒤 뒤로 보내서 눈속임 처리
				// filter: grayscale(50%);
				position: relative;
				z-index: -1;
			}

			.matchingStatus {
				color: red;
			}
		`}

	${(props) =>
		props.status === "ACCEPTED" &&
		css`
			img {
				border: 1px solid green;
			}

			.matchingStatus {
				color: green;
			}
		`}
`;

const Matchtext = styled.div`
	display: flex;
	flex-direction: column;
	padding-top: 1rem;
	border-top: 1px solid black;
	textarea {
		flex-grow: 1;
		font-size: 1rem;
		height: 200px;
		resize: none;
		border: none;
	}
`;
