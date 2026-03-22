FROM node:20-alpine
WORKDIR /app
COPY tsconfig.base.json ./
COPY packages/tenant-service/package.json ./package.json
RUN npm install
COPY packages/tenant-service/src/ ./src/
RUN echo '{"extends":"./tsconfig.base.json","compilerOptions":{"outDir":"dist","rootDir":"src"},"include":["src/**/*"]}' > tsconfig.json
RUN npx tsc
EXPOSE 3001
CMD ["node", "dist/index.js"]
