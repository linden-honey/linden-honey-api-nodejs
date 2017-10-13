# Linden Honey

> RESTful Web Service powered by Koa.js

[![node version][node-image]][node-url]
[![build status][travis-image]][travis-url]
[![release][release-image]][release-url]
[![license][license-image]][license-url]

[node-image]: https://img.shields.io/badge/node-7.6.x-brightgreen.svg?style=flat-square
[node-url]: https://nodejs.org/en/download/
[release-image]: https://img.shields.io/github/release/linden-honey/linden-honey.svg?style=flat-square
[release-url]: https://github.com/linden-honey/linden-honey/releases
[downloads-image]: https://img.shields.io/github/downloads/linden-honey/linden-honey/latest/total.svg?style=flat-square
[downloads-url]: https://github.com/linden-honey/linden-honey/releases
[travis-image]: https://img.shields.io/travis/linden-honey/linden-honey/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/linden-honey/linden-honey
[license-image]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[license-url]: https://github.com/linden-honey/linden-honey/blob/master/LICENSE

REST API for the lyrics of __Yegor Letov__ and his post-punk/psychedelic rock band __Grazhdanskaya Oborona (Civil Defense)__

## Technologies

* [Yarn](https://yarnpkg.com/lang/en/)
* [Koa.js](https://koajs.com/)
* [MongoDB](https://docs.mongodb.com/)

## Usage

### Local

The following environment variables should be exported before running or you can create file `config/linden_honey.json` with the same structure:
* `LH_DB_URL`
* `LH_DB_MIGRATION_URL` //only for migrations

Start application:
```
yarn start
```

Start application in debug mode:
```
yarn debug
```

Run database migration script:
```
yarn migrate
```

### Docker

Bootstrap project using docker-compose:
```
docker-compose up
```

Stop and remove containers, networks, images, and volumes:
```
docker-compose down
```

## Application instance

[https://linden-honey.herokuapp.com](https://linden-honey.herokuapp.com)
