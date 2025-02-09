<template>
    <v-container fluid>
        <v-card elevation-10 class="my-10">
            <h1 class="text-center">Objectives ani nga page</h1>
        </v-card>

        <v-card class="text-center pa-5" elevation-10>
            <h5>butangan nimo ug welcome page direa sa user. <br>
            then naay button nga if e click naay mo gawas v-dialogn nga mag <br> ask sa user sa extra information nila <br>
                e check sa supabase and data columns. <br>
                kani na v-dialog is pwede ra nila e skip, that means naay skip button. <br>
                pa gwapoha ni direa kay landing page ni. <br> mao ni mag welcome sa mga user.
        </h5>
        <router-link to="/home"><v-btn class="my-5" color="red">ok</v-btn></router-link>
        </v-card>
    </v-container>
</template>

<script>
    
</script>

<style lang="scss" scoped>
.bg {
    background-color: #f5f5f5;
}
</style>