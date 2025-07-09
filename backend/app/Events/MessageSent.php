<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcastNow
{
    use InteractsWithSockets;
    public $message;
    public $roomId;
    public function __construct($roomId, $message)
    {
        $this->roomId = $roomId;
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new Channel("room." . $this->roomId);
    }
    public function broadcastAs()
    {
        return 'message.sent';
    }
}
