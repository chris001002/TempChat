<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\Message;
use DateTime;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use Carbon\Carbon;

class MessageController extends Controller
{
    function add_message(Request $request)
    {
        $room_id = $request->room_id;
        $message = $request->message;
        $sender = $request->sender;

        $timestamp = Carbon::now()->toIso8601String();
        $message_obj = new Message($sender, $message, $timestamp);
        if ($request->message == "") return response()->json([
            "status" => "error",
            "data" => [
                "message" => "Message cannot be empty"
            ]
        ], 422);
        try {
            ChatRoom::where("room_id", $room_id)->push("messages", $message_obj->toArray());
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "data" => [
                    "message" => "Room does not exist"
                ]
            ]);
        }
        event(new MessageSent($room_id, $message_obj->toArray()));
        return response()->json([
            "status" => "success",
            "data" => [
                "message" => "Message sent"
            ]
        ]);
    }
}
