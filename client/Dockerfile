
FROM node:18.19.1 AS build

# WORKDIR /app


# COPY package*.json ./


# RUN npm install

# COPY . .

# RUN npm run build -- --output-path=./dist/client


# FROM nginx:alpine

# COPY --from=build /app/dist/client /usr/share/nginx/html

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]
