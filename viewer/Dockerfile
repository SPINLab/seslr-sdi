# build stage
FROM node:lts-alpine as build-stage

ARG SESLR_APP_MODE
ENV SESLR_APP_MODE $SESLR_APP_MODE

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN bash set_mode.sh
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
