import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import H1 from "../../components/ui/H1";
import styled from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";
const MyMatching = () => {
	const [myMatchingInfo, setMyMatchingInfo] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios(`${process.env.REACT_APP_URL}/api/members/matching`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setMyMatchingInfo(res.data.data);
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	}, []);

	const matchStatus = (status) => {
		if (status === "READ") return "읽음";
		if (status === "NOT_READ") return "안읽음";
		if (status === "ACCEPTED") return "수락";
		if (status === "REFUSED") return "거절";
	};

	return (
		<StyledDiv>
			<SideBar />
			<H1>매칭 신청한 게시글</H1>
			<div className="wrapper">
				{myMatchingInfo.map((el, idx) => (
					<div key={idx}>
						<h2
							onClick={() => {
								navigate(`/post/${el.postId}`);
							}}>
							{el.postTitle} {matchStatus(el.matchingStatus)}
						</h2>
					</div>
				))}
			</div>
		</StyledDiv>
	);
};

export default MyMatching;
const StyledDiv = styled.div`
	.wrapper {
		box-sizing: border-box;
		position: relative;
		display: inline-block;
		margin: 40px;
		padding: 20px;
		border: 1px solid black;
		border-radius: 5px;
		box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
		background: rgba(255, 255, 255, 0.6);
		font-family: Roboto;
		width: fit-content;
		height: fit-content;
	}
`;
