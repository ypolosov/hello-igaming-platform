FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY ../../tsconfig.base.json ../../tsconfig.base.json
RUN npm install
COPY src/ ./src/
RUN npm run build
EXPOSE 3003
CMD ["node", "dist/index.js"]
