FROM node:14
#RUN apk add --no-cache python g++ make
RUN npm install -g pm2
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
#CMD npm run dev
CMD ls -la .
CMD pm2 start --no-daemon ecosystem.config.js
#CMD ["pm2", "start", "/app/src/ecosystem.config.js"]