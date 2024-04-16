<template>
  <div class="Soonview">
    <h1>soon</h1>
    <nav>
      <v-toolbar>
        <v-app-bar-nav-icon variant="text" @click.stop="burgerMenu = !burgerMenu"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
          <span>Japparts</span>
        </v-toolbar-title>
        <v-btn>
          <span>Sign Out</span>
          <v-icon end icon="mdi-logout"></v-icon>
        </v-btn>
      </v-toolbar>

      <v-navigation-drawer v-model="burgerMenu" color="#e0e0e0">
        <v-list class="d-flex align-left flex-column mt-4 ml-6">

          <v-list-tile v-for="link in links" :key="link.text" class="mt-6">
            <router-link :to="link.route" class="link">
              <v-list-tile-action>
                <v-icon start>{{ link.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ link.text }}</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
          </v-list-tile>

        </v-list>
      </v-navigation-drawer>

    </nav>


    <v-container>
      <v-card class="d-flex align-center flex-column">
        <v-card-title>
          Coming Soon
        </v-card-title>
      </v-card>
    </v-container>
  </div>
</template>
  
<script>
import { defineComponent } from 'vue';


// Components

export default {
  data() {
    return {
      burgerMenu: false,
      links:
        [{ icon: 'mdi-archive', text: 'Parts List', route: '/' },
        { icon: 'mdi-account-multiple', text: 'Account', route: '/account' },
        { icon: 'mdi-archive-clock', text: 'Coming Soon', route: '/soonview' },
        ]
    };
  },
};


</script>

<style></style>