# Stage 1: Build React App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_ADMIN_USERNAME=vijay
ARG VITE_ADMIN_PASSWORD=vijay@oil#2026

ENV VITE_ADMIN_USERNAME=${VITE_ADMIN_USERNAME}
ENV VITE_ADMIN_PASSWORD=${VITE_ADMIN_PASSWORD}

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
