<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    max-width="560px"
  >
    <v-card flat class="pa-6">
      <h2 class="text-center text-primary text-h5 font-weight-bold mb-6">
        Cadastro de Usuário
      </h2>

      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-card class="pa-4 mb-6" elevation="0" color="#eaf2ff">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">
            Informações do Usuário
          </h3>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                label="Nome"
                v-model="user.name"
                type="text"
                required
                :rules="[rules.required]"
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
                v-model="user.profile_id"
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
                :rules="[rules.email]"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Senha"
                v-model="user.password"
                :type="passwordVisible ? 'text' : 'password'"
                required
                :rules="[rules.required, rules.passwordMin]"
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
                v-model="user.password_confirmation"
                :type="passwordVisibleCF ? 'text' : 'password'"
                required
                :rules="[rules.required, rules.confirmPassword]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="passwordVisibleCF = !passwordVisibleCF">{{
                    passwordVisibleCF ? "mdi-eye-off" : "mdi-eye"
                  }}</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Addresses -->
        <div>
          <h3 class="text-subtitle-1 font-weight-bold text-primary mb-2">
            Endereços
          </h3>

          <v-btn class="add-address-btn mb-4" @click="addAddress">
            + Adicionar Endereço
          </v-btn>

          <div class="mb-6" v-for="(address, index) in addresses" :key="index">
            <v-card class="pa-4 mb-4 address-card" elevation="0">
              <h4 class="text-body-1 font-weight-bold mb-4">
                Endereço {{ index + 1 }}
              </h4>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Rua *"
                    v-model="address.public_place"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Número *"
                    v-model="address.number"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Bairro *"
                    v-model="address.neighborhood"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Cidade *"
                    v-model="address.city"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Estado *"
                    v-model="address.state"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="CEP *"
                    v-model="address.cep"
                    @input="formatCEP(index)"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="custom-input"
                    label="Complemento"
                    v-model="address.complement"
                  />
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>

        <div class="d-flex justify-end mt-4">
          <v-btn
            color="error"
            small
            class="mr-2"
            @click="
              () => {
                resetForm();
                $emit('update:modelValue', false);
              }
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="primary" small :loading="loading" @click="submitForm">
            Adicionar
          </v-btn>
        </div>
      </v-form>
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
      rules: {
        required: (v) => !!v || "Campo obrigatório",
        email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
        passwordMin: (v) =>
          v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
        confirmPassword: (v) =>
          v === this.user.password || "As senhas não coincidem",
      },
      formValid: false,
      loading: false,
      passwordVisible: false,
      passwordVisibleCF: false,
      user: {
        name: "",
        email: "",
        cpf: "",
        profile_id: "",
        password: "",
        password_confirmation: "",
      },
      addresses: [
        {
          public_place: "",
          cep: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          complement: "",
        },
      ],
    };
  },
  methods: {
    // Form helpers
    getUserPayload() {
      const cleanCPF = this.user.cpf.replace(/\D/g, "");
      return {
        ...this.user,
        cpf: cleanCPF,
        addresses: this.addresses.map((addr) => ({
          ...addr,
          cep: addr.cep.replace(/\D/g, ""),
        })),
      };
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        const payload = this.getUserPayload();
        axios
          .post("http://localhost:8000/api/user", payload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            this.loading = false;
            this.resetForm();
            this.$emit("update:modelValue", false);
            this.$emit("userAdded", response.data);
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    resetForm() {
      this.user = {
        name: "",
        email: "",
        cpf: "",
        profile_id: "",
        password: "",
        password_confirmation: "",
      };

      this.addresses = [
        {
          public_place: "",
          cep: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          complement: "",
        },
      ];

      if (this.$refs.form) this.$refs.form.resetValidation();
    },
    // Format helpers
    formatCPF() {
      let v = this.user.cpf.replace(/\D/g, "");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      this.user.cpf = v;
    },

    formatCEP(index) {
      let cep = this.addresses[index].cep.replace(/\D/g, "");
      if (cep.length > 5) {
        cep = cep.slice(0, 5) + "-" + cep.slice(5, 8);
      }
      this.addresses[index].cep = cep;
    },
    //Address helpers
    addAddress() {
      this.addresses.push({
        public_place: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        cep: "",
        complement: "",
      });
    },
  },
};
</script>

<style scoped>
.custom-input .v-input__control {
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  transition:
    box-shadow 0.2s,
    border 0.2s;
  border: 1px solid #cbd5e0;
}

.custom-input input {
  font-size: 16px;
  padding: 10px;
}

.custom-input .v-input--is-focused .v-input__control {
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
  border-color: #2196f3;
}

.address-card {
  background-color: #f8f9fb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
}

.add-address-btn {
  background-color: #28a745;
  color: #fff;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
}

.cancel-btn {
  background-color: #dc3545;
  color: #fff;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
}

.add-btn {
  background-color: #28a745;
  color: #fff;
  border-radius: 8px;
  text-transform: none;
  font-weight: bold;
}
</style>
