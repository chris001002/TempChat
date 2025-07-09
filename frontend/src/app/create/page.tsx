"use client";
import Navbar from "../components/navbar";
import {useRef, useState} from "react";
import Cookies from "js-cookie";
export default function Create() {
	const durationRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const alertRef = useRef<HTMLDivElement>(null);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const validateDays = () => {
		let rawValue = durationRef.current?.value || "0";
		let days = parseInt(rawValue, 10);
		if (isNaN(days) || days <= 0) {
			days = 1; // default fallback
			if (durationRef.current) durationRef.current.value = "1";
		} else if (days > 30) {
			days = 30;
			if (durationRef.current) durationRef.current.value = "30";
		}
	};
	const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		const data = {
			duration: durationRef.current?.value || "1",
			user_name: nameRef.current?.value || "Guest",
			password: passwordRef.current?.value || "password",
		};

		const res = await fetch("http://localhost:8000/api/create_room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		type Response = {
			status: string;
			data: {
				[key: string]: any;
			};
		};
		const responseData: Response = await res.json();

		if (responseData["status"] == "error") {
			setError(responseData["data"]["message"]);
			alertRef.current?.classList.remove("hidden");
			setTimeout(() => {
				alertRef.current?.classList.add("hidden");
				setIsSubmitting(false);
			}, 3000);
		} else {
			const member_id = responseData["data"]["member_id"];
			const room_id = responseData["data"]["room_id"];
			Cookies.set(room_id, member_id, {
				expires: new Date(Date.now() + parseInt(data.duration, 10) * 24 * 60 * 60 * 1000),
			});

			if (res.status == 200) {
				window.location.href = "/room/" + room_id;
			} else {
				alertRef.current?.classList.remove("hidden");
				setError("Failed to create room");
				setTimeout(() => {
					alertRef.current?.classList.add("hidden");
					setIsSubmitting(false);
				}, 3000);
			}
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
				<Navbar currentPage="Create Chat" />

				<div className="flex flex-col flex-grow justify-center items-center">
					<form className="inline-flex flex-col p-7 md:p-10 border-2 border-stone-400 dark:border-gray-600 border-solid rounded-2xl max-w-11/12" onSubmit={handleForm}>
						<h1 className="mb-2 font-bold text-4xl text-center">Create Chat</h1>
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
								<input type="text" required placeholder="John" id="username" ref={nameRef} />
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
							<label className="mt-4 font-bold md:text-lg label" htmlFor="days">
								Chat Expires in
							</label>
							<label className="input md:input-lg">
								<p className="opacity-50 focus:border-none">#</p>
								<input type="number" id="days" ref={durationRef} placeholder="Days" onKeyUp={(e) => validateDays()} defaultValue={1} required />
								<p className="opacity-50 focus:border-none">days</p>
							</label>
							<button className="bg-blue-600 mt-4 md:p-5 rounded-lg w-full text-white md:text-lg btn" type="submit" disabled={isSubmitting}>
								Create Chat
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
