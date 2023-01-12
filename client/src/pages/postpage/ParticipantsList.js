import React from "react";
import { useEffect } from "react";
import styled, { css } from "styled-components";
import Participant from "./Participant";

const ParticipantsList = ({
	open,
	close,
	participants,
	loadParticipants,
	post,
}) => {
	// 스크롤 방지
	useEffect(() => {
		document.body.style.cssText = `
          position: fixed; 
          top: -${window.scrollY}px;
          overflow-y: scroll;
          width: 100%;`;
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
		};
	}, []);

	return (
		<Modal>
			<div className={open ? "openParticipantsModal modal" : "modal"}>
				<ParticipantsListContainer>
					{open ? (
						<>
							<button className="closeButton" onClick={close}>
								닫기
							</button>
							{participants.map((el, idx) => (
								<Participant
									key={idx}
									participant={el}
									loadParticipants={loadParticipants}
									post={post}
								/>
							))}
						</>
					) : null}
				</ParticipantsListContainer>
			</div>
		</Modal>
	);
};

export default ParticipantsList;
const Modal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ParticipantsListContainer = styled.div`
	overflow: auto;
	width: 72% !important;
	max-width: 960px;
	min-height: 720px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 5px 0 5px;
	z-index: 999;

	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background-color: white;
	box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.5);

	.closeButton {
		margin-left: auto;
	}
`;
