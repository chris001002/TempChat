<?php

use App\Models\ChatRoom;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(function () {

    ChatRoom::where("expires_at", "<", Carbon::now()->toIso8601String())->delete();
    Log::info("Deleted expired rooms");
});
