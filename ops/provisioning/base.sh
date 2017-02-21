#!/bin/bash
#
# This is the base provisioning script - include apps which need installing and
# any configuration here. This script is used on production and development

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
        proxy_pass      http://127.0.0.1:3002/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
    }

}
EOF

service nginx restart



# Install packer for building the azure VM image
# mkdir -p /tmp/packer; cd /tmp/packer
# wget -q https://releases.hashicorp.com/packer/0.12.1/packer_0.12.1_linux_amd64.zip
# unzip packer_0.12.1_linux_amd64.zip
# mv packer /usr/local/bin/packer
# cd /
# rm -rf /tmp/packer



