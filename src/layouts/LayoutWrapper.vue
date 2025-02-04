<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <SidebarMenu />
          </v-col>
          <v-col cols="12">
            <InnerNavBar />
            <slot name="content"></slot>
            <ScrollDown />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import InnerNavBar from '../components/common/InnerNavBar.vue';
import ScrollDown from '../components/common/ScrollDown.vue';
import SidebarMenu from '../components/common/SidebarMenu.vue';
</script>

<style scoped>
</style>
