#!/bin/sh
#Change to project directory
cd /app
#Optimize cache
frankenphp php-cli artisan optimize
#Run migrations
frankenphp php-cli artisan migrate
#Run scheduler on background
frankenphp php-cli artisan schedule:work &
#Run reverb (websocket) on background
frankenphp php-cli artisan reverb:start &
#Run frankenphp, use host 0.0.0.0 to make it available from outside
php artisan octane:frankenphp --host=0.0.0.0 --port=8000
