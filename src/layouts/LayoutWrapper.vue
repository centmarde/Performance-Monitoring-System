<template>
  <v-app>
    <v-main>
      <div id="main-content">
            <InnerNavBar />
            <slot name="content"></slot>
            <ScrollDown />
           
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import InnerNavBar from '../components/common/InnerNavBar.vue';
import ScrollDown from '../components/common/ScrollDown.vue';
</script> 

<style scoped>

</style>
