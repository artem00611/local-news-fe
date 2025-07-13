# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Pass REACT_APP_API_URL into build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build static files
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck for EB
HEALTHCHECK CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
