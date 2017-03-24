FROM node:alpine

WORKDIR /srv

COPY . /srv

RUN npm install --production

ENV MONGODB_URI=mongodb://mongo/nowhere \
    AMQP_URI=amqp://rabbitmq \
    MYSQL_USER=nowhere \
    MYSQL_PASS=nowhere \
    MYSQL_DB=nowhere

ENTRYPOINT ["npm", "start", "--production"]
