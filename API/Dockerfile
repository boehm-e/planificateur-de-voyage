FROM node:12

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
  && apt-get install -y mysql-client \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

COPY . .

RUN rm -rf ./node_modules/* &&  npm install

CMD ["sh", "./scripts/start.sh"]
