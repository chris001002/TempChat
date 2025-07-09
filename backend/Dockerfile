#Use FrankenPHP for better performance
FROM dunglas/frankenphp
#Make a working directory
WORKDIR /app
#Get the necessary software to setup
RUN apt-get update && apt-get install -y git unzip zip \
    libzip-dev build-essential libssl-dev && \
    docker-php-ext-install zip pcntl
#Install mongodb extension for php
RUN pecl install mongodb && docker-php-ext-enable mongodb
#Install composer
COPY --from=composer /usr/bin/composer /usr/bin/composer
#Copy the source code
COPY . .
#Install dependencies without confitmation
RUN composer install --no-interaction --prefer-dist --optimize-autoloader
#After it is configured, run the php commands
ENTRYPOINT ["./run.sh"]
