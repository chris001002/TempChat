<?php

namespace App\Models;

class Message
{
    private $sender;
    private $message;
    private $timestamp;
    public function __construct($sender, $message, $timestamp)
    {
        $this->sender = $sender;
        $this->message = $message;
        $this->timestamp = $timestamp;
    }
    //Getter setter for all attributes
    public function getSender()
    {
        return $this->sender;
    }
    public function getMessage()
    {
        return $this->message;
    }
    public function getTimestamp()
    {
        return $this->timestamp;
    }
    public function setSender($sender)
    {
        $this->sender = $sender;
    }
    public function setMessage($message)
    {
        $this->message = $message;
    }
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;
    }
    public function toArray()
    {
        return [
            'sender' => $this->sender,
            'message' => $this->message,
            'timestamp' => $this->timestamp
        ];
    }
}
