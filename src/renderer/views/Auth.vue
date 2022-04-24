<template>
  <div
    :class="['view-auth', {
      'view-auth--page-login': isLogin,
      'view-auth--page-register': !isLogin
    }]"
  >
    <div class="view-auth__form">
      <div class="view-auth__form__box" />
      <div class="view-auth__form__content">
        <h2 class="view-auth__subheading">
          <span class="view-auth__subheading__login">
            {{ $t('auth.login.title') }}
          </span>
          <span class="view-auth__subheading__register">
            {{ $t('auth.register.title') }}
          </span>
        </h2>
        <h1 class="view-auth__heading">
          <span
            :style="{
              '--width': contentWidth + 'px'
            }"
            class="view-auth__heading__content"
          >

            <span
              ref="headingLogin"
              class="view-auth__heading__login"
            >
              {{ $t('auth.login.header') }}
            </span>
            <span
              ref="headingRegister"
              class="view-auth__heading__register"
            >
              {{ $t('auth.register.header') }}
            </span>

          </span>
          <span class="view-auth__heading__period">.</span>
        </h1>

        <transition
          name="view-auth__page"
          mode="out-in"
        >
          <LoginForm
            class="view-auth__page view-auth__page--login"
            v-if="isLogin"
          />
          <RegistrationForm
            class="view-auth__page view-auth__page--register"
            v-else
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import RegistrationForm from '../components/auth/RegistrationForm.vue'

export default defineComponent({
  components: {
    LoginForm,
    RegistrationForm
  },

  setup () {
    const headingLogin = ref(null as HTMLElement | null)
    const headingRegister = ref(null as HTMLElement | null)

    const isLogin = computed(() => useRoute().params.action === 'login')
    const contentWidth = computed(() => isLogin.value ? headingLogin.value?.offsetWidth : headingRegister.value?.offsetWidth)

    return {
      headingLogin,
      headingRegister,
      isLogin,
      contentWidth
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.view-auth {
  height: 100%;

  @include r.light {
    background: r.$col-white;
  }
  @include r.dark {
    background: r.$col-900;
  }

  &__form {
    position: absolute;
    inset: 50% auto auto 10%;
    width: 390px;
    height: 550px;

    transform: translateY(-50%);

    &__box {
      position: absolute;
      inset: 0 10px 0 0;
      transform: translate(-20px, 20px);

      @include r.light {
        border: r.$col-100 solid 2px;
      }
      @include r.dark {
        border: r.$col-600 solid 2px;
      }
      border-radius: 20px;
    }

    &__content {
      position: relative;
      padding: 10px;

      @include r.light {
        background: r.$col-white;
      }
      @include r.dark {
        background: r.$col-900;
      }
    }
  }

  &__subheading {
    position: relative;
    height: 20px;

    margin-bottom: 5px;

    font-size: 20px;
    font-weight: 300;
    text-transform: uppercase;
    line-height: 1;

    color: r.$col-primary;

    &__login, &__register {
      top: 0;
      width: fit-content;
      position: absolute;
      clip-path: inset(0);
      white-space: nowrap;

      transition:
        transform .5s cubic-bezier(0.19, 1, 0.22, 1),
        clip-path .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .view-auth--page-login &__register {
      transform: translateY(100%);
      clip-path: inset(0 0 100% 0);
    }
    .view-auth--page-register &__login {
      transform: translateY(-100%);
      clip-path: inset(100% 0 0 0);
    }
  }

  &__heading {
    position: relative;
    font-weight: 900;
    font-size: 45px;
    white-space: nowrap;
    display: flex;
    flex-flow: row nowrap;
    width: fit-content;

    line-height: 1;

    &__content {
      display: inline-block;
      flex: 0 0 auto;
      position: relative;
      height: 45px;
      width: var(--width);
      transition: width .5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &__login, &__register {
      top: 0;
      width: fit-content;
      position: absolute;
      clip-path: inset(0);

      transition:
        transform .5s cubic-bezier(0.19, 1, 0.22, 1),
        clip-path .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .view-auth--page-login &__register {
      transform: translateY(100%);
      clip-path: inset(0 0 100% 0);
    }
    .view-auth--page-register &__login {
      transform: translateY(-100%);
      clip-path: inset(100% 0 0 0);
    }

    &__period {
      color: r.$col-primary;
    }
  }

  &__page {
    &-enter-active {
      transition: .1s cubic-bezier(0.215, 0.610, 0.355, 1);
    }
    &-leave-active {
      transition: .1s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }

    &-enter-from, &-leave-to {
      opacity: 0;
    }

    &--login {
      &.view-auth__page {
        &-enter-from, &-leave-to {
          transform: translateX(-20px);
        }
      }
    }

    &--register {
      &.view-auth__page {
        &-enter-from, &-leave-to {
          transform: translateX(20px);
        }
      }
    }
  }
}
</style>
