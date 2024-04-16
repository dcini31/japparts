<template>
  <div class="teams">
    <nav>
      <v-toolbar>
        <v-app-bar-nav-icon variant="text" @click.stop="burgerMenu = !burgerMenu"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
          <span>Japparts</span>
        </v-toolbar-title>
        <div id="nav" v-if="$store.state.user">
          <v-btn @click="$store.dispatch('logout')">
            <span>Sign Out</span>
            <v-icon end icon="mdi-logout"></v-icon>
          </v-btn>
        </div>
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
          Edit Profile
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="user.displayEmail" label="Email"></v-text-field>
          <v-btn color="primary" @click="updateEmail">Update</v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { auth } from '@/firebase/firebaseConfig.js';
// Components

export default {
  data() {
    return {
      user: {
        displayEmail: '',
      },
      burgerMenu: false,
      links:
        [{ icon: 'mdi-archive', text: 'Parts List', route: '/' },
        { icon: 'mdi-account-multiple', text: 'Account', route: '/account' },
        { icon: 'mdi-archive-clock', text: 'View Parts', route: '/comingsoon' },
        ]
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        this.user.displayEmail = currentUser.email;
      }
    },
    updateEmail() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        this.user.displayEmail = '';
      };
    },
  },
};
</script>

<style scoped>
.user-profile {
  margin-top: 20px;
}
</style>