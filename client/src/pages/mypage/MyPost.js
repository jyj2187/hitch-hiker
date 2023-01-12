import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import H1 from "../../components/ui/H1";
import styled from "styled-components";
import { ErrorHandler } from "../../util/ErrorHandler";
const MyPost = () => {
	const [myPost, setMypost] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios(`${process.env.REACT_APP_URL}/api/members/posts`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		})
			.then((res) => {
				setMypost(res.data.data);
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	}, []);
	return (
		<div>
			<SideBar />
			<H1>내가 쓴 게시글</H1>
			{myPost.map((el, idx) => (
				<StyledDiv key={idx}>
					<h2
						className="wrapper"
						onClick={() => {
							navigate(`/post/${el.postId}`);
						}}>
						{el.title} 모집인원 {el.participantsCount} / {el.totalCount}
					</h2>
				</StyledDiv>
			))}
		</div>
	);
};

export default MyPost;
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
