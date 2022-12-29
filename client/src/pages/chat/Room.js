import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Room = ({ room }) => {
	const navigate = useNavigate();
	return (
		<RoomStyle>
			<RoomContainer onClick={() => navigate(`/chat/${room.roomId}`)}>
				<span className="roomName">{room.name}</span>
				<div className="lastChatSection">
					<span className="lastChat">{room.lastChat}</span>
					<span className="lastChatTime">{room.lastChatted}</span>
				</div>
			</RoomContainer>
		</RoomStyle>
	);
};

export default Room;

const RoomStyle = styled.div`
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 0.5rem;
	padding: 0.5rem;
	border-bottom: 1px solid black;
`;

const RoomContainer = styled.div`
	display: flex;
	flex-direction: column;

	.roomName {
		font-size: 1.375rem;
		font-weight: 600;
	}

	.lastChatSection {
		display: flex;
		align-items: center;
		padding-top: 0.5rem;
		color: rgba(0, 0, 0, 0.5);

		.lastChat {
			font-size: 1.25rem;
		}

		.lastChatTime {
			margin-left: auto;
			font-size: 0.75rem;
		}
	}
`;
