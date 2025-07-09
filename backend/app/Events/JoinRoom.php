<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class JoinRoom implements ShouldBroadcastNow
{
    use InteractsWithSockets;
    public $member;
    public $roomId;
    public function __construct($roomId, $member)
    {
        $this->roomId = $roomId;
        $this->member = $member;
    }

    public function broadcastOn()
    {
        return new Channel("room." . $this->roomId);
    }
    public function broadcastAs()
    {
        return 'member.join';
    }
}
