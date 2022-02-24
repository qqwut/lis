# CCSM Front End Site.

- [Installation](#installation)

## Installation

Dev environments...

```sh
$ cd sourcecode/CCSM-FE
$ npm install
$ npm install -g gulp-cli
$ gulp default
$ npm run watch-ts
$ node index
```

Production environments...

** Set environment please edit in package.json NODE_ENV=$[your env (production or dev)] 
** Set port please edit in package.json PORT=$[your port]
** Please replace Certificate for https by key1.pem and cert1.pem files.
** Please setup mongodb in server/config/config.js for production.

```sh
$ cd sourcecode/CCSM-FE
$ npm run app
```


