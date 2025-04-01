#!/bin/bash

cd /home/ec2-user/portfolio

# Install dependencies
npm install

# Build the application
npm run build

# Start the application using PM2
pm2 stop portfolio || true
pm2 delete portfolio || true
pm2 start npm --name "portfolio" -- start
