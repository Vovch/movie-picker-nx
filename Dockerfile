FROM node:18-bullseye-slim AS base
WORKDIR /workspace

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run postinstall --if-present

# Development image that runs both API and Angular dev servers via npm start.
FROM base AS development
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=1
CMD ["npm", "start", "--", "--host=0.0.0.0"]

# Build the applications
FROM base AS build
ENV NODE_ENV=production
RUN npm run build -- --configuration=production

# Production API image
FROM node:18-bullseye-slim AS api
WORKDIR /workspace
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /workspace/dist/apps/api ./dist/apps/api
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/apps/api/main.js"]

# Production frontend image
FROM nginx:1.27-alpine AS web
COPY nginx/docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/apps/movie-picker /usr/share/nginx/html
EXPOSE 80
