<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\MessageSent;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\MessageController;
use App\Http\Middleware\ChatRoomValidator;
use App\Http\Middleware\JoinRoomValidator;
use Illuminate\Support\Facades\Broadcast;

Route::post("/create_room", [ChatRoomController::class, "create_room"])->middleware(ChatRoomValidator::class);
Route::post("/add_message", [MessageController::class, "add_message"]);
Route::post("/get_room", [ChatRoomController::class, "get_room"]);
Route::post("/join_room", [ChatRoomController::class, "join_room"])->middleware(JoinRoomValidator::class);
Broadcast::routes([
    'middleware' => [] // No auth middleware
]);
