FROM node:20

WORKDIR /ui
ADD assets /ui/assets
ADD src /ui/src
COPY .babelrc /ui
COPY .eslintignore /ui
COPY .eslintrc.json /ui
COPY package.json /ui
COPY webpack.config.js /ui

RUN npm install
RUN npm run prod 
