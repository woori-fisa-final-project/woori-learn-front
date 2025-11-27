# -------- BUILD STAGE --------
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# -------- RUN STAGE --------
FROM node:20-alpine AS runner
WORKDIR /app

# Only copy output & necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --production --legacy-peer-deps

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]

