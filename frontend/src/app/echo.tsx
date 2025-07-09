import Echo from "laravel-echo";
import Pusher from "pusher-js";
declare global {
	interface Window {
		Pusher: typeof Pusher;
	}
}
if (typeof window !== "undefined") {
	window.Pusher = Pusher;
}

const echo = new Echo({
	broadcaster: "reverb",
	key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
	wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
	wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080", 10),
	forceTLS: false,
	enabledTransports: ["ws"],
	authEndpoint: "http://localhost:8000/broadcasting/auth",
});

export default echo;
