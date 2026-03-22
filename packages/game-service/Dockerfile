FROM node:20-alpine
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/game-service/package.json ./package.json
RUN npm install
COPY packages/game-service/src/ ./src/
RUN echo '{"extends":"./tsconfig.base.json","compilerOptions":{"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npx tsc
EXPOSE 3003
CMD ["node", "dist/index.js"]
