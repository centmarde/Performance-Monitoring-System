<template>
  <div class="main__action" @click="toggleScroll">
    <a class="main__scroll" href="#">
      <div class="main__scroll-box">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path :fill="iconColor" :d="arrowPath"></path>
        </svg>
      </div>
      <span class="main__scroll-text">Scroll</span>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isAtBottom = ref(false);

const iconColor = computed(() =>
  theme.global.current.value.dark ? "rgba(255,255,255,1)" : "rgba(28,28,30,1)"
);

const arrowPath = computed(
  () =>
    isAtBottom.value
      ? "M11.9997 10.8284L16.9495 15.7781L18.3637 14.3639L11.9997 8L5.63574 14.3639L7.04996 15.7781L11.9997 10.8284Z" // Up arrow
      : "M11.9997 13.1716L7.04996 8.22186L5.63574 9.63607L11.9997 16L18.3637 9.63607L16.9495 8.22186L11.9997 13.1716Z" // Down arrow
);

function toggleScroll() {
  if (isAtBottom.value) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }
}

function checkScrollPosition() {
  isAtBottom.value =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

onMounted(() => {
  window.addEventListener("scroll", checkScrollPosition);
  checkScrollPosition(); // Initial check
});
</script>

<style scoped>
a {
  text-decoration: none;
}

.main__action {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  cursor: pointer;
}

.main__scroll-box {
  width: 40px;
  height: 40px;
}

.main__scroll-text {
  color: rgb(28, 29, 30);
  display: none; /* Hide text to make it more compact */
}

.main__action:hover .main__scroll-box {
  animation: scroll-down 3s infinite;
}

/* Animate scroll icon */
@keyframes scroll-down {
  0%,
  100% {
    transform: translateY(0rem);
    opacity: 1;
  }

  35% {
    transform: translateY(1rem);
    opacity: 0;
  }

  70% {
    transform: translateY(-1rem);
    opacity: 0;
  }
}
</style>
