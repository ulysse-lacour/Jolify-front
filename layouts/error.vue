<template>
  <main>
    <!-- Preload fonts -->
    <div
      class="font_preload"
      style="
        opacity: 0;
        user-select: none;
        pointer-events: none;
        position: absolute;
        top: 0;
        -webkit-transform: translateY(-100%);
        transform: translateY(-100%);
      "
      role="none presentation"
    >
      <span style="font-family: 'I'"></span>
      <span style="font-family: 'Outfit'"></span>
      <span style="font-family: 'Director'"></span>
      <span style="font-family: 'Typefesse'"></span>
      <span style="font-family: 'Typefesse-full'"></span>
    </div>
    <section id="error" class="page_container">
      <div class="errorStatusCode">
        <div
          v-for="(char, index) in JSON.stringify(error.statusCode)"
          :key="index"
          class="error_number"
        >
          {{ char }}
        </div>
      </div>
      <div class="errorMessage">
        <div
          v-for="(char, index) in JSON.stringify(error.message, null, ' ')"
          :key="index"
          class="error_letter"
        >
          {{ char != ' ' ? char : '&nbsp;' }}
        </div>
      </div>

      <button class="homeButton" @click="$router.push('/')">
        <div class="home_letter">H</div>
        <div class="home_letter">O</div>
        <div class="home_letter">M</div>
        <div class="home_letter">E</div>
      </button>
    </section>
  </main>
</template>

<script>
export default {
  layout: 'errorLayout',

  props: {
    error: {
      type: Object,
      required: true
    }
  },

  head() {
    return {
      title: this.$config.app.title + this.$config.app.titleSeparator + 'ERROR'
    }
  },

  mounted() {
    this.AnimateErrorMessage()
    this.buttonAnimation()
  },

  methods: {
    AnimateErrorMessage() {
      const letters = document.querySelectorAll('.error_letter')
      this.$gsap.to(letters, {
        y: 'random(-8, 5)',
        opacity: 1,
        duration: 1
      })
    },

    buttonAnimation() {
      const letters = document.querySelectorAll('.home_letter')

      const displayQ = this.$gsap.timeline({ paused: true })
      displayQ.to(letters, {
        fontFamily: 'Typefesse',
        ease: 'none'
      })

      const hideQ = this.$gsap.timeline({ paused: true })
      hideQ.to(letters, {
        fontFamily: 'Outfit',
        ease: 'none'
      })

      const homeButton = document.querySelector('.homeButton')
      homeButton.addEventListener('mouseenter', () => displayQ.play(0))
      homeButton.addEventListener('mouseleave', () => hideQ.play(0))
    }
  }
}
</script>

<style scoped>
#error {
  background-color: transparent;
  min-height: 100svh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.errorStatusCode {
  font-family: 'Typefesse';
  font-size: 10rem;
  margin-bottom: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error_number:hover {
  font-family: 'Typefesse-full';
  cursor: default;
}

.errorMessage {
  font-family: 'Director';
  font-size: 3rem;
  margin-bottom: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  max-width: 100%;
  flex-wrap: wrap;
}

.error_letter {
  opacity: 0;
  cursor: default;
}

.homeButton {
  font-family: 'Outfit';
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 1.5rem;
  width: 7rem;
  padding: 0.4rem 4rem;
  border: 1px black solid;
  border-radius: 30px;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  -khtml-border-radius: 30px;
  display: flex;
  justify-content: center;
}
</style>
