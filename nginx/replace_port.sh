#!/bin/sh
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf
