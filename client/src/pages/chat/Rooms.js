import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import { parse } from "query-string";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import styled from "styled-components";
import SideBar from "../../components/SideBar";
import H1 from "../../components/ui/H1";
import Room from "./Room";

const Rooms = () => {
	const client = useRef();
	const memberId = sessionStorage.getItem("memberId");

	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		axios(`${process.env.REACT_APP_URL}/api/chat/rooms`, {
			headers: {
				access_hh: sessionStorage.getItem("AccessToken"),
			},
		}).then((res) => {
			setRooms(res.data.data);
		});
		connect();

		return () => disconnect();
	}, []);

	const connect = () => {
		const socket = new SockJS(`${process.env.REACT_APP_URL}/stomp/chat`);
		client.current = Stomp.over(socket);
		client.current.debug = null;
		client.current.connect(
			{
				access_hh: sessionStorage.getItem("AccessToken"),
			},
			() => {
				client.current.subscribe(
					"/sub/" + memberId + "/rooms",
					(updatedRoom) => {
						setRooms(JSON.parse(updatedRoom.body).data);
					}
				);
			}
		);
	};

	const disconnect = () => {
		client.current.disconnect();
	};

	return (
		<>
			<SideBar />
			<H1>참여 중인 대화</H1>
			<SRooms>
				<div className="roomList">
					<ul className="rooms">
						{rooms &&
							rooms.map((room) => (
								<li key={room.roomId}>
									<Room room={room} />
								</li>
							))}
					</ul>
				</div>
			</SRooms>
		</>
	);
};

export default Rooms;
const SRooms = styled.div``;
