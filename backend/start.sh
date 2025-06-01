#!/bin/bash

# Start virtual display
Xvfb :1 -screen 0 1920x1080x24 &
export DISPLAY=:1

# Wait for X server to initialize
sleep 3

# Start lightweight window manager (OpenBox instead of XFCE)
openbox &

# Wait for window manager to start
sleep 2

# Hide mouse cursor when inactive
unclutter -idle 3 -root &

# Start VNC server with better caching options
x11vnc -display :1 -nopw -forever -shared -ncache_cr &

# Wait for VNC to start
sleep 2

# Start noVNC server on port 6080 using websockify directly
websockify --web=/opt/novnc 6080 localhost:5900 &

# Wait for noVNC to be ready
sleep 3

# Get the URL from environment variable or use default
URL=${TARGET_URL:-"https://example.com"}

# Create a function to restart Chrome if it crashes
restart_chrome() {
    while true; do
        google-chrome \
            --no-sandbox \
            --disable-dev-shm-usage \
            --disable-gpu \
            --disable-software-rasterizer \
            --disable-background-timer-throttling \
            --disable-backgrounding-occluded-windows \
            --disable-renderer-backgrounding \
            --no-first-run \
            --disable-default-apps \
            --disable-extensions \
            --disable-plugins \
            --disable-translate \
            --disable-background-networking \
            --disable-sync \
            --disable-web-security \
            --user-data-dir=/tmp/chrome-data \
            --kiosk \
            --disable-pinch \
            --overscroll-history-navigation=0 \
            --disable-features=TranslateUI \
            --disable-ipc-flooding-protection \
            --disable-hang-monitor \
            --disable-prompt-on-repost \
            --disable-session-crashed-bubble \
            --disable-infobars \
            --disable-restore-session-state \
            --disable-background-mode \
            --no-default-browser-check \
            --disable-component-update \
            --app="$URL"
        
        echo "Chrome exited, restarting in 2 seconds..."
        sleep 2
    done
}

# Launch Chrome in kiosk mode with auto-restart
restart_chrome &

# Monitor and restart the display if needed
monitor_display() {
    while true; do
        if ! pgrep -f "Xvfb :1" > /dev/null; then
            echo "Xvfb crashed, restarting..."
            Xvfb :1 -screen 0 1920x1080x24 &
        fi
        sleep 10
    done
}

monitor_display &

# Keep container running
wait