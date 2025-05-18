<template>
  <v-dialog :model-value="modelValue" max-width="400px">
    <v-card>
      <v-card-title class="ml-2 mt-2">
        <span class="ml-3">Pesquisar Usuário</span>
      </v-card-title>

      <v-card-text class="mb-5">
        <v-form ref="form">
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
                type="text"
                required
              />

              <v-text-field
                label="Inicio de cadastro"
                v-model="user.period"
                type="date"
                required
              />
              <v-text-field
                label="Fim de cadastro"
                v-model="user.period"
                type="date"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="primary" @click="searchUser">Pesquisar</v-btn>
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
        email: "",
        cpf: "",
      },
      formValid: false,
    };
  },
  methods: {
    searchUser() {
      console.log("Oi");
    },
  },
};
</script>
