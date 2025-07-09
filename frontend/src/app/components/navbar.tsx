export default function Navbar({currentPage}: {currentPage: string}) {
	let pages = [
		{
			name: "Home",
			link: "/",
		},
		{
			name: "Create Chat",
			link: "/create",
		},
		{
			name: "Join Chat",
			link: "/join",
		},
	];
	let navs = pages.map((page, index) => {
		return (
			<li key={index} className={page.name === currentPage ? "text-blue-600 dark:text-blue-400" : ""}>
				<a href={page.link}>{page.name}</a>
			</li>
		);
	});
	return (
		<div className="bg-base-100 shadow-sm navbar">
			<div className="navbar-start">
				<div className="dropdown">
					<div tabIndex={0} role="button" className="lg:hidden btn btn-ghost">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							{" "}
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />{" "}
						</svg>
					</div>
					<ul tabIndex={0} className="z-1 bg-base-100 shadow mt-3 p-2 rounded-box w-52 font-bold menu menu-sm dropdown-content">
						{navs}
					</ul>
				</div>
				<a className="text-xl btn btn-ghost">TempChat</a>
			</div>
			<div className="hidden lg:flex navbar-center">
				<ul className="px-1 font-bold menu menu-horizontal">{navs}</ul>
			</div>
			<div className="hidden sm:navbar-end"></div>
		</div>
	);
}
