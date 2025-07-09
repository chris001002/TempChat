"use client";

import {redirect, useParams} from "next/navigation";
import Cookies from "js-cookie";
import {useEffect, useState, useRef} from "react";
import Navbar from "@/app/components/navbar";
import ChatBubble from "@/app/components/chatBubble";
import echo from "@/app/echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
	window.Pusher = Pusher;
}
export default function Room() {
	const {room_id} = useParams();
	const [room, setRoom] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const alertRef = useRef<HTMLDivElement>(null);
	const controller = new AbortController();
	const clipboardAlert = useRef<HTMLDivElement>(null);
	const messageRef = useRef<HTMLInputElement>(null);
	const myMemberid = Cookies.get(room_id!.toString());
	const roomRef = useRef<any>(null);
	async function fetchRoom() {
		try {
			let res;
			try {
				res = await fetch("http://localhost:8000/api/get_room", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({room_id: room_id}),
				});
			} catch (err) {
				setError("An error occurred");
				alertRef.current?.classList.remove("hidden");
				setTimeout(() => {
					redirect("/create");
				}, 3000);
				return;
			}

			if (!res!.ok) {
				setError("Room not found in database");
				alertRef.current?.classList.remove("hidden");
				setTimeout(() => {
					redirect("/create");
				}, 3000);
				return;
			}
			let data = await res.json();
			data = data.data;
			let members = data.members;
			let members_id = Object.keys(members);
			const user_id = Cookies.get(room_id!.toString());
			if (members_id.includes(user_id!)) {
				setRoom(data);
			}
		} catch (err) {
			setError("An error occurred");
			setTimeout(() => {
				redirect("/create");
			}, 3000);
		}
	}
	async function handleClipboard() {
		await navigator.clipboard.writeText(room_id!.toString());
		clipboardAlert.current?.classList.remove("hidden");
		setTimeout(() => {
			clipboardAlert.current?.classList.add("hidden");
		}, 3000);
	}
	async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (messageRef.current?.value == "") return;
		const message = messageRef.current?.value;
		messageRef.current!.value = "";
		const res = await fetch("http://localhost:8000/api/add_message", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({room_id: room_id, message: message, sender: myMemberid}),
		});
		if (!res.ok) {
			setError("An error occurred");
			alertRef.current?.classList.remove("hidden");
			return;
		}
	}
	useEffect(() => {
		if (!room_id) {
			setError("Room ID not found");
			alertRef.current?.classList.remove("hidden");
			setTimeout(() => {
				redirect("/join");
			}, 3000);
			return;
		}
		if (Cookies.get(room_id!.toString()) == undefined) {
			setError("You are not in the room");
			alertRef.current?.classList.remove("hidden");
			setTimeout(() => {
				redirect("/join");
			}, 3000);
			return;
		}
		fetchRoom();
		const channel = echo.channel("room." + room_id);

		channel.listen(".message.sent", (e: any) => {
			let currentRoom = roomRef.current;
			if (currentRoom == null) return;
			const newRoom = {
				...currentRoom,
				messages: [...currentRoom.messages, e.message],
			};
			setRoom(newRoom);
		});
		channel.listen(".member.join", (e: any) => {
			let currentRoom = roomRef.current;
			if (currentRoom == null) return;
			const newRoom = {
				...currentRoom,
				members: {...currentRoom.members, [e.member.member_id]: e.member.user_name},
			};
			setRoom(newRoom);
		});
	}, []);
	useEffect(() => {
		roomRef.current = room;
	}, [room]);

	return (
		<>
			<div role="alert" className="hidden top-5 left-1/2 z-50 absolute mx-auto w-[calc(100vw-2rem)] whitespace-pre-line -translate-x-1/2 alert alert-error" ref={alertRef}>
				<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
			<div role="alert" className="hidden top-5 left-1/2 z-50 absolute mx-auto w-[calc(100vw-2rem)] whitespace-pre-line -translate-x-1/2 alert alert-success" ref={clipboardAlert}>
				<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>Room ID copied to clipboard</span>
			</div>
			<div className="flex flex-col md:h-screen min-h-screen">
				<Navbar currentPage="None" />
				<div className="flex md:flex-row flex-col overflow-hidden grow">
					<aside className="flex flex-row justify-center order-2 md:order-1 p-4 w-full md:w-3/12 md:h-full">
						<div className="collapse collapse-arrow bg-base-100 border border-base-300 w-3/4 h-fit max-h-full">
							<input type="checkbox" />
							<div className="collapse-title font-semibold">Members</div>
							<div className="collapse-content h-fit max-h-full text-sm">
								<ul className="flex flex-col bg-base-100 w-full max-h-[70vh] overflow-y-auto font-bold">
									{room != null
										? Object.values(room.members).map((member: any, index) => {
												return (
													<li key={index} className="m-2">
														{member}
													</li>
												);
										  })
										: ""}
								</ul>
							</div>
						</div>
					</aside>
					<main className="flex flex-col order-3 md:order-2 p-5 border-base-300 border-l w-full md:w-6/12 h-[60vh] md:h-full max-h-screen overflow-y-auto">
						<h1 className="mb-3 font-bold text-3xl text-center">Chat</h1>
						<div className="bg-base-100 p-5 rounded-t-2xl overflow-y-auto grow">
							{room != null
								? room.messages.map((message: any, index: number) => {
										const formattedDate = new Date(message.timestamp).toLocaleString("en-GB", {day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false});

										return (
											<ChatBubble key={index} right={message.sender == myMemberid} date={formattedDate} sender={room.members[message.sender]}>
												{message.message}
											</ChatBubble>
										);
								  })
								: ""}
						</div>
						<form className="flex bg-base-100 p-5 rounded-b-2xl w-full" onSubmit={sendMessage}>
							<input type="text" placeholder="Type here" className="rounded-full input grow" ref={messageRef} />
							<button className="ml-2 btn btn-success btn-circle">
								<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
									<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
									<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
									<g id="SVGRepo_iconCarrier">
										<path
											d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
											stroke="#FFFFFF"
											strokeWidth="3"
											strokeLinecap="round"
											strokeLinejoin="round"
										></path>
									</g>
								</svg>
							</button>
						</form>
					</main>
					<aside className="flex flex-col gap-3 order-1 md:order-3 p-4 w-full md:w-3/12 md:grow">
						<div className="flex flex-row items-center gap-3 h-fit">
							<h1 className="w-fit font-bold">Room ID:</h1>
							<div className="flex justify-center items-center gap-2 bg-base-200 p-2 border rounded-md w-fit h-fit">
								<span className="font-medium text-sm">{room_id}</span>
								<button className="p-1 border-white border-l-2 hover:cursor-pointer" title="Copy" onClick={handleClipboard}>
									<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-black dark:stroke-white w-4 h-4">
										<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
										<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
										<g id="SVGRepo_iconCarrier">
											<path
												d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M15 12H12M15 16H12M9 12H9.01M9 16H9.01"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
										</g>
									</svg>
								</button>
							</div>
						</div>
						<h1>
							Expired at:{" "}
							{room != null
								? new Date(room.expires_at).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "long",
										year: "numeric",
								  })
								: ""}
						</h1>
					</aside>
				</div>
			</div>
		</>
	);
}
