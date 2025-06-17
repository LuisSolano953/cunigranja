FROM node:18 AS build
WORKDIR /app

<<<<<<< HEAD
COPY . .
=======
COPY .
>>>>>>> 02a57c2f7455f698a89d13c4364219ea6e6c4b41
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]