FROM node:20-alpine
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/player-service/package.json ./package.json
RUN npm install
COPY packages/player-service/src/ ./src/
RUN echo '{"extends":"./tsconfig.base.json","compilerOptions":{"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npx tsc
EXPOSE 3002
CMD ["node", "dist/index.js"]
