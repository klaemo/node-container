FROM klaemo/node-container-base

MAINTAINER Clemens Stolle clemens.stolle@gmail.com

RUN apt-get install -y nodejs
RUN adduser --disabled-login --disabled-password --gecos "" container

ADD ./ /home/container
RUN cd /home/container && npm install --production

WORKDIR /home/container
CMD ["mon", "npm start"]