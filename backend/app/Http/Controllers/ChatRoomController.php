<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Events\JoinRoom;


class ChatRoomController extends Controller
{
    function generate_room_id()
    {
        do {
            $code = Str::random(4);
            $exists = ChatRoom::where('room_id', $code)->exists();
        } while ($exists);
        return $code;
    }
    function create_room(Request $request)
    {
        $id = $this->generate_room_id();
        $member_uuid = Str::uuid();
        $room_members = [(string)$member_uuid => $request->user_name];
        $room_pass = hash("sha256", $request->password);
        $room_expiry = Carbon::now()->addDays(intval($request->duration))->toIso8601String();
        $room = new ChatRoom([
            "room_id" => $id,
            "members" => $room_members,
            "password" => $room_pass,
            "expires_at" => $room_expiry,
            "messages" => []
        ]);
        Log::info($room);
        $room->save();
        $response = [
            "status" => "success",
            "data" => [
                "room_id" => $id,
                "member_id" => $member_uuid
            ]
        ];
        return response()->json($response);
    }
    function get_room(Request $request)
    {
        if (!$request->has("room_id")) return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Room id is required"
            ]
        ]);

        $room = ChatRoom::where("room_id", $request->room_id)->first();
        if (!$room) return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Room does not exist"
            ]
        ], 404);
        else return response()->json([
            "status" => "success",
            "data" => $room
        ]);
    }
    function join_room(Request $request)
    {
        $member_uuid = Str::uuid();
        $room = ChatRoom::where("room_id", $request->room_id)->first();
        $members = $room->members;
        $members[(string)$member_uuid] = $request->user_name;
        $room->members = $members;
        $room->save();
        event(new JoinRoom($request->room_id, ["member_id" => $member_uuid, "user_name" => $request->user_name]));
        return response()->json([
            "status" => "success",
            "data" => [
                "member_id" => $member_uuid,
                "expires_at" => $room->expires_at
            ]
        ]);
    }
}
