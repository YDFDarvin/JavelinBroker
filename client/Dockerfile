FROM nginx as production

ARG PORT=80
ENV PORT=${PORT}

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY build /opt/bsc

EXPOSE ${PORT} ${PORT}

ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM node:16.13.0 as development

ARG REACT_ENV=development
ARG PORT=6543
ENV REACT_ENV=${NODE_ENV}
ENV PORT=${PORT}

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE ${PORT}

CMD PORT=$REACT_PORT yarn start

FROM node:16.13.0 as staging

ARG REACT_ENV=staging
ARG PORT=6541
ENV REACT_ENV=${NODE_ENV}
ENV PORT=${PORT}

WORKDIR /app

COPY --from=development /app .

RUN yarn build
RUN yarn global add serve

EXPOSE ${PORT}

CMD yarn prod ${PORT}