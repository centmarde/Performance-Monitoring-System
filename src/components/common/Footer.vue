<template>
  <footer class="footer">
    <!-- Patent Protection, License, and Credits -->
    <div class="footer-info">
      <p>Patent Protection, License, and Credits to Boarding Spot System S.Y 2024</p>
    </div>
    
    <!-- Social Media Links -->
    <div class="social-media-links">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><v-icon>mdi-facebook</v-icon>Facebook</a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><v-icon>mdi-twitter</v-icon>Twitter</a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><v-icon>mdi-instagram</v-icon>Instagram</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {

  padding: 20px;
  text-align: center;
}

.footer-info {
  margin-bottom: 10px;
}

.social-media-links a {
  margin: 0 10px;
  text-decoration: none;
  color: #007bff;
}

.social-media-links a:hover {
  text-decoration: underline;
}
</style>
