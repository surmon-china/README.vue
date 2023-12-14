<script setup lang="ts">
  import { SimpleIcons, Devicon } from '@components'
  import { github } from '@stores'

  const props = defineProps({
    username: {
      type: String,
      required: true
    }
  })

  // @ts-expect-error
  const data = await github(props.username, [
    'userinfo',
    'followers_count',
    'following_count',
    'gists_count',
    'issues_count',
    'organizations_count',
    'repositories_count',
    'repositories',
    'sponsors_count'
  ])

  const totalStars = data.repositories.reduce((acc, repo) => {
    return acc + repo.stargazerCount
  }, 0)
</script>

<template>
  <div class="main">
    <h4 class="username">{{ username }}</h4>
    <p class="bio">{{ data.userinfo.bio }}</p>
    <div class="metas">
      <p>
        <Devicon class="icon" name="github" />
        Followers: {{ totalStars }}
      </p>
      <p>
        <SimpleIcons class="icon" name="githubsponsors" />
        Followers: {{ data.followers_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="githubactions" />
        Following: {{ data.following_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="git" />
        Gists: {{ data.gists_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="github" />
        Issues: {{ data.issues_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="awsorganizations" />
        Organizations: {{ data.organizations_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="x" />
        Repositories: {{ data.repositories_count }}
      </p>
      <p>
        <SimpleIcons class="icon" name="githubsponsors" />
        Sponsors: {{ data.sponsors_count }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
  .main {
    padding: 1em;

    .username {
      margin-top: 0;
      margin-bottom: 10px;
    }

    .icon {
      width: 1em;
    }
  }
</style>
