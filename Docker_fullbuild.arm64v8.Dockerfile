FROM node:16-alpine as build
WORKDIR /app
ADD . .
RUN npm install
RUN npm run build

FROM arm64v8/nginx:stable-alpine
EXPOSE 80
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/replace_port.sh /docker-entrypoint.d/replace_port.sh
#CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
