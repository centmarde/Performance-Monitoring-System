<template>
   <v-card elevate="8">
      <v-container>
         <v-row>
            <v-col cols="12" class="text-center pa-8">
               <h1>Missed Activities</h1>
               <v-divider></v-divider>
               <p>{{ description }}</p>
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12" class="text-center">
               <v-btn color="primary" @click="showDetails">Show Details</v-btn>
            </v-col>
         </v-row>
      </v-container>
   </v-card>
</template>

<script>
export default {
   data() {
      return {
         description: 'List of activities missed by students.'
      };
   },
   methods: {
      showDetails() {
         alert('Details will be shown here.');
      }
   }
}
</script>

<style lang="scss" scoped>
h1 {
   font-family: 'Roboto', sans-serif;
   color: #e53935;
}
</style>
