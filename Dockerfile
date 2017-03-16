FROM node:alpine

WORKDIR /srv

COPY package.json /srv

RUN npm install --production

COPY . /srv

ENV MONGODB_URI=mongodb://mongo/nowhere \
    AMQP_URI=amqp://rabbitmq \
    MYSQL_USER=nowhere \
    MYSQL_PASS=nowhere \
    MYSQL_DB=nowhere

# RUN apk add --no-cache supervisor

# ENTRYPOINT ["/usr/bin/supervisord", "-c", "/srv/supervisord.conf"]

ENTRYPOINT ["npm", "start", "--production"]
