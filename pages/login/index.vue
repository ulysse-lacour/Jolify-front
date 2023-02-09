<template>
  <main id="content" class="flexxx w-screen">
    <div class="login-form flexxx w-2/4">
      <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->
      <input style="display: none" type="text" name="fakeusernameremembered" />
      <input
        style="display: none"
        type="password"
        name="fakepasswordremembered"
      />
      <!-- fake fields are a workaround for chrome autofill getting the wrong fields -->

      <span v-if="error" class="error text-red-600 mb-4">{{ error }}</span>

      <div v-if="$store.state.auth.isAuth">
        <div class="text-center">You are logged in !</div>
        <button class="log-button" type="button" @click="logOutUser">
          Logout
        </button>
      </div>

      <form v-else class="flexxx" @submit.prevent="onSubmit">
        <div class="input-form flexxx">
          <input
            v-model="credentials.username"
            class="log-input"
            placeholder="username"
            type="text"
            required
            autocomplete="do-not-autofill"
          />
        </div>
        <div class="input-form flexxx">
          <div class="pwd-form flex justify-end items-center relative">
            <input
              id="password"
              v-model="credentials.password"
              class="log-input pwd-input"
              placeholder="password"
              type="password"
              required
              autocomplete="do-not-autofill"
            />
            <div id="eye" class="absolute mr-3 mt-2">
              <input
                id="checkbox_eye"
                type="checkbox"
                onchange="document.getElementById('password').type = this.checked ? 'text' : 'password'"
                onclick="document.getElementById('password').focus()"
              />
              <label for="checkbox_eye" class="rounded-full"></label>
            </div>
          </div>
        </div>
        <button class="log-button" type="submit">LOGIN</button>
      </form>
    </div>
  </main>
</template>

<script>
import authenticateUserGql from '~/gql/authenticateUser.gql'

export default {
  data() {
    return {
      submitting: false,
      error: null,
      successfullData: null,
      credentials: {
        username: '',
        password: ''
      }
    }
  },

  head() {
    return {
      title: this.$config.app.title + this.$config.app.titleSeparator + 'login',

      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$config.app.description
        }
      ]
    }
  },

  methods: {
    async onSubmit() {
      this.error = null
      this.submitting = true
      const credentials = this.credentials
      await this.$apollo
        .mutate({
          mutation: authenticateUserGql,
          variables: credentials
        })
        .then(({ data }) => {
          this.successfullData = data.loginUser
          this.submitting = false
          if (data.loginUser.success === false) {
            // Clean error returned by backend
            this.error = data.loginUser.details
          } else {
            // Success submit
            this.$apolloHelpers.onLogin(data.loginUser.token, undefined, {
              expires: 7
            })
            this.successfullData = data.loginUser
            this.$store.commit('auth/logInOutUser', true)
            this.$router.push({ name: 'playlists' })
          }
        })
        .catch(error => {
          // Unplanned erros :
          this.submitting = false
          this.error = error
        })
    },
    logOutUser() {
      this.$cookies.remove('apollo-token')
      this.$store.commit('auth/logInOutUser', false)
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
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

.logout:hover {
  background-color: rgb(12, 12, 12);
  color: red;
  transition: 0.5s;
}

.log-input {
  font-family: 'Chillax-Semibold';
  height: 4rem;
  width: 20rem;
  text-align: center;
  font-size: large;
  padding: 0.5rem 1.5rem;
  color: rgb(12, 12, 12);
  border: 1px solid rgb(12, 12, 12);
  border-radius: 16px;
  transition: 0.5s;
}

.log-input:placeholder-shown,
.log-input::placeholder {
  font-family: 'Chillax-Light';
}

.input-form {
  margin: 1rem;
}

.log-input:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: 0.5s;
}

.log-input:focus {
  border: 1.5px solid rgb(12, 12, 12);
  transition: 0.25s linear;
}

input[type='text']:-moz-placeholder,
input[type='password']:-moz-placeholder,
input[type='text']::-moz-placeholder,
input[type='password']::-moz-placeholder {
  opacity: 2;
  transition: 0.5s;
}

input[type='text']:focus:-moz-placeholder,
input[type='password']:focus:-moz-placeholder,
input[type='text']:focus::-moz-placeholder,
input[type='password']:focus::-moz-placeholder {
  opacity: 0;
  transition: 0.5s;
}

input[type='text']::-webkit-input-placeholder,
input[type='password']::-webkit-input-placeholder {
  opacity: 2;
  transition: 0.5s;
}

input[type='text']:focus::-webkit-input-placeholder,
input[type='password']:focus::-webkit-input-placeholder {
  opacity: 0;
  transition: 0.5s;
}

input[type='checkbox'] {
  display: none;
}

input[type='checkbox'] + label {
  display: inline-block;
  padding: 0 0 0 0px;
  background: url('~/assets/images/eye_close.png') no-repeat center center;
  height: 2rem;
  width: 2rem;
  background-size: 65%;
  opacity: 0.75;
  border: 1px solid rgba(12, 12, 12, 0);
}

input[type='checkbox']:checked + label {
  background: url('~/assets/images/eye_open.png') no-repeat center center;
  height: 2rem;
  width: 2rem;
  display: inline-block;
  background-size: 65%;
}

input[type='checkbox']:hover + label {
  background-size: 75%;
  opacity: 2;
  transition: 0.5s;
}

.log-input:-webkit-autofill,
.log-input:-webkit-autofill:hover,
.log-input:-webkit-autofill:focus,
.log-input:-webkit-autofill:active,
.log-input:-webkit-autofill::first-line {
  box-shadow: 0 0 0px 1000px #ffff inset;
  -webkit-box-shadow: 0 0 0px 1000px #ffff inset;
  font-size: large;
}
</style>
