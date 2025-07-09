export default function ChatBubble({children, right = false, date, sender}: {children: React.ReactNode; right?: boolean; date: string; sender: string}) {
	return (
		<>
			<div className={"chat " + (right ? "chat-end" : "chat-start")}>
				<div className="chat-image avatar">
					<div className="border border-solid rounded-full w-10">
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white">
							<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
							<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
							<g id="SVGRepo_iconCarrier">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 0 0 .09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 0 0 .091.317z"
								></path>
							</g>
						</svg>
					</div>
				</div>
				<div className="chat-header">
					{sender}
					<time className="opacity-50 text-xs">{date}</time>
				</div>
				<div className="chat-bubble">{children}</div>
			</div>
		</>
	);
}
