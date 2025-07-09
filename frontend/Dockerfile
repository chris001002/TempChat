#Get the base image of node to build the app
FROM node:18-alpine AS builder
#Define the working directory
WORKDIR /app
#Copy the files and install
COPY package.json package-lock.json ./
RUN npm install
#Copy the source code
COPY . .
#Build the app
RUN npm run build

#Using the base image
FROM node:18-alpine
#Define the working directory
WORKDIR /app
#Copy the built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
#Install dependencies
RUN npm install --production
#Start the app
CMD ["npm", "start"]
