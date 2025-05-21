<template>
  <v-dialog :model-value="modelValue" max-width="400px">
    <v-card>
      <v-card-title class="ml-2 mt-2">
        <span class="ml-3">Pesquisar Usuário</span>
      </v-card-title>

      <v-card-text class="mb-5">
        <v-form ref="form" v-model="formValid">
          <v-row>
            <v-col>
              <v-text-field
                label="Nome"
                v-model="user.name"
                type="text"
                required
              />
              <v-text-field
                label="CPF"
                v-model="user.cpf"
                @input="formatCPF"
                type="text"
                maxlength="14"
                required
              />

              <v-text-field
                label="Inicio de cadastro"
                v-model="user.startDate"
                type="date"
                required
              />
              <v-text-field
                label="Fim de cadastro"
                v-model="user.endDate"
                type="date"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          @click="
            $emit('update:modelValue', false);
            this.$refs.form.reset();
          "
          >Cancelar</v-btn
        >
        <v-btn color="primary" :loading="loading" @click="searchUser"
          >Pesquisar</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-dialog>
</template>

<script>
import api from "@/services/api";

export default {
  name: "FilterUsers",
  props: {
    modelValue: Boolean,
    profiles: Array,
  },
  data() {
    return {
      formValid: false,
      loading: false,
      snackbar: {
        show: false,
        text: "",
        color: "info",
      },

      user: {
        name: "",
        cpf: "",
        email: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    showSnackbar(text, color = "info") {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    searchUser() {
      this.loading = true;
      const { name, cpf, startDate, endDate } = this.user;
      const hasFields = [name, cpf, startDate, endDate].some(Boolean);

      if (!hasFields) {
        this.showSnackbar(
          "Preencha ao menos um campo para realizar a pesquisa",
          "red",
        );
        this.loading = false;
        return;
      }

      api
        .get("http://localhost:8000/api/search", {
          params: {
            name: name || undefined,
            cpf: cpf.replace(/\D/g, "") || undefined,
            startDate,
            endDate,
          },
        })
        .then((response) => {
          const users = response.data.data;
          if (!users.length) {
            this.showSnackbar("Nenhum usuário encontrado.", "info");
          } else {
            this.$emit("search", users);
            this.$emit("update:modelValue", false);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    formatCPF() {
      let v = this.user.cpf.replace(/\D/g, "");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      this.user.cpf = v;
    },
  },
};
</script>
