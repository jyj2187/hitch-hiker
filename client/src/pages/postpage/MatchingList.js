import React, { memo, useState } from "react";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import styled, { css } from "styled-components";
import Matching from "./Matching";

const MatchingList = memo(({ open, close, matchingList, loadMatching }) => {
	const [matchingId, setMatchingId] = useState("");
	const [matchingData, setMatchingData] = useState({});

	const loadMatchingData = (matchingId) => {
		setMatchingId(matchingId);
		loadMatching();
	};

	return (
		<div className={open ? "openMatchingModal modal" : "modal"}>
			<MatchingListContainer>
				{open ? (
					<>
						<button className="closeButton" onClick={close}>
							닫기
						</button>
						{matchingId && (
							<Matching
								matchingId={matchingId}
								setMatchingData={setMatchingData}
								matchingData={matchingData}
							/>
						)}
						{matchingList.length > 0 ? (
							matchingList.map((el, idx) => (
								<Match key={idx} status={el.matchingStatus}>
									<div
										className="memberItem"
										onClick={() => loadMatchingData(el.matchingId)}>
										<span>신청자 :</span>
										<img src={el.profileImage} alt={el.profileImage} />
										<span className="memberName"> {el.memberName} </span>
										<span className="matchingStatus">
											{el.matchingStatus === "READ" && <span>읽음</span>}
											{el.matchingStatus === "NOT_READ" && (
												<span>읽지 않음</span>
											)}
											{el.matchingStatus === "REFUSED" && <span>거절</span>}
											{el.matchingStatus === "ACCEPTED" && <span>수락</span>}
										</span>
									</div>
									{/* {memberId === String(el.memberId) ? (
										<div>
											<button
												onClick={() => {
													withdrawal(el.matchingId);
												}}>
												신청 취소
											</button>
											<button
												onClick={() => {
													chatHandler();
												}}>
												작성자와 대화하기
											</button>
										</div>
									) : null} */}
								</Match>
							))
						) : (
							<div>신청한 사람이 없습니다. 하하하하하하하하.</div>
						)}
					</>
				) : null}
				<Outlet />
			</MatchingListContainer>
		</div>
	);
});

export default MatchingList;
const MatchingListContainer = styled.div`
	width: 72% !important;
	max-width: 960px;
	min-height: 720px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 5px 0 5px;
	z-index: 999;

	position: absolute;
	top: 27.5%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.1);

	.closeButton {
		margin-bottom: auto;
		margin-left: auto;
	}
`;

const Match = styled.div`
	cursor: pointer;
	display: flex;
	margin: 0.5rem;

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

	.matchingStatus {
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.5);
	}

	${(props) =>
		props.status === "REFUSED" &&
		css`
			filter: grayscale(100%);
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
