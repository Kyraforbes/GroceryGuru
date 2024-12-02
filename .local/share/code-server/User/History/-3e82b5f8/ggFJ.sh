#!/bin/bash

# installing apps in ubuntu homedir.  Update as you see fit
cd /home/ubuntu;

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Check and clone the Django repository
REPO_DJANGO="django-example-fall-2024"
if [ -d "$REPO_DJANGO" ]; then
  echo "Django repository already exists. Skipping clone."
else
  echo "Cloning the Django repository..."
  git clone https://github.com/Manodiestra/django-example-fall-2024.git
fi
cd $REPO_DJANGO

# Step 2: Create and activate a virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Step 3: Install Django and required dependencies
echo "Installing Django and dependencies..."
pip install --upgrade pip
pip install django djangorestframework django-cors-headers

# Step 4: Make migrations and migrate
echo "Running migrations..."
python manage.py makemigrations registration
python manage.py makemigrations
python manage.py migrate

# Step 5: Run the Django server
echo "Starting Django server on 0.0.0.0:8000..."
python manage.py runserver 0.0.0.0:8000 &

# Save the Django server process ID
DJANGO_PID=$!

# Step 6: Navigate out of the Django project folder
cd ..

# Step 7: Check and clone the Expo repository
REPO_EXPO="expo-example-fall-2024"
if [ -d "$REPO_EXPO" ]; then
  echo "Expo repository already exists. Skipping clone."
else
  echo "Cloning the Expo repository..."
  git clone https://github.com/Manodiestra/expo-example-fall-2024.git
fi
cd $REPO_EXPO

# Step 8: Install Node modules
echo "Installing Node.js dependencies..."
npm install

# Django and Expo running on same host
# Setting IP env variables to be used when calling backend dj server, from expo
EXPO_PUBLIC_PRIVATE_IP=$(hostname -I | awk '{print $1}')
EXPO_PUBLIC_PUBLIC_IP=$(curl -s http://checkip.amazonaws.com/)

echo "EXPO_PUBLIC_PRIVATE_IP=$EXPO_PUBLIC_PRIVATE_IP" > .env
echo "EXPO_PUBLIC_PUBLIC_IP=$EXPO_PUBLIC_PUBLIC_IP" >> .env

# Step 9: Run the Expo app
echo "Starting Expo app on port 8081..."
npm start &

# Save the Expo server process ID
EXPO_PID=$!

# Function to stop servers on script exit
cleanup() {
  echo "Stopping servers..."
  kill $DJANGO_PID $EXPO_PID
}

# Register cleanup function to be called on script exit
trap cleanup EXIT

# Wait for servers to continue running
echo "Django and Expo servers are running. Press Ctrl+C to stop."
wait
