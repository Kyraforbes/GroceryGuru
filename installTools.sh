#!/bin/bash

sudo apt update && sudo apt upgrade -y

sudo apt install -y nodejs npm

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

sudo apt install -y python3 python3-full

echo "Python3 version: $(python3 --version)"

sudo apt install -y python3-pip

echo "pip version: $(pip3 --version)"

echo "Installation completed successfully!"
