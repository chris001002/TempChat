<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;

class ChatRoomValidator
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
                'duration' => 'required|integer|min:1|max:30',
            ]);
        } catch (ValidationException $e) {
            $errorMessages = collect($e->errors())
                ->flatten()
                ->join("\n");

            return response()->json([
                'status' => 'error',
                'data' => [
                    'message' => $errorMessages
                ]
            ], 422);
        }
        return $next($request);
    }
}
