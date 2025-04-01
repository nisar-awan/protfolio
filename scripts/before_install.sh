#!/bin/bash

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Create directory if it doesn't exist
if [ ! -d "/home/ec2-user/portfolio" ]; then
    mkdir -p /home/ec2-user/portfolio
fi

# Clean the directory
rm -rf /home/ec2-user/portfolio/*
