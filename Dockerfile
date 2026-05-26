FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

RUN cd backend && npm install
RUN cd frontend && npm install --include=dev

COPY . .

RUN cd frontend && npm run build
RUN cd backend && npm run build

EXPOSE 3000

CMD ["node", "backend/dist/main"]
