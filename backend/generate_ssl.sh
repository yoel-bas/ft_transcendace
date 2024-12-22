#!/bin/bash

path=/usr/share/elasticsearch/ssl

mkdir -p $path/private
mkdir -p $path/certs
openssl req -x509 -newkey rsa:4096 -keyout $path/private/certificate.key -out $path/certs/certificate.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Company/CN=localhost"