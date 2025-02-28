<template>
  <v-footer
    app
    class="footer-container d-flex flex-column align-center justify-center py-3"
  >
    <div class="text-caption text-center font-weight-medium">
      &copy; {{ new Date().getFullYear() }} Performance Monitoring System. All
      Rights Reserved.
    </div>

    <div class="d-flex align-center justify-center mt-2">
      <a
        v-for="item in items"
        :key="item.title"
        :href="item.href"
        :title="item.title"
        class="social-link mx-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon :icon="item.icon" size="20" class="social-icon" />
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const items = [
  { title: "GitHub", icon: "mdi-github", href: "https://github.com/" },
  { title: "Twitter", icon: "mdi-twitter", href: "https://twitter.com/" },
  { title: "LinkedIn", icon: "mdi-linkedin", href: "https://linkedin.com/" },
  { title: "Facebook", icon: "mdi-facebook", href: "https://facebook.com/" },
];
</script>

<style scoped>
.footer-container {
  background: #004d40;
  color: white;
  text-align: center;
  font-size: 14px;
}

.social-link .v-icon {
  color: white;
  transition: transform 0.2s ease-in-out, color 0.3s;
}

.social-link:hover .v-icon {
  color: #ffd54f; /* Yellow accent on hover */
  transform: scale(1.2);
}
</style>
