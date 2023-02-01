<template>
  <div id="header">
    <div id="desktop_header" class="w-screen flex items-center justify-between">
      <div class="w-4/12 logo_div">
        <div class="logo_card">
          <img id="logo" />
        </div>
      </div>
      <div class="w-4/12 title_header font-black text-center">Jolify</div>

      <div class="w-4/12 flex justify-end pr-4">
        <ul class="flex items-center">
          <li class="header_item">
            <NuxtLink
              to="/"
              class="p-1"
              :style="
                $route.name == 'home'
                  ? 'background-color: #fafa00da; border-radius: 6px;'
                  : 'text-decoration: none;'
              "
              >Home</NuxtLink
            >
          </li>

          <li class="header_pipe">|</li>

          <li v-if="$store.state.auth.isAuth" class="header_item">
            <NuxtLink
              to="/playlists"
              class="p-1"
              :style="
                $route.name == 'playlists'
                  ? 'background-color: #fafa00da; border-radius: 6px;'
                  : 'text-decoration: none;'
              "
              >Playlists</NuxtLink
            >
          </li>

          <li v-if="$store.state.auth.isAuth" class="header_pipe">|</li>

          <li v-if="$store.state.auth.isAuth" class="">
            <button type="button" class="header_logout" @click="logOutUser()">
              Logout
            </button>
          </li>

          <li v-if="!$store.state.auth.isAuth" class="header_item">
            <NuxtLink
              to="/register"
              class="p-1"
              :style="
                $route.name == 'register'
                  ? 'background-color: #fafa00da; border-radius: 6px;'
                  : 'text-decoration: none;'
              "
              >Register</NuxtLink
            >
          </li>

          <li v-if="!$store.state.auth.isAuth" class="header_pipe">|</li>

          <li v-if="!$store.state.auth.isAuth" class="header_item">
            <NuxtLink
              to="/login"
              class="p-1 pr-2"
              :style="
                $route.name == 'login'
                  ? 'background-color: #fafa00da; border-radius: 6px;'
                  : 'text-decoration: none;'
              "
              >Login</NuxtLink
            >
          </li>
        </ul>
      </div>
    </div>

    <div id="mobile_header">
      <div class="logo_div w-4/12 flex-left">
        <div class="logo_card">
          <img id="logo" />
          <img id="logo_placeholder" />
        </div>
      </div>

      <div class="w-4/12 title_header font-black text-center">Jolify</div>

      <div
        class="burger w-4/12 flex-right"
        style="z-index: 400; padding-right: 1rem"
      >
        <font-awesome-icon
          id="burger"
          icon="fa-solid fa-bars"
          size="2x"
          @click="show_items()"
        />

        <font-awesome-icon
          id="xmark"
          icon="fa-solid fa-xmark"
          size="2x"
          style="display: none"
          @click="show_items()"
        />
      </div>

      <div id="mobile_items" class="w-full" style="display: none">
        <div style="position: relative; top: 50%; transform: translateY(-50%)">
          <ul class="flexxx items-center">
            <li class="header_item">
              <NuxtLink
                to="/"
                class="p-1"
                :style="
                  $route.name == 'home'
                    ? 'background-color: #fafa00da; border-radius: 6px;'
                    : 'text-decoration: none;'
                "
                @click.native="hide_items()"
                >Home</NuxtLink
              >
            </li>

            <li class="header_pipe">__</li>

            <li v-if="$store.state.auth.isAuth" class="header_item">
              <NuxtLink
                to="/playlists"
                class="p-1"
                :style="
                  $route.name == 'playlists'
                    ? 'background-color: #fafa00da; border-radius: 6px;'
                    : 'text-decoration: none;'
                "
                @click.native="hide_items()"
                >Playlists</NuxtLink
              >
            </li>

            <li v-if="$store.state.auth.isAuth" class="header_pipe">__</li>

            <li v-if="$store.state.auth.isAuth" class="">
              <button
                type="button"
                class="header_logout"
                @click="logOutUser(), hide_items()"
              >
                Logout
              </button>
            </li>

            <li v-if="!$store.state.auth.isAuth" class="header_item">
              <NuxtLink
                to="/register"
                class="p-1"
                :style="
                  $route.name == 'register'
                    ? 'background-color: #fafa00da; border-radius: 6px;'
                    : 'text-decoration: none;'
                "
                @click.native="hide_items()"
                >Register</NuxtLink
              >
            </li>

            <li v-if="!$store.state.auth.isAuth" class="header_pipe">__</li>

            <li v-if="!$store.state.auth.isAuth" class="header_item">
              <NuxtLink
                to="/login"
                class="p-1"
                :style="
                  $route.name == 'login'
                    ? 'background-color: #fafa00da; border-radius: 6px;'
                    : 'text-decoration: none;'
                "
                @click.native="hide_items()"
                >Login</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Look for auth cookie to auto-log user
    const authCookie = this.$cookies.get('apollo-token')
    authCookie
      ? this.$store.commit('auth/logInOutUser', true)
      : this.$store.commit('auth/logInOutUser', false)
  },

  methods: {
    logOutUser() {
      this.$cookies.remove('apollo-token')
      // this.$cookies.remove('refreshToken')
      this.$store.commit('auth/logInOutUser', false)
      this.$router.push('/')
    },

    disableScrolling() {
      const x = window.scrollX
      const y = window.scrollY
      window.onscroll = function () {
        window.scrollTo(x, y)
      }
      document.body.style.overflow = 'hidden'
    },

    enableScrolling() {
      window.onscroll = null
      document.body.style.overflow = 'visible'
    },

    show_items() {
      // Toggle header items visibility
      document.getElementById('mobile_items').style.display =
        document.getElementById('mobile_items').style.display === 'none'
          ? ''
          : 'none'
      // Toggle burger icon visibility
      document.getElementById('burger').style.display =
        document.getElementById('mobile_items').style.display === 'none'
          ? ''
          : 'none'
      // Toggle xmark icon visibility
      document.getElementById('xmark').style.display =
        document.getElementById('mobile_items').style.display !== 'none'
          ? ''
          : 'none'
      // Toggle scroll ability
      document.getElementById('mobile_items').style.display === 'none'
        ? this.enableScrolling()
        : this.disableScrolling()
    },

    hide_items() {
      // Show burger icon
      document.getElementById('burger').style.display = ''
      // Hide header items
      document.getElementById('mobile_items').style.display = 'none'
      // Hide xmark icon
      document.getElementById('xmark').style.display = 'none'
      // Enable scroll
      this.enableScrolling()
    }
  }
}
</script>

<style>
#header {
  height: 5rem;
}

.header_item {
  font-family: 'Chillax-Medium';
  text-align: center;
  padding-top: 0rem;
  padding-bottom: 0rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  transition: 0.5s;
}

.header_logout {
  font-family: 'Chillax-Medium';
  padding-top: 0rem;
  padding-bottom: 0rem;
  padding-left: 0.5rem;
  padding-right: 1rem;
  transition: 0.5s;
}

.header_pipe {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.title_header {
  font-family: 'Boska-Regular';
  text-align: center;
  font-size: xx-large;
  transform: scale(1.25);
  margin-top: 1rem;
  margin-bottom: 1rem;
}

#logo {
  content: url('~/assets/images/logo.png');
}

.logo_card {
  padding: 0.25rem;
  padding-left: 1rem;
}

/* HEADER MOBILE VIEW */
@media screen and (max-width: 1024px) {
  #desktop_header {
    display: none;
  }

  #mobile_header {
    height: 3rem;
    display: flex;
  }

  #content {
    margin-top: 3rem;
  }

  .title_header {
    text-align: center;
    font-size: x-large;
    margin: 0;
    margin-top: 0.25rem;
  }

  #mobile_items {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(5px);
    z-index: 200;
  }

  #header {
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 200;
    height: 3rem;
    background-color: #ffff;
    color: rgb(12, 12, 12);
    border-bottom: 1px solid rgb(12, 12, 12);
  }

  #logo {
    height: 2.5rem;
    width: auto;
    margin-bottom: -0.25rem;
    transition: 0.5s;
  }

  .header_item {
    margin: 1rem;
    font-size: xx-large;
  }

  .header_pipe {
    margin: 1rem;
    font-size: xx-large;
  }

  .header_logout {
    margin: 1rem;
    font-size: xx-large;
  }
}

/* HEADER DESKTOP VIEW */
@media screen and (min-width: 1024px) {
  #desktop_header {
    display: flex;
  }

  #mobile_header {
    display: none;
  }

  #header {
    background-color: #ffff;
    color: rgb(12, 12, 12);
    border-bottom: 1px solid rgb(12, 12, 12);
  }

  #logo {
    height: 4rem;
    width: auto;
    transform: scale(1.1);
    margin-bottom: -0.55rem;
    transition: 0.5s;
  }

  .logo_card {
    padding-left: 2.5rem;
  }

  .header_item {
    font-size: larger;
  }

  .header_item:hover {
    -ms-transform: scale(1.1); /* IE 9 */
    -webkit-transform: scale(1.1); /* Safari 3-8 */
    transform: scale(1.1);
    transition: 0.5s;
  }

  .header_logout {
    font-size: larger;
  }

  .header_logout:hover {
    color: red;
    -ms-transform: scale(1.1); /* IE 9 */
    -webkit-transform: scale(1.1); /* Safari 3-8 */
    transform: scale(1.1);
    transition: 0.5s;
  }

  .header_pipe {
    font-size: x-large;
  }
}
</style>
