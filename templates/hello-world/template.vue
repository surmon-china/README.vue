<template>
  <div class="main" :class="theme">
    <div class="image"></div>
    <h1 class="title">Hello, World!</h1>
  </div>
</template>

<script>
  const { defineComponent } = $ctx.vue
  export default defineComponent({
    name: 'HelloWorld',
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: monospace;
    color: white;
  }

  .main.light {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
  }

  .main.dark {
    background: black;
  }

  @keyframes text-animation {
    from {
      color: greenyellow;
    }
    to {
      color: blue;
    }
  }

  .title {
    margin-bottom: 0;
    font-size: 300%;
    font-weight: normal;
    transition: color 0.5s;
    animation: text-animation 0.1s infinite steps(10);
  }

  @keyframes image-animation {
    0% {
      transform: rotate(0deg);
    }
    33% {
      transform: rotate(30deg);
    }
    66% {
      transform: rotate(-30deg);
    }
    100% {
      transform: rotate(30deg);
    }
  }

  .image {
    transition: transform 0.5s;
    animation: image-animation 1s infinite steps(3) forwards;
    width: 10rem;
    height: 10rem;
    background-image: url('data:image/png;base64,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');
  }
</style>
