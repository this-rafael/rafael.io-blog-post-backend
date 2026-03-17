#!/bin/sh
set -e

# Symlink Strapi uploads to the persistent /data volume
mkdir -p /data/uploads

if [ -d /app/public/uploads ] && [ ! -L /app/public/uploads ]; then
  rm -rf /app/public/uploads
fi

if [ ! -L /app/public/uploads ]; then
  ln -sf /data/uploads /app/public/uploads
fi

exec "$@"
