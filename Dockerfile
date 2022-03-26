#FROM nginx as production
#
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#
#ARG PORT=80
#ENV PORT=${PORT}
#
#RUN rm -rf /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
#COPY dist /opt/ydfd
#
#WORKDIR /app
#
#COPY . .
#
#EXPOSE ${PORT}
#
#ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM node:16.14.2 AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
EXPOSE 9229

CMD ["yarn", "start:dev"]

FROM node:16.14.2 as production

ARG REACT_ENV=production
ARG PORT=3003
ENV REACT_ENV=${NODE_ENV}
ENV PORT=${PORT}

WORKDIR /app

COPY --from=development /app .

EXPOSE 3003

CMD ["yarn", "start:prod"]