import React from "react";
import styled, { css } from "styled-components";
import Participant from "./Participant";

const ParticipantsList = ({ open, close, participants, loadParticipants }) => {
	return (
		<div className={open ? "openParticipantsModal modal" : "modal"}>
			<ParticipantsListContainer>
				{open ? (
					<>
						<button className="closeButton" onClick={close}>
							닫기
						</button>
						{participants.map((el, idx) => (
							<Participant key={idx} participant={el} />
							// <Match key={idx}>
							// 	<span>
							// 		<div className="memberItem">
							// 			<img src={el.profileImage} alt={el.profileImage} />
							// 			<span className="memberName"> {el.displayName} </span>
							// 		</div>
							// 		<div>
							// 			{/* {memberId === String(detail.leaderId) &&
							// 			memberId !== String(el.memberId) ? (
							// 				<button
							// 					onClick={() => {
							// 						kickParticipant(el.memberPostId);
							// 					}}>
							// 					여행 추방
							// 				</button>
							// 			) : null}
							// 			{memberId === String(detail.leaderId) &&
							// 			memberId !== String(el.memberId) ? (
							// 				<button
							// 					onClick={() => {
							// 						kickParticipant(el.memberPostId);
							// 					}}>
							// 					참여 취소
							// 				</button>
							// 			) : null} */}
							// 		</div>
							// 		{/* <div>자기소개 : {el.content}</div> */}
							// 	</span>
							// </Match>
						))}
					</>
				) : null}
			</ParticipantsListContainer>
		</div>
	);
};

export default ParticipantsList;
const ParticipantsListContainer = styled.div`
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
