<template>
  <div class="mt-10">
    <div v-if="error">
      <span class="error text-red-600">Unable to synch with Spotify</span>
      <span class="error text-red-600">{{ error }}</span>
    </div>
    <div v-else-if="authLink">
      <a :href="authLink" class="log-button">CONNECT TO SPOTIFY</a>
    </div>
  </div>
</template>

<script>
import authLink from '~/gql/authLink.gql'

export default {
  data() {
    return {
      error: null,
      authLink: ''
    }
  },

  mounted() {
    this.getAuthLink()
  },

  methods: {
    async getAuthLink() {
      try {
        await this.$apollo
          .query({
            query: authLink
          })
          .then(({ data }) => {
            this.authLink = data.authLink.href
          })
          .catch(error => {
            this.error = error
          })
      } catch (e) {
        this.error = e
      }
    }
  }
}
</script>

<style>
.log-button {
  font-family: 'Chillax-Semibold';
  background-color: #ffff;
  color: rgb(12, 12, 12);
  border: 1px solid rgb(12, 12, 12);
  border-radius: 16px;
  padding: 0.5rem 1rem;
  margin: 2rem;
  transition: 0.5s;
}

.log-button:hover {
  background-color: rgb(12, 12, 12);
  color: #ffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: 0.5s;
}
</style>
