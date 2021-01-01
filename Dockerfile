FROM node:lts-alpine3.11 as build
WORKDIR /app
ADD . .
RUN yarn install
RUN yarn run build

FROM nginx:stable
EXPOSE 80
#COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
