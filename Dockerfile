FROM node:11.10.0-alpine

ENV APP_PATH /api
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package.json $APP_PATH/

RUN npm set progress=false && \
    npm install -g pm2@3.3.1

EXPOSE 3000

CMD [ "pm2-runtime npm -- start" ]
