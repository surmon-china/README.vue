# README.md

🚀 Design your README.md by Vue component.

![](https://readme.app.surmon.me/api/render?template_id=hello-world&props.theme=dark&svg.width=830&svg.height=300)

## Render API

BaseURL: `http://readme.app.surmon.me/api/render`

### 🔷 Template params

**Template ID** `?template_id=<template_id>`

Use default [template](https://github.com/surmon-china/README.md/tree/main/templates).

**Template URL** `?template_url=<template_url_xxx.vue>`

Use your remote vue template.

**Template string** `?template_string=<template_content_string>`

Use your vue template by query string.

### 🔷 Template render params

begin with `props.`, template render params will transmit to vue component's `props`.

e.g. `?props.theme=dark&props.rows=2` will transmit to vue component `{ theme: 'dark', rows: '2' }`

### 🔷 SVG render params

begin with `svg.`, SVG render params will transmit to SVG wrapper's attributes.

e.g. `?svg.width=830&svg.height=100` will transmit to SVG wrapper `<svg ... width="830" height="100">`

## HelloWorld

#### simple example

```markdown
![](https://readme.app.surmon.me/api/render?template_id=hello-world)
```

#### template params example

```markdown
![](https://readme.app.surmon.me/api/render?template_id=hello-world&props.theme=dark)
```

#### SVG params example

```markdown
![](https://readme.app.surmon.me/api/render?template_id=hello-world&svg.width=800&svg.height=300)
```

## Template

1. must be a vue SFC component
2. can't use Node.js API, `$ctx` only (see [sandbox context](https://github.com/surmon-china/README.md/blob/main/app/step-vue-render.ts#L13))
3. plain SFC component only

template example:

```vue
<template>
  <div class="main" :class="theme">
    <p>content</p>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'Example',
    props: {
      theme: {
        type: String,
        default: 'light'
      }
    }
  })
</script>

<style>
  .main {
    width: 100px;
    height: 100px;
  }
</style>
```

## Template context

[TODO](https://github.com/surmon-china/README.md/blob/main/app/step-vue-render.ts#L13)

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
