#*********** installation of packages ********************
# Base image for dependency installation
FROM node:18-alpine AS base

# Install OpenSSL and other necessary packages
RUN apk add --no-cache openssl

#RUN apk add --no-cache libc6-compat
# Install necessary packages (if needed)
WORKDIR /app
COPY prisma ./prisma/
# Copy package.json and install dependencies
COPY package.json package-lock.json ./  
RUN npm ci --force

# Build the application in a separate stage
FROM node:18-alpine AS builder

# Repeat ARG in builder stage
ARG ENV_NAME=dev
ARG NEXTAUTH_URL=localhost:3000
ARG NEXT_PUBLIC_API_URL=localhost:3000
ARG NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL=localhost:3000

# Set environment variables
ENV ENV_NAME_ENV=${ENV_NAME}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL=${NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL}

# Install OpenSSL (if needed in the build stage as well)
RUN apk add --no-cache openssl

#RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

# Copy node_modules and source files
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Build the application
RUN npm run build:${ENV_NAME}:deploy

# Clean up sensitive files
RUN rm -fv ./prisma/.env
RUN rm -fv ./.env.local

# Ensure proper permissions (if needed)
RUN chown node ./prisma
RUN chown node ./
# Command to launch server
USER node
# Expose the required port (default Next.js port is 3000)
# EXPOSE 3000
# Command to launch the app
CMD npm run start:${ENV_NAME_ENV}:deploy