import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { searchActions } from "../../store/search-slice";

const MainSubHeader = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const searchText = useSelector((state) => state.search.searchText);
	const startDate = useSelector((state) => state.search.startDate);
	const endDate = useSelector((state) => state.search.endDate);
	const [inputSearchText, setInputSearchText] = useState("");
	const [inputStartDate, setInputStartDate] = useState("");
	const [inputEndDate, setInputEndDate] = useState("");

	useEffect(() => {
		setInputSearchText(searchText);
		setInputStartDate(startDate);
		setInputEndDate(endDate);
	}, []);

	return (
		<SubHeader>
			<div className="date">
				<span>여행 시작 날짜</span>
				<span>
					<input
						type="date"
						value={inputStartDate}
						onChange={(e) => {
							setInputStartDate(e.target.value);
						}}></input>
				</span>
			</div>
			<div className="date">
				<span>여행 종료 날짜</span>
				<input
					type="date"
					value={inputEndDate}
					onChange={(e) => {
						setInputEndDate(e.target.value);
					}}></input>
			</div>
			<div className="search">
				<input
					className="inputtext"
					type="text"
					placeholder="제목, 본문, 여행지를 검색하세요"
					value={inputSearchText}
					onChange={(e) => {
						setInputSearchText(e.target.value);
					}}></input>
			</div>
			<div>
				<button
					onClick={() => {
						dispatch(searchActions.setSearchText(inputSearchText));
						dispatch(searchActions.setStartDate(inputStartDate));
						dispatch(searchActions.setEndDate(inputEndDate));
					}}>
					검색
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						dispatch(searchActions.setSearchText(""));
						dispatch(searchActions.setStartDate(""));
						dispatch(searchActions.setEndDate(""));
						setInputSearchText("");
						setInputStartDate("");
						setInputEndDate("");
					}}>
					초기화
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						navigate(`/new`);
					}}>
					새 글 작성
				</button>
			</div>
		</SubHeader>
	);
};

export default MainSubHeader;

const SubHeader = styled.div`
	margin: 0.5rem auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	width: 87.72% !important;
	max-width: 1080px;

	background-color: white;
	border-top: 0.1rem solid black;
	border-bottom: 0.1rem solid black;

	@media (min-width: 1025px) {
		div {
			width: calc(100% / 8);
		}
	}

	.search {
		display: flex;
		border-left: 1px solid rgba(0, 0, 0, 0.3);
		border-right: 1px solid rgba(0, 0, 0, 0.3);
		min-width: 120px;
		padding: 0.2rem;
		flex: 1;
	}

	.date {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	span {
		padding: 0.1rem;
		color: #777;
		font-weight: 700;
	}

	button {
		cursor: pointer;
		font-size: 1rem;
		background-color: #dabbc8;
		border: 1px solid #dabbc8;
		margin: 0.5rem;
		padding: 0.5rem 1rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
		color: #425049;
		&:hover {
			background-color: #efd5c8;
			border-color: #efd5c8;
		}
	}

	.inputtext {
		font-size: 1rem;
		width: 100%;
		border-radius: 6px;
		border-style: none;
	}
`;
