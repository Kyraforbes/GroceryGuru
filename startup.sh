#!/bin/bash

# Check if code-server is running using ps -ef | grep
if ps -ef | grep -v grep | grep code-server > /dev/null
then
    echo "VS Code Server is already running."
else
    echo "Starting VS Code Server..."
    code-server --bind-addr 0.0.0.0:8080 --cert ~/.config/code-server/selfsigned.crt --cert-key ~/.config/code-server/selfsigned.key /home/ubuntu > ~/code-server.log 2>&1 &
    echo "VS Code Server started."
fi
