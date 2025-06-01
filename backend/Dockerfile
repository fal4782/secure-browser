# Use Ubuntu base image
FROM ubuntu:20.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install dependencies
RUN apt-get update && apt-get install -y \
    xvfb \
    openbox \
    x11vnc \
    wget \
    curl \
    git \
    python3 \
    python3-pip \
    python3-numpy \
    python3-websockify \
    unclutter \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install noVNC
RUN git clone https://github.com/novnc/noVNC.git /opt/novnc
RUN git clone https://github.com/novnc/websockify /opt/novnc/utils/websockify

# Create openbox configuration directory
RUN mkdir -p /root/.config/openbox

# Create openbox configuration to disable window decorations
RUN echo '<?xml version="1.0" encoding="UTF-8"?>' > /root/.config/openbox/rc.xml && \
    echo '<openbox_config xmlns="http://openbox.org/3.4/rc">' >> /root/.config/openbox/rc.xml && \
    echo '  <theme>' >> /root/.config/openbox/rc.xml && \
    echo '    <name>Clearlooks</name>' >> /root/.config/openbox/rc.xml && \
    echo '    <titleLayout></titleLayout>' >> /root/.config/openbox/rc.xml && \
    echo '  </theme>' >> /root/.config/openbox/rc.xml && \
    echo '  <desktops>' >> /root/.config/openbox/rc.xml && \
    echo '    <number>1</number>' >> /root/.config/openbox/rc.xml && \
    echo '  </desktops>' >> /root/.config/openbox/rc.xml && \
    echo '</openbox_config>' >> /root/.config/openbox/rc.xml

# Create startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose VNC and noVNC ports
EXPOSE 5900 6080

# Start the services
CMD ["/start.sh"]