FROM node:latest

ENV ROOT_DIR=/usr/workspace
ENV WORK_DIR=$ROOT_DIR/linden-honey
ENV PORT=8080

# Create app directory
RUN mkdir -p $WORK_DIR

# Bundle app source
COPY . $WORK_DIR

# Set workdir and install dependencies
WORKDIR $WORK_DIR
RUN npm install

EXPOSE $PORT
CMD [ "npm", "run", "start" ]
