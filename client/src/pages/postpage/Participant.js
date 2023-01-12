import axios from "axios";
import React from "react";
import styled, { css } from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";

const Participant = ({ participant, loadParticipants, post }) => {
	const memberId = sessionStorage.getItem("memberId");
	console.log(post.leaderId);
	console.log(participant.memberId);
	console.log(memberId);

	const kickParticipant = (memberPostId) => {
		axios(`${process.env.REACT_APP_URL}/api/participants/${memberPostId}`, {
			method: "DELETE",
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then(() => {
				loadParticipants();
			})
			.catch((err) => {
				ErrorHandler(err);
				window.location.reload();
			});
	};

	return (
		<Match>
			<img src={participant.profileImage} alt={participant.profileImage} />
			<div className="memberItem">
				<span className="memberName"> {participant.displayName} </span>
				<div className="aboutMe">자기소개 : {participant.content}</div>
			</div>
			{memberId === String(post.leaderId) &&
			memberId !== String(participant.memberId) ? (
				<button
					className="cancelButton"
					onClick={() => {
						kickParticipant(participant.memberPostId);
					}}>
					여행 추방
				</button>
			) : null}
			{memberId !== String(post.leaderId) &&
			memberId === String(participant.memberId) ? (
				<button
					className="cancelButton"
					onClick={() => {
						kickParticipant(participant.memberPostId);
					}}>
					참여 취소
				</button>
			) : null}
		</Match>
	);
};

export default Participant;
const Match = styled.div`
	display: flex;
	align-items: center;
	margin: 0.5rem auto;
	padding: 0.5rem;
	width: 100%;
	border-bottom: 1px solid rgba(0, 0, 0, 0.5);

	img {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		margin-right: 1rem;
	}

	.memberItem {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.memberName {
		font-size: 1.25rem;
	}

	.cancelButton {
		margin-left: auto;
	}
`;
