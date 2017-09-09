# Linden Honey

> RESTful Web Service powered by Koa.js

[![node version][node-image]][node-url]
[![build status][travis-image]][travis-url]
[![release][release-image]][release-url]
[![downloads][downloads-image]][release-url]
[![license][license-image]][license-url]

[node-image]: https://img.shields.io/badge/node-7.6.x-brightgreen.svg?style=flat-square
[node-url]: http://www.oracle.com/technetwork/node/nodese/downloads/index.html
[release-image]: https://img.shields.io/github/release/linden-honey/linden-honey.svg?style=flat-square
[release-url]: https://github.com/linden-honey/linden-honey/releases
[downloads-image]: https://img.shields.io/github/downloads/linden-honey/linden-honey-spring/latest/total.svg?style=flat-square
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

Start application:
```
yarn start
```

Start application in debug mode:
```
yarn debug
```

Run database migration script.  
The following environment variables should be exported before running:
* LH\_DB\_URL
* LH\_DB\_MIGRATION\_URL
```
yarn migrate
```


## Application instance

[https://linden-honey.herokuapp.com](https://linden-honey.herokuapp.com)
