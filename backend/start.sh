#!/bin/bash

# Get environment variables
URL=${TARGET_URL:-"https://example.com"}
USER_AGENT=${USER_AGENT:-"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36"}
IS_MOBILE=${IS_MOBILE:-"false"}
VIEWPORT_WIDTH=${VIEWPORT_WIDTH:-"1280"}
VIEWPORT_HEIGHT=${VIEWPORT_HEIGHT:-"720"}

echo "Starting VNC browser with:"
echo "URL: $URL"
echo "User Agent: $USER_AGENT"
echo "Mobile Mode: $IS_MOBILE"
echo "Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}"

# Set up display with appropriate resolution
if [ "$IS_MOBILE" = "true" ]; then
    # Mobile resolution
    DISPLAY_RESOLUTION="375x667x24"
    SCALE_RESOLUTION="375x667"
else
    # Desktop resolution
    DISPLAY_RESOLUTION="1280x720x24"
    SCALE_RESOLUTION="1280x720"
fi

# Start virtual display
Xvfb :1 -screen 0 $DISPLAY_RESOLUTION &
export DISPLAY=:1

# Wait for X server to initialize
sleep 3

# Start lightweight window manager
openbox &

# Wait for window manager to start
sleep 2

# Hide mouse cursor when inactive
unclutter -idle 3 -root &

# Start VNC server with appropriate scaling
x11vnc -display :1 -nopw -forever -shared -ncache_cr -scale $SCALE_RESOLUTION &

# Wait for VNC to start
sleep 2

# Start noVNC server on port 6080
websockify --web=/opt/novnc 6080 localhost:5900 &

# Wait for noVNC to be ready
sleep 3

# Restart Chrome if it crashes
restart_chrome() {
    while true; do
        # Base Chrome arguments
        chrome_args=(
            --no-sandbox
            --disable-dev-shm-usage
            --disable-gpu
            --disable-software-rasterizer
            --disable-background-timer-throttling
            --disable-backgrounding-occluded-windows
            --disable-renderer-backgrounding
            --no-first-run
            --disable-default-apps
            --disable-extensions
            --disable-plugins
            --disable-translate
            --disable-background-networking
            --disable-sync
            --disable-web-security
            --user-data-dir=/tmp/chrome-data
            --kiosk
            --disable-pinch
            --overscroll-history-navigation=0
            --disable-features=TranslateUI
            --disable-ipc-flooding-protection
            --disable-hang-monitor
            --disable-prompt-on-repost
            --disable-session-crashed-bubble
            --disable-infobars
            --disable-restore-session-state
            --disable-background-mode
            --no-default-browser-check
            --disable-component-update
            --user-agent="$USER_AGENT"
            --window-size=$VIEWPORT_WIDTH,$VIEWPORT_HEIGHT
        )

        # Add mobile-specific arguments
        if [ "$IS_MOBILE" = "true" ]; then
            chrome_args+=(
                --device-scale-factor=1
                --force-device-scale-factor=1
                --enable-features=OverlayScrollbar
                --touch-events=enabled
                --enable-pinch
                # --disable-features=VizDisplayCompositor
                # --enable-use-zoom-for-dsf=false
                # --disable-text-selection-on-touch
                # --disable-touch-drag-drop
                # --disable-touch-editing
                # --enable-smooth-scrolling
                # --enable-gesture-navigation
                # --disable-pull-to-refresh-effect
            )
        fi

        # Add the target URL
        chrome_args+=(--app="$URL")

        echo "Starting Chrome with mobile mode: $IS_MOBILE"
        google-chrome "${chrome_args[@]}"
        
        echo "Chrome exited, restarting in 2 seconds..."
        sleep 2
    done
}

# Launch Chrome with auto-restart
restart_chrome &

# Monitor and restart the display if needed
monitor_display() {
    while true; do
        if ! pgrep -f "Xvfb :1" > /dev/null; then
            echo "Xvfb crashed, restarting..."
            Xvfb :1 -screen 0 $DISPLAY_RESOLUTION &
        fi
        sleep 10
    done
}

monitor_display &

# Keep container running
wait