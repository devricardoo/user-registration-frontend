<template>
  <v-app theme="light">
    <v-container>
      <v-card class="pa-5 mx-auto mt-16" max-width="400">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="E-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" block color="primary" :loading="loading"
              >Entrar</v-btn
            >
          </v-form>
        </v-card-text>
        <v-btn
          variant="text"
          style="font-size: 12px; margin-top: -12px"
          color="primary"
          >Esqueci minha senha</v-btn
        >
      </v-card>
    </v-container>

    <v-dialog
      v-model="dialogErro"
      max-width="300"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-text class="text-center mt-3">
          <v-icon color="red" size="30">mdi-alert-circle</v-icon>
          <p class="mt-4 text-body-2">{{ loginErro }}</p>
          <v-btn
            color="red"
            class="mt-2"
            variant="text"
            @click="dialogErro = false"
            >Fechar</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
//import auth from "@/services/auth";
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      loginErro: "",
      dialogErro: false,
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      axios
        .post("http://localhost:8000/api/auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          const token = response.data.token;

          localStorage.setItem("token", token);

          this.$router.push("/");
        })
        .catch((error) => {
          this.loading = false;

          if (error.response && error.response.status === 401) {
            this.loginErro =
              "Credenciais inválidas. Verifique o e-mail e senha.";
          } else {
            this.loginErro = "Erro ao conectar com o servidor.";
          }
          this.dialogErro = true;
        });
    },
  },
};
</script>
