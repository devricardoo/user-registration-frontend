<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="ml-2 mt-2">
        <span class="headline">Editar Usuário</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col :cols="12" :md="6">
              <v-text-field
                label="Nome"
                v-model="user.name"
                required
                :rules="[(v) => !!v || 'Informe um nome']"
              />
            </v-col>

            <v-col :cols="12" :md="6">
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

            <v-col :cols="12" :md="6">
              <v-text-field
                label="Digite seu CPF"
                v-model="user.cpf"
                @input="formatCPF"
                maxlength="14"
                required
                :rules="[(v) => !!v || 'CPF é obrigatório']"
              />
            </v-col>

            <v-col :cols="12" md="6">
              <v-autocomplete
                v-model="user.profile"
                :items="profiles"
                item-value="value"
                item-title="text"
                label="Selecione o Perfil"
                required
                :rules="[(v) => !!v || 'Selecione um perfil']"
              />
            </v-col>

            <v-col :cols="12" :md="6">
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

            <v-col :cols="12" :md="6">
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

            <v-col :cols="12" :md="6">
              <v-text-field
                label="Logradouro"
                v-model="user.street"
                type="text"
              />
            </v-col>

            <v-col :cols="12" :md="6">
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
        <v-btn color="primary" @click="submitUser"> Atualizar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    userToEdit: Object,
    profiles: Array,
  },
  data() {
    return {
      user: {
        id: "",
        name: "",
        email: "",
        cpf: "",
        profile: "",
        street: "",
        cep: "",
        password: "",
        passwordConfirmation: "",
      },
      passwordVisible: false,
      passwordVisibleCF: false,
    };
  },
  watch: {
    userToEdit: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.user.id = newUser.id;
          this.user.name = newUser.name;
          this.user.email = newUser.email;
          this.user.cpf = newUser.cpf;
          this.user.profile = newUser.profile?.name || "";
          this.user.street = newUser.street;
          this.user.cep = newUser.cep;
        }
      },
    },
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
      this.$emit("update:modelValue", false);
      this.$emit("update-user", { ...this.user });
    },
    resetUser() {
      this.user = {
        id: "",
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
