<template>
   <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
           <SidebarMenuHome/>
          </v-col>
            <InnerNavBar />
          <v-col cols="12">
            <slot name="content"></slot>
            <ScrollDown />
          </v-col>
        </v-row>
        <AppFooter />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
