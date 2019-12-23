FROM node:12-alpine

LABEL name="linden-honey" \
      maintainer="aliaksandr.babai@gmail.com"

ARG WORK_DIR=/linden-honey
WORKDIR $WORK_DIR

ENV SERVER_PORT=80

COPY package.json package-lock.json $WORK_DIR
RUN npm run i

COPY src ./src

EXPOSE $SERVER_PORT
CMD [ "npm", "start" ]
