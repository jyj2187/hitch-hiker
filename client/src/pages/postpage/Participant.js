import axios from "axios";
import React from "react";
import styled, { css } from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";

const Participant = ({ participant, loadParticipants, post }) => {
	const memberId = sessionStorage.getItem("memberId");
	const kickParticipant = (memberPostId) => {
		axios(`${process.env.REACT_APP_URL}/api/participants/${memberPostId}`, {
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
		<Match>
			<span>
				<div className="memberItem">
					<img src={participant.profileImage} alt={participant.profileImage} />
					<span className="memberName"> {participant.displayName} </span>
				</div>
				<div>
					{memberId === String(post.leaderId) &&
					memberId !== String(participant.memberId) ? (
						<button
							onClick={() => {
								kickParticipant(participant.memberPostId);
							}}>
							여행 추방
						</button>
					) : null}
					{memberId !== String(post.leaderId) &&
					memberId === String(participant.memberId) ? (
						<button
							onClick={() => {
								kickParticipant(participant.memberPostId);
							}}>
							참여 취소
						</button>
					) : null}
				</div>
				{/* <div>자기소개 : {el.content}</div> */}
			</span>
		</Match>
	);
};

export default Participant;
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
