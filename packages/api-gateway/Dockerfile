FROM node:20-alpine
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/api-gateway/package.json ./package.json
RUN npm install
COPY packages/api-gateway/src/ ./src/
RUN echo '{"extends":"./tsconfig.base.json","compilerOptions":{"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npx tsc
EXPOSE 3000
CMD ["node", "dist/index.js"]
