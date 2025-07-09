"use client";
import Navbar from "../components/navbar";
import {useRef, useState} from "react";
import Cookies from "js-cookie";
export default function Join() {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const roomRef = useRef<HTMLInputElement>(null);
	const alertRef = useRef<HTMLDivElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		if (Cookies.get(roomRef.current?.value || "") != undefined) {
			setError("Room already joined");
			alertRef.current?.classList.remove("hidden");
			setTimeout(() => {
				window.location.href = "/room/" + roomRef.current?.value;
			}, 3000);
		}

		const data = {
			user_name: usernameRef.current?.value || "Guest",
			password: passwordRef.current?.value || "password",
			room_id: roomRef.current?.value || "1",
		};

		const res = await fetch("http://localhost:8000/api/join_room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const responseData = await res.json();
		if (responseData["status"] == "error") {
			setError(responseData["data"]["message"]);
			alertRef.current?.classList.remove("hidden");
			setTimeout(() => {
				alertRef.current?.classList.add("hidden");
				setIsSubmitting(false);
			}, 3000);
		} else {
			Cookies.set(data.room_id, responseData["data"]["member_id"], {
				expires: new Date(responseData["data"]["expires_at"]),
			});
			window.location.href = "/room/" + data.room_id;
		}
	};
	return (
		<>
			<div role="alert" className="hidden top-5 left-1/2 z-50 absolute mx-auto w-[calc(100vw-2rem)] whitespace-pre-line -translate-x-1/2 alert alert-error" ref={alertRef}>
				<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{error}</span>
			</div>
			<div className="flex flex-col min-h-screen">
				<Navbar currentPage="Join Chat" />
				<div className="flex flex-col flex-grow justify-center items-center">
					<form className="inline-flex flex-col p-7 md:p-10 border-2 border-stone-400 dark:border-gray-600 border-solid rounded-2xl max-w-11/12" onSubmit={handleForm}>
						<h1 className="mb-2 font-bold text-4xl text-center">Join Chat</h1>
						<div className="flex flex-col">
							<label className="mt-4 font-bold md:text-lg label" htmlFor="username">
								Your Username
							</label>
							<label className="input md:input-lg">
								<svg className="opacity-50 h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
										<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</g>
								</svg>
								<input type="text" required placeholder="John" id="username" ref={usernameRef} />
							</label>
							<label className="mt-4 font-bold md:text-lg label" htmlFor="password">
								Room ID
							</label>
							<label className="input md:input-lg">
								<svg className="opacity-50 h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
										<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
										<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
									</g>
								</svg>
								<input type="text" required placeholder="AbCd" id="password" minLength={4} maxLength={4} ref={roomRef} />
							</label>
							<label className="mt-4 font-bold md:text-lg label" htmlFor="password">
								Room Password
							</label>
							<label className="input md:input-lg">
								<svg className="opacity-50 h-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
										<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
										<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
									</g>
								</svg>
								<input type="password" required placeholder="Password" id="password" ref={passwordRef} />
							</label>
							<button className="bg-blue-600 mt-4 md:p-5 rounded-lg w-full text-white md:text-lg btn" type="submit" disabled={isSubmitting}>
								Join Chat
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
