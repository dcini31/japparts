<template>
  <div class="container">
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card class="form-card" elevation="2">
          <v-card-title class="form-card-title">Register</v-card-title>
          <v-card-text class="form-card-text">
            <v-form class="register" @submit.prevent="register">
              <v-text-field v-model="registerForm.email" label="Email"></v-text-field>
              <v-text-field v-model="registerForm.password" label="Password" type="password"></v-text-field>
              <v-btn color="primary" type="submit">Register</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <div class="divider"></div>
        <div class="text-center divider-text">or login if you have an account</div>
        <div class="divider"></div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card class="form-card" elevation="2">
          <v-card-title class="form-card-title">Login</v-card-title>
          <v-card-text class="form-card-text">
            <v-form class="login" @submit.prevent="login"><!---->
              <v-text-field v-model="loginForm.email" label="Email"></v-text-field>
              <v-text-field v-model="loginForm.password" label="Password" type="password"></v-text-field>
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const registerForm = ref({});
    const loginForm = ref({});
    const store = useStore();

    const login = () => {
      store.dispatch('login', loginForm.value);
    }

    const register = () => {
      store.dispatch('register', registerForm.value);
    }

    return {
      loginForm,
      registerForm,
      login,
      register,
    }
  },

  methods: {
    registerUser() {

      console.log('Register:', this.registerForm);

      this.registerForm.email = '';
      this.registerForm.password = '';
    },
    loginUser() {

      console.log('Login:', this.loginForm);

      this.loginForm.email = '';
      this.loginForm.password = '';
    },
  },
};
</script>

<style>
.container {
  width: 100%;
  padding: 20px;
}

.form-card {
  border-radius: 8px;
}

.form-card-title {
  font-size: 24px;
  line-height: 2;
  padding-bottom: 16px;
}

.form-card-text {
  padding-top: 16px;
}

.divider {
  width: 100%;
  border-top: 1px solid #ccc;
  margin-top: 16px;
  margin-bottom: 16px;
}

.divider-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}
</style>