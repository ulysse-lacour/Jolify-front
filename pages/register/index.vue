<template>
  <main id="content" class="flexxx w-screen">
    <div class="flexxx w-3/4">
      <span class="error text-red-600 mb-4">{{ error }}</span>

      <div v-if="submitting" class="loader">
        <div class="lds-dual-ring"></div>
      </div>

      <div v-else class="register-form">
        <form
          v-if="!$store.state.auth.isAuth"
          id="desktop_register"
          class="flexxx w-full"
          @submit.prevent="onSubmit"
        >
          <div class="grid grid-cols-2 gap-x-12 w-full">
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.username"
                type="text"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Username"
                required
              />
            </div>
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.email"
                type="email"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Email (same as Spotify account)"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-12 w-full">
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.password"
                type="password"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Password"
                required
              />
            </div>
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.passwordConfirmation"
                type="password"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          <button class="register-button" type="submit">SIGN IN</button>
        </form>

        <form
          v-if="!$store.state.auth.isAuth"
          id="mobile_register"
          class="flexxx w-full"
          @submit.prevent="onSubmit"
        >
          <div class="grid grid-cols-1 gap-x-12 w-full">
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.username"
                type="text"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Username"
                required
              />
            </div>
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.email"
                type="email"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Email (same as Spotify account)"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-x-12 w-full">
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.password"
                type="password"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Password"
                required
              />
            </div>
            <div class="relative z-0 mb-6 w-full group">
              <input
                v-model="credentials.passwordConfirmation"
                type="password"
                class="register-input py-2.5 px-0 w-full text-gray-900 bg-transparent"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          <button class="register-button" type="submit">SIGN IN</button>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
// GRAPHQL IMPORTS
import createUserGql from '~/gql/createUser.gql'

export default {
  middleware: 'isNotAuth',

  data() {
    return {
      submitting: false,
      error: null,
      credentials: {
        username: '',
        password: '',
        passwordConfirmation: '',
        email: ''
      }
    }
  },

  head() {
    return {
      title:
        this.$config.app.title + this.$config.app.titleSeparator + 'register',

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
      const credentials = this.credentials
      this.error = null
      if (credentials.password === credentials.passwordConfirmation) {
        this.submitting = true
        const res = await this.$apollo
          .mutate({
            mutation: createUserGql,
            variables: credentials
          })
          .then(({ data }) => data && data.createUser)
          .catch(error => {
            // Unplanned erros :
            this.submitting = false
            this.error = error
          })
        if (this.error == null) {
          if (res.success === false) {
            // Clean error returned by backend
            this.submitting = false
            this.error = res.details
          } else {
            // Success submit
            await this.$apolloHelpers.onLogin(res.token, undefined, {
              expires: 7
            })
            this.successfulData = res
            this.$store.commit('auth/logInOutUser', true)
            this.$router.push({ name: 'playlists' })
          }
        }
      } else {
        this.error = "Passwords doesn't match, retry !"
      }
    }
  }
}
</script>

<style>
#content {
  min-height: 90vh;
  background-color: #ffff;
}

.flexxx {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.register-form {
  width: 75vw;
}

.register-button {
  font-family: 'Chillax-Semibold';
  background-color: #ffff;
  color: rgb(12, 12, 12);
  border: 1px solid rgb(12, 12, 12);
  border-radius: 16px;
  padding: 0.5rem 1rem;
  margin: 1rem;
  transition: 0.5s;
}

.register-button:hover {
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

.input-form {
  margin: 1rem;
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

.register-input {
  font-family: 'Chillax-Medium';
  font-size: large;
  border-bottom: 1px solid rgba(122, 122, 122, 0.5);
  transition: 0.25s;
}

.register-input:placeholder-shown,
.register-input::placeholder {
  font-family: 'Chillax-Light';
}

.register-input:hover {
  border-bottom: 1px solid rgb(12, 12, 12);
  transition: 0.25s;
}

.register-input:focus {
  border-bottom: 2px solid rgb(12, 12, 12, 2);
  transition: 0.1s;
}

.register-input:-webkit-autofill,
.register-input:-webkit-autofill:hover,
.register-input:-webkit-autofill:focus,
.register-input:-webkit-autofill:active,
.register-input:-webkit-autofill::first-line {
  box-shadow: 0 0 0px 1000px #ffff inset;
  -webkit-box-shadow: 0 0 0px 1000px #ffff inset;
  font-size: large;
}

.success {
  font-family: 'Chillax-Semibold';
  font-size: 1.25rem;
}

@media screen and (max-width: 1024px) {
  #desktop_register {
    display: none;
  }

  #mobile_register {
    display: flex;
  }

  .register-input {
    text-align: center;
  }
}

@media screen and (min-width: 1024px) {
  #desktop_register {
    display: flex;
  }

  #mobile_register {
    display: none;
  }
}
</style>
