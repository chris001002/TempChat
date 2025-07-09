import Navbar from "./components/navbar";

export default function Home() {
	return (
		<div className="flex flex-col h-screen">
			<Navbar currentPage="Home" />
			<div className="flex flex-col flex-grow justify-center items-center gap-3 px-5 font-bold text-center">
				<h1 className="text-5xl">
					Welcome to <span className="text-blue-600 dark:text-blue-400">TempChat</span>
				</h1>
				<h2 className="text-2xl">You can start a new conversation or join an existing one!</h2>
				<div className="flex flex-row gap-3">
					<button>
						<a href="/create" className="bg-blue-600 rounded-lg text-white btn">
							Create Chat
						</a>
					</button>
					<button className="bg-green-700 rounded-lg btn">
						<a href="/join" className="text-white">
							Join Chat
						</a>
					</button>
				</div>
			</div>
		</div>
	);
}
