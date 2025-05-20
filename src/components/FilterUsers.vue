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
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "FilterUsers",
  props: {
    modelValue: Boolean,
    profiles: Array,
  },
  data() {
    return {
      user: {
        name: "",
        cpf: "",
        email: "",
        startDate: "",
        endDate: "",
      },
      loading: false,
      formValid: false,
    };
  },
  methods: {
    searchUser() {
      this.loading = true;
      const { name, cpf, startDate, endDate } = this.user;
      const txt = [name, cpf, startDate, endDate].filter(Boolean).join(" ");

      if (!txt) {
        alert("Preencha ao menos um campo para realizar a pesquisa");
        return;
      }

      axios
        .get("http://localhost:8000/api/search", {
          params: {
            name: name || undefined,
            cpf: this.user.cpf.replace(/\D/g, "") || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const users = response.data.data;
          if (users.length === 0) {
            alert("Nenhum usuário encontrado.");
          } else {
            this.loading = false;
            this.$emit("search", users);
            console.log("Usuários encontrados:", users);
            this.$emit("update:modelValue", false);
          }
        })
        .catch((error) => {
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
