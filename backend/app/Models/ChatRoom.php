<?php

namespace App\Models;


use MongoDB\Laravel\Eloquent\Model;

class ChatRoom extends Model
{
    protected $collection = 'chat_rooms';
    protected $fillable = [
        'room_id',
        'members',
        'password',
        'expires_at',
        'messages'
    ];
}
