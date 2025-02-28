#!/bin/sh

echo "VITE_API_URL=${VITE_API_URL}"
echo "VITE_BOLETIM_VERSAO=${VITE_BOLETIM_VERSAO}"
echo "VITE_SERAP_URL=${VITE_SERAP_URL}"

cd /usr/share/nginx/html/assets
for file in $(ls); do
  cp "$file" "/tmp/$file"
  envsubst < "/tmp/$file" > "$file"
  rm "/tmp/$file"
done

nginx -g 'daemon off;'
