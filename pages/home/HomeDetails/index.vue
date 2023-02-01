<template>
  <div v-if="!exit" class="details flex-head mt-4 mb-4 w-2/3">
    <button class="exit_box">
      <!-- <font-awesome-icon icon="fa-solid fa-xmark" size="2x" /> -->
      <div class="exit" @click="exit = true"></div>
    </button>
    <div class="infos mt-1 mb-1">
      Jolify allows you to share your Spotify playlists in a prettier way.
    </div>

    <div class="infos mt-3">To see and share your playlists Jolified :</div>

    <div class="infos mt-1">
      - create an account in
      <a href="/register" class="a_link">register</a>.
    </div>

    <div class="infos mt-1">- link your account to Spotify.</div>

    <div class="infos mt-1">- wait for admin approval of your account.</div>

    <div class="infos mt-1">
      - find your Jolified playlists in
      <a href="/Playlists" class="a_link">Playlists</a>.
    </div>

    <h4 class="font-thin mt-4 mb-1 italic">
      (App is currently in beta version, suggestions and example bellow)
    </h4>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exit: false
    }
  }
}
</script>

<style>
.details {
  line-height: 1.25rem;
  font-family: 'Chillax-Regular';
  position: relative;
  text-align: center;
  padding: 3rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='26' ry='26' stroke='%23333' stroke-width='5' stroke-dasharray='12%2c 5' stroke-dashoffset='18' stroke-linecap='butt'/%3e%3c/svg%3e");
  border-radius: 26px;
  transition: 0.5s;
}

.infos {
  font-family: 'Chillax-Regular';
  text-align: center;
  font-size: large;
}

@media screen and (max-width: 1024px) {
  .details {
    width: 125%;
  }

  .exit_box {
    color: black;
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .exit {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 36px;
    height: 36px;
    border: 2px solid transparent;
    border-radius: 40px;
    transition: 0.5s;
  }

  .exit::after,
  .exit::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 27px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    top: 14px;
    left: 2px;
  }

  .exit::after {
    transform: rotate(-45deg);
  }
}

@media screen and (min-width: 1024px) {
  .details:hover {
    transform: scale(1.015);
    transition: 0.5s;
  }

  .exit_box {
    color: black;
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .exit {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs, 1));
    width: 36px;
    height: 36px;
    border: 2px solid transparent;
    border-radius: 40px;
    transition: 0.5s;
  }

  .exit::after,
  .exit::before {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 27px;
    height: 2px;
    background: currentColor;
    transform: rotate(45deg);
    border-radius: 5px;
    top: 14px;
    left: 2px;
  }

  .exit::after {
    transform: rotate(-45deg);
  }
}
</style>
