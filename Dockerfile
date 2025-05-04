FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY src/ ./src/

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV API_KEY=test-api-key

# Expose port
EXPOSE 8080

# Run the server
CMD ["node", "src/index.js"]
