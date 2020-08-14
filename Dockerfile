FROM node:10.16.3-alpine

RUN apk update && apk add \
  bash \
  curl \
  git \
  musl-dev

RUN addgroup -S user && adduser -S -g user user

ENV NODE_ENV production

WORKDIR /opt/authz-bundle-distributor/
RUN chown user:user .
USER user

RUN mkdir -p ./dist
ADD --chown=user:user .npmrc package.json yarn.lock ./

ARG NPM_TOKEN
RUN yarn install --ignore-scripts
ADD --chown=user:user . .

RUN yarn run build
ADD entrypoint.sh /

ENV PORT 8080
EXPOSE 8080

HEALTHCHECK --start-period=5s CMD curl --fail --max-time 1 http://localhost:8080/health

ENTRYPOINT ["/entrypoint.sh"]

CMD [ "node", "dist/src/index.js" ]

ENV NPM_TOKEN dummy
ARG IMAGE_BUILD_TIMESTAMP
ARG IMAGE_VERSION
ARG IMAGE_GIT_COMMIT_SHA

ENV IMAGE_BUILD_TIMESTAMP ${IMAGE_BUILD_TIMESTAMP}
ENV IMAGE_DEPLOY_TIMESTAMP ''
ENV IMAGE_VERSION ${IMAGE_VERSION}
ENV IMAGE_GIT_COMMIT_SHA ${IMAGE_GIT_COMMIT_SHA}

LABEL IMAGE_BUILD_TIMESTAMP ${IMAGE_BUILD_TIMESTAMP}
LABEL IMAGE_VERSION ${IMAGE_VERSION}
LABEL IMAGE_GIT_COMMIT_SHA ${IMAGE_GIT_COMMIT_SHA}
