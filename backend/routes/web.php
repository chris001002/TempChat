<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\ChatRoom;
use App\Models\Message;
use Illuminate\Support\Facades\Broadcast;

Route::get("/", function () {
    return view("welcome");
});
