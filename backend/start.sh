#!/bin/bash

# Start virtual display
Xvfb :1 -screen 0 1024x768x16 &
export DISPLAY=:1

# Wait for X server to initialize
sleep 3

# Start XFCE window manager
startxfce4 &

# Wait for XFCE to start
sleep 5

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

# Launch Chrome browser with the specified URL
google-chrome --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-software-rasterizer --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding --no-first-run --disable-default-apps --disable-extensions --disable-plugins --disable-translate --disable-default-apps --disable-background-networking --disable-sync --disable-web-security --user-data-dir=/tmp/chrome-data "$URL" &

# Keep container running
tail -f /dev/null