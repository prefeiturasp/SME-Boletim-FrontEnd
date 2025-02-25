#!/bin/sh

cd /usr/share/nginx/html/assets
files=$(ls)
for file in $files
do
  cp $file /tmp/$file
  rm $file
  envsubst '${VITE_API_URL},${VITE_BOLETIM_VERSAO},${VITE_SERAP_URL}' < /tmp/$file > $file
done

nginx -g 'daemon off;'
