import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../../store/filter-slice";
import { pageActions } from "../../store/page-slice";
import { ScrollRestoration, useNavigate } from "react-router-dom";

// 페이지네이션
import Pagination from "react-js-pagination";
import "./Paging.css";
import { ErrorHandler } from "../../util/ErrorHandler";
import { searchActions } from "../../store/search-slice";

const Posts = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const searchText = useSelector((state) => state.search.searchText);
	const startDate = useSelector((state) => state.search.startDate);
	const endDate = useSelector((state) => state.search.endDate);
	const sort = useSelector((state) => state.filter.filterValue);
	const page = useSelector((state) => state.page.page);

	const [data, setData] = useState([]);
	const [size, setSize] = useState(12);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		axios(
			`${process.env.REACT_APP_URL}/api/posts?page=${page}&size=${size}&title=${searchText}&body=${searchText}&location=${searchText}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
			{
				headers: {
					access_hh: sessionStorage.getItem("AccessToken"),
				},
			}
		)
			.then((res) => {
				setData([...res.data.data]);
				setTotalElements(res.data.pageInfo.totalElements);
			})
			.catch((err) => {
				ErrorHandler(err);
				dispatch(searchActions.setSearchText(""));
				dispatch(searchActions.setStartDate(""));
				dispatch(searchActions.setEndDate(""));
				window.location.reload();
			});
	}, [page, size, searchText, startDate, endDate, sort]);

	const handlePageChange = (page) => {
		dispatch(pageActions.setPage(page));
		window.scrollTo(0, 0);
	};

	return (
		<StyledPost>
			<div className="wrapper">
				<div className="btnflex">
					<button
						className={sort === "newest" ? "filterbtn focusbtn" : "filterbtn"}
						value="newest"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						최신순
					</button>
					<button
						className={
							sort === "startDate" ? "filterbtn focusbtn" : "filterbtn"
						}
						value="startDate"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						여행 시작 날짜 순
					</button>
					<button
						className={sort === "endDate" ? "filterbtn focusbtn" : "filterbtn"}
						value="endDate"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						여행 종료 날짜 순
					</button>
					<button
						className={
							sort === "closeDate" ? "filterbtn focusbtn" : "filterbtn"
						}
						value="closeDate"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						모집 종료 날짜 순
					</button>
					<button
						className={
							sort === "totalCount" ? "filterbtn focusbtn" : "filterbtn"
						}
						value="totalCount"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						모집 인원 순
					</button>
					<button
						className={sort === "limited" ? "filterbtn focusbtn" : "filterbtn"}
						value="limited"
						onClick={(e) => {
							dispatch(filterActions.setFilter(e.target.value));
						}}>
						남은 인원 순
					</button>
				</div>
				<ul className="contents">
					{data.map((post) => (
						<li key={post.postId}>
							<Post post={post} />
						</li>
					))}
				</ul>
				<Pagination
					className="pagination"
					activePage={page}
					itemsCountPerPage={size}
					totalItemsCount={totalElements}
					pageRangeDisplayed={5}
					prevPageText={"‹"}
					nextPageText={"›"}
					onChange={handlePageChange}
				/>
			</div>
		</StyledPost>
	);
};

export default Posts;
const StyledPost = styled.div`
	margin: 1rem auto 1.5rem;
	width: 87.72% !important;
	max-width: 1080px;

	@media (min-width: 1200px) {
		max-width: 1080px;
		width: 87.72%;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		border: 0;
	}
	li {
		display: list-item;
		text-align: -webkit-match-parent;
		position: relative;
		width: 100%;
		padding: 0;
		margin: 0;
		border: 0;

		@media (min-width: 768px) and (max-width: 1024px) {
			width: calc(100% / 2);
		}

		@media (min-width: 1025px) {
			width: calc(100% / 3);
		}
	}
	.contents {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		margin-bottom: 3rem;
		list-style-type: none;
	}

	button {
		cursor: pointer;
		font-size: 1rem;
		background-color: #dabbc8;
		width: fit-content;
		border: 1px solid #dabbc8;
		padding: 0.5rem 1rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
		color: #425049;
		&:hover {
			background-color: #efd5c8;
			border-color: #efd5c8;
		}
	}
	.btnflex {
		display: flex;
		justify-content: space-between;
	}
	.filterbtn {
		flex-grow: 1/0;
		border-radius: 2rem;
		margin: 5px;
	}
	.focusbtn {
		background-color: white;
	}
	.pagination {
		padding: 1.5rem;
	}
`;
