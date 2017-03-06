FROM node:alpine

WORKDIR /srv

COPY . /srv

RUN apk add --no-cache supervisor \
 && npm install --production

ENV MONGODB_URI=mongodb://mongo/nowhere \
    AMQP_URI=amqp://rabbitmq \
    MYSQL_USER=nowhere \
    MYSQL_PASS=nowhere \
    MYSQL_DB=nowhere

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/srv/supervisord.conf"]
