

# specify the node base image with your desired version node:<version>
FROM node:latest
# replace this with your application's default port

ADD . /src/

WORKDIR /src
RUN npm install 
RUN npm install -g gulp

CMD node ./processManager/processManager.js





