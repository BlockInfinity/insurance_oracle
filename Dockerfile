FROM ubuntu:xenial

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -q -y
RUN apt-get dist-upgrade -q -y

RUN apt-get install -y apt-utils
RUN apt-get install -y sudo


RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN apt-get install -y nodejs


ADD . /src/

WORKDIR /src
RUN npm install 
RUN npm install -g gulp

CMD nodejs oracle.js

# Start user in their source code directory...
WORKDIR /src

