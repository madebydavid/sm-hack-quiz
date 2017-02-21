#!/bin/bash


# general
apt-get update --fix-missing

apt-get install -y build-essential
apt-get install -y curl
apt-get install -y wget
apt-get install -y unzip
apt-get install -y git
apt-get install -y vim

# bash config
cat > /etc/profile.d/00-aliases.sh <<EOT
alias ll='ls -l'
EOT

# node
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
apt-get install -y nodejs

apt-get install -y nginx
cat << EOF > /etc/nginx/sites-available/default
server {

    listen 80 default_server;
    
    root /vagrant/app;
    index index.html;
    
    server_name localhost;

    location ~ ^/(api)/? {
        proxy_pass http://127.0.0.1:3002;
        proxy_redirect off;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3002/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }

}
EOF

service nginx restart