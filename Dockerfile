FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# Install server-specific dependencies
WORKDIR /
RUN if [ -f package.json ]; then npm install --production; fi
WORKDIR /app

# Expose port
EXPOSE 3000

# Run the server
CMD ["npm", "run", "preview"]
