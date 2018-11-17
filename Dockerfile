# creating a `build` directory:
from node:alpine as builder

run mkdir /app
workdir /app

env PATH /app/node_modules/.bin:$PATH

copy package*.json ./
run npm install

copy . .
run npm run build


# the production image itself:
from nginx:alpine

run rm /etc/nginx/conf.d/*
copy nginx-config/* /etc/nginx/conf.d/

copy --from=builder /app/build /srv
