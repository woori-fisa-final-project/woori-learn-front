# -------- BUILD STAGE --------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# -------- RUN STAGE --------
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]

