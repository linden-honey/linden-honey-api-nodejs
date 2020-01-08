# Linden Honey

> RESTful Web Service with lyrics powered by Express.js

[![node version][node-image]][node-url]
[![build status][ci-image]][ci-url]
[![release][release-image]][release-url]
[![license][license-image]][license-url]

[node-image]: https://img.shields.io/badge/node->=12-brightgreen.svg?style=flat-square
[node-url]: https://nodejs.org/en/download/
[release-image]: https://img.shields.io/github/release/linden-honey/linden-honey.svg?style=flat-square
[release-url]: https://github.com/linden-honey/linden-honey/releases
[ci-image]: https://img.shields.io/github/workflow/status/linden-honey/linden-honey/CI?style=flat-square
[ci-url]: https://github.com/linden-honey/linden-honey/actions
[license-image]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://github.com/linden-honey/linden-honey/blob/master/LICENSE

## Technologies

- [Node](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Mongodb](https://www.mongodb.com/)

## Usage

### Local

Run application:

```bash
npm run start
```

Run application in debug mode:

```bash
npm run debug
```

Run tests:

```bash
npm run test
```

### Docker

Bootstrap full project using docker-compose:

```bash
docker-compose up
```

Bootstrap project excluding some services using docker-compose:

```bash
docker-compose up --scale [SERVICE=0...]
```

Stop and remove containers, networks, images:

```bash
docker-compose down
```

## Application instance

[https://linden-honey.herokuapp.com](https://linden-honey.herokuapp.com)
