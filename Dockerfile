FROM node:18

# Tizim yangilanishi va yt-dlp ni o'rnatish
RUN apt-get update && apt-get install -y python3 curl ffmpeg && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# YouTube dekodlash xatosini (JS Runtime) tuzatish uchun muhit o'zgaruvchisi
ENV YTDLP_JS_RUNTIME=node

CMD ["npm", "run", "start:prod"]