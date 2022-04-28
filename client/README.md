### Env

- Node 16.13.0
- npm 8.1.0
- yarn 1.22.17

### Preparation

- install packages `yarn install`
- install `serve` package for prod build: `yarn global add serve`
- create `env` files with listed fields of `.env.example`:
    - `.env.development` for development
    - `.env.production` for production

### How to Test

- run tests `yarn test`

### How to Dev

- run in watch mode React server `yarn start`

### How to Build

- build application `yarn build`

### How to Build & Run

- build application `yarn build`
- start app `serve -s build -l <PORT>`

### How to Lint

- search & lint code `yarn lint`
- lint & fix code `yarn lint --fix`
