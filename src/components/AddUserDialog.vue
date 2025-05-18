<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="560px"
    height="400"
  >
    <v-card>
      <v-card-title class="ml-2 mt-2">
        <span class="headline">Adicionar Novo Usuário</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                label="Nome"
                v-model="user.name"
                type="text"
                required
                :rules="[(v) => !!v || 'Informe um nome']"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Digite seu CPF"
                v-model="user.cpf"
                @input="formatCPF"
                maxlength="14"
                required
                :rules="[(v) => !!v || 'CPF é obrigatório']"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="user.profile"
                :items="profiles"
                item-value="value"
                item-title="text"
                label="Selecione o Perfil"
                density="compact"
                required
                :rules="[(v) => !!v || 'Selecione um perfil']"
              >
                <template v-slot:prepend-inner>
                  <div class="v-input__control" style="height: 58px"></div>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="E-mail"
                v-model="user.email"
                type="email"
                required
                :rules="[
                  (v) => !!v || 'E-mail é obrigatório',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                ]"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Senha"
                v-model="user.password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :rules="[
                  (v) => !!v || 'Senha é obrigatória',
                  (v) =>
                    v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres',
                ]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="passwordVisible = !passwordVisible">{{
                    passwordVisible ? "mdi-eye-off" : "mdi-eye"
                  }}</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Confirme a Senha"
                v-model="user.passwordConfirmation"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :rules="[
                  (v) => !!v || 'Confirmação de senha é obrigatória',
                  (v) => v === user.password || 'As senhas não coincidem',
                ]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="passwordVisibleCF = !passwordVisibleCF">{{
                    passwordVisibleCF ? "mdi-eye-off" : "mdi-eye"
                  }}</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Logradouro"
                v-model="user.street"
                type="text"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="CEP"
                v-model="user.cep"
                maxlength="9"
                @input="formatCEP"
                type="text"
                :rules="[(v) => !!v || 'CEP é obrigatório']"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="$emit('update:modelValue', false)">Cancelar</v-btn>
        <v-btn color="primary" @click="submitUser" :disabled="!formValid"
          >Adicionar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "AddUserDialog",
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
        profile: "",
        street: "",
        cep: "",
        password: "",
        passwordConfirmation: "",
      },
      formValid: false,
      passwordVisible: false,
      passwordVisibleCF: false,
    };
  },
  methods: {
    formatCPF() {
      let cpf = this.user.cpf.replace(/\D/g, "");
      if (cpf.length <= 11) {
        this.user.cpf = cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          "$1.$2.$3-$4",
        );
      }
    },
    formatCEP() {
      let cep = this.user.cep.replace(/\D/g, "");
      if (cep.length > 5) {
        this.user.cep = cep.slice(0, 5) + "-" + cep.slice(5, 8);
      } else {
        this.user.cep = cep;
      }
    },
    submitUser() {
      const token = localStorage.getItem("token");
      axios
        .post("http://localhost:8000/api/user", this.user, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          this.$emit("update:modelValue", false);
          this.resetForm();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    resetForm() {
      this.user = {
        name: "",
        email: "",
        cpf: "",
        profile: "",
        street: "",
        cep: "",
        password: "",
        passwordConfirmation: "",
      };
    },
  },
};
</script>
