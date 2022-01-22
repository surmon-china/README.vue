# README.md

Generate your README.md by Vue component.

<img src="https://readme.app.surmon.me/api/render?template_id=hello-world" width="100%" height="300px" />

### API

BaseURL: `http://readme.app.surmon.me/api/render`

#### Template ID

`?template_id=<template_id>`

#### Template URL

`?template_url=<template_url_xxx.vue>`

#### Template string

`?template_string=<template_content_string>`

#### Template params

`?params.<param1_name>=<param1_value>&params.<param2_name>=<param2_value>`

### HelloWorld

#### simple example

```markdown
![](https://readme.app.surmon.me/api/render?template_id=hello-world)
```

#### params example

```markdown
![](https://readme.app.surmon.me/api/render?template_id=hello-world&params.theme=dark)
```

## Development Setup

```bash
# install dependencies
$ yarn

$ yarn dev
$ yarn build
$ yarn start
```

### Layout

- `api` vercel serverless
- `app/server` Node.js server
