# Build stage
FROM node:20-alpine AS build

# Set environment to development to ensure devDependencies are used for build
ENV NODE_ENV=development

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies for build)
# Using --include=dev to ensure vite and other build tools are installed
RUN npm install --include=dev

# Copy source code
COPY . .

# Build the application
RUN ./node_modules/.bin/vite build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config is a template: the nginx image runs envsubst on
# /etc/nginx/templates/*.template at start-up, writing conf.d/default.conf.
# Override at run time: docker run -e ODOO_TARGET=http://odoo:8069 ...
ENV ODOO_TARGET=http://41.78.157.36:8069
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
