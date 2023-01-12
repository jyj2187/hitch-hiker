import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import styled from "styled-components";
// toast
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

// toast color syntax
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import { ErrorHandler } from "../../util/ErrorHandler";

const NewPost = () => {
	const navigate = useNavigate();

	const bodyRef = useRef();
	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [location, setLocation] = useState("");
	const [totalCount, setTotalCount] = useState(0);
	const [closeDate, setCloseDate] = useState("");

	// 기홍님의 잔재....
	// const [imageId, setImageId] = useState(0);
	// const [imageIds, setImageIds] = useState([]);
	// var mount = useRef(false);
	// useEffect(() => {
	//   if (mount.current) {
	//     addItemsToArray(imageId);
	//     mount.current = false;
	//   }
	// }, [addItemsToArray]);

	// function addItemsToArray(imageId) {
	//   setImageIds((imageIds) => [...imageIds, imageId]);
	// }
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const date = today.getDate() + 1;

	const submitHandler = () => {
		const enteredBody = bodyRef.current?.getInstance().getMarkdown();

		axios(`${process.env.REACT_APP_URL}/api/posts`, {
			method: "POST",
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
			data: {
				title: title,
				body: enteredBody,
				startDate: startDate,
				endDate: endDate,
				location: location,
				totalCount: totalCount,
				closeDate: closeDate,
			},
		})
			.then((res) => {
				if (res.headers.access_hh) {
					sessionStorage.setItem("AccessToken", res.headers.access_hh);
				}
				navigate(`/main`);
				window.location.reload();
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	return (
		<>
			<PageContainer>
				<Container>
					<form
						id="editorForm"
						onSubmit={(e) => {
							submitHandler();
							e.preventDefault();
						}}>
						<InputWrapper>
							<input
								id="title"
								type="text"
								required
								onChange={(e) => {
									setTitle(e.target.value);
								}}
								placeholder="제목을 입력해주세요."
							/>
							<div className="location">
								여행지
								<input
									id="location"
									type="text"
									required
									onChange={(e) => {
										setLocation(e.target.value);
									}}
								/>
							</div>
							<div className="tavelDate">
								<span className="startDate">
									여행 날짜
									<input
										className="date"
										type="date"
										required
										onChange={(e) => {
											setStartDate(e.target.value);
										}}
										placeholder={`${year}-${("0" + month).slice(-2)}-${date}`}
										min={`${year}-${("0" + month).slice(-2)}-${date}`}
									/>
									부터
								</span>
								<span className="endDate">
									<input
										className="date"
										type="date"
										required
										onChange={(e) => {
											setEndDate(e.target.value);
										}}
										placeholder={startDate}
										min={startDate}
									/>
									까지
								</span>
							</div>
							<div className="recruitInfo">
								<span className="closeDate">
									모집 마감
									<input
										className="date"
										type="date"
										required
										onChange={(e) => {
											setCloseDate(e.target.value);
										}}
										placeholder={`${year}-${("0" + month).slice(-2)}-${date}`}
										min={`${year}-${("0" + month).slice(-2)}-${date}`}
										max={startDate}
									/>
									까지
								</span>
								<span className="count">
									모집 인원(본인 포함)
									<input
										className="number"
										type="number"
										required
										min="2"
										max="20"
										onChange={(e) => {
											setTotalCount(e.target.value);

											if (e.target.value > 20) {
												e.target.value = 20;
												setTotalCount(20);
											}
										}}
										placeholder="최대 20명"
									/>
								</span>
							</div>
						</InputWrapper>
						<Editor
							placeholder="10글자 이상 작성해주세요."
							required
							ref={bodyRef}
							previewStyle="vertical" // 미리보기 스타일 지정
							height="540px" // 에디터 창 높이
							initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
							toolbarItems={[
								// 툴바 옵션 설정
								["heading", "bold", "italic", "strike"],
								["hr", "quote"],
								["ul", "ol", "task", "indent", "outdent"],
								["table", "image", "link"],
								["code", "codeblock"],
							]}
							hooks={{
								addImageBlobHook: (blob, callback) => {
									const formData = new FormData();
									formData.append("image", blob);
									axios(`${process.env.REACT_APP_URL}/api/images/upload`, {
										method: "POST",
										headers: {
											"Content-Type": "multipart/form-data",
											access_hh: sessionStorage.getItem("AccessToken"),
										},
										data: formData,
									})
										.then((res) => {
											// 기홍님의 잔재.....
											// let testid = res.data.imageId;
											// setImageId(testid);
											// mount.current = true;
											callback(res.data.imageUrl);
										})
										.catch((err) => {
											ErrorHandler(err);
										});
								},
							}}
							plugins={[colorSyntax]} // colorSyntax 플러그인 적용
						></Editor>
						<Button type="submit">작성 완료</Button>
						<Button
							onClick={() => {
								navigate(`/main`);
							}}>
							취소
						</Button>
					</form>
				</Container>
			</PageContainer>
		</>
	);
};

export default NewPost;
const PageContainer = styled.div`
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 87.72% !important;
	max-width: 1080px;
	height: fit-content;
	min-height: 1024px;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;

	font-family: Roboto;
	box-sizing: border-box;
`;
const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;

	#title {
		width: 20rem;
		font-size: 1.5rem;
		margin: 0;
		margin-right: 0.5rem;
		margin-bottom: 0.5rem;

		&:placeholder {
			color: rgba(0, 0, 0, 0.5);
		}
	}

	input {
		margin: 0.5rem;
		padding: 0.25rem;
		display: inline-block;
		border: none;
		outline: none;
		border-bottom: 1px solid black;

		&:focus {
			border-bottom: 2px solid black;
			transition: all ease 0s 0s;
		}
	}

	span {
		margin: 0 1rem 0 0;
	}

	.number {
		width: 5rem;
	}
`;
