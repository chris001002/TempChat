<?php

namespace App\Http\Middleware;

use App\Models\ChatRoom;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;

class JoinRoomValidator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $request->validate([
                'user_name' => 'required|string',
                'password' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            $errorMessages = collect($e->errors())
                ->flatten()
                ->join("\n");
            return response()->json([
                "status" => "error",
                "data" => [
                    "message" => $errorMessages
                ]
            ], 422);
        }
        $room = ChatRoom::where("room_id", $request->room_id)->first();
        if (!$room) return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Room does not exist"
            ]
        ], 404);
        if ($room->password != hash("sha256", $request->password)) return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Incorrect password"
            ]
        ], 401);
        if (in_array($request->user_name, $room->members)) return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Username already in use in this room"
            ]
        ]);
        return $next($request);
    }
}
