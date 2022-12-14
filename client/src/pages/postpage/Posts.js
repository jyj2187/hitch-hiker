import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../../store/filter-slice";
import { pageActions } from "../../store/page-slice";
import { useNavigate } from "react-router-dom";

// 페이지네이션
import Pagination from "react-js-pagination";
import "./Paging.css";

const Posts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = useSelector((state) => state.search.title);
  const body = useSelector((state) => state.search.body);
  const location = useSelector((state) => state.search.location);
  const startDate = useSelector((state) => state.search.startDate);
  const endDate = useSelector((state) => state.search.endDate);
  const sort = useSelector((state) => state.filter.filterValue);
  const page = useSelector((state) => state.page.page);

  const [data, setData] = useState([]);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    axios(
      `${process.env.REACT_APP_URL}/api/posts?page=${page}&size=${size}&title=${title}&body=${body}&location=${location}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`,
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
        if (err.response.status === 400) {
          if (err.response.data.fieldErrors) {
            alert(err.response.data.fieldErrors[0].reason);
          } else if (
            err.response.data.fieldErrors === null &&
            err.response.data.violationErrors
          ) {
            alert(err.response.data.violationErrors[0].reason);
          } else {
            alert(
              "우리도 무슨 오류인지 모르겠어요... 새로고침하고 다시 시도해주세요.... 미안합니다.....ㅠ"
            );
          }
        } else if (err.response.status === 0)
          alert(
            "서버 오류로 인해 불러올 수 없습니다. 조금 뒤에 다시 시도해주세요"
          );
        else {
          if (
            err.response.data.korMessage ===
            "만료된 토큰입니다. 다시 로그인 해주세요."
          ) {
            sessionStorage.clear();
            navigate(`/`);
            window.location.reload();
          } else if (err.response.data.korMessage) {
            alert(err.response.data.korMessage);
          } else {
            alert(
              "우리도 무슨 오류인지 모르겠어요... 새로고침하고 다시 시도해주세요.... 미안합니다.....ㅠ"
            );
          }
        }
        window.location.reload();
      });
  }, [page, size, title, body, location, startDate, endDate, sort]);

  const handlePageChange = (page) => {
    dispatch(pageActions.setPage(page));
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
            }}
          >
            최신순(기본값)
          </button>
          <button
            className={
              sort === "startDate" ? "filterbtn focusbtn" : "filterbtn"
            }
            value="startDate"
            onClick={(e) => {
              dispatch(filterActions.setFilter(e.target.value));
            }}
          >
            여행 시작 날짜 순
          </button>
          <button
            className={sort === "endDate" ? "filterbtn focusbtn" : "filterbtn"}
            value="endDate"
            onClick={(e) => {
              dispatch(filterActions.setFilter(e.target.value));
            }}
          >
            여행 종료 날짜 순
          </button>
          <button
            className={
              sort === "closeDate" ? "filterbtn focusbtn" : "filterbtn"
            }
            value="closeDate"
            onClick={(e) => {
              dispatch(filterActions.setFilter(e.target.value));
            }}
          >
            모집 종료 날짜 순
          </button>
          <button
            className={
              sort === "totalCount" ? "filterbtn focusbtn" : "filterbtn"
            }
            value="totalCount"
            onClick={(e) => {
              dispatch(filterActions.setFilter(e.target.value));
            }}
          >
            모집 인원 순
          </button>
          <button
            className={sort === "limited" ? "filterbtn focusbtn" : "filterbtn"}
            value="limited"
            onClick={(e) => {
              dispatch(filterActions.setFilter(e.target.value));
            }}
          >
            남은 인원 순
          </button>
        </div>
        <div className="contents">
          {data.map((post) => (
            <div key={post.postId} className="post">
              <Post post={post} />
            </div>
          ))}
          <Pagination
            activePage={page}
            itemsCountPerPage={size}
            totalItemsCount={totalElements}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </StyledPost>
  );
};

export default Posts;
const StyledPost = styled.div`
  display: inline-block;
  .wrapper {
    flex-grow: 1;
    /* width: 750px; */

    width: max-content;
    min-height: 1000px;
    height: fit-content;
    margin-right: 20px;
    font-family: "Segoe UI", Roboto;
    background-color: #d5eaf1;
    border-radius: 10px;
    position: absolute;
    box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.3);
  }
  .contents {
    width: 1422px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      box-sizing: border-box;
      font-size: 1rem;

      line-height: 1.3rem;
      text-align: center;
      font-weight: 600;
      color: #666;
      margin-left: 30px;
      text-shadow: #666;
      letter-spacing: 1px;
    }
  }
  .post {
    display: flex, inline-flex;
    justify-content: center;
    margin: 1rem;
    padding: 10px;
    border-radius: 2px;
    outline: none;

    border-radius: 5px;
    border: 1.5px solid #a19f9f;
    background-color: white;
    font-size: large;
  }
  button {
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
    border-radius: 8px;
    margin: 5px;
  }
  .focusbtn {
    background-color: white;
  }
`;
