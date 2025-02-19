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
        <AppFooter />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup></script>

<style scoped></style>
