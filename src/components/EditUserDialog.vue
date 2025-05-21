<template>
  <v-dialog
    :model-value="modelValue"
    @update:modelValue="handleDialogUpdate"
    max-width="560px"
  >
    <v-card flat class="pa-6">
      <h2 class="text-center text-primary text-h5 font-weight-bold mb-6">
        Edição de Usuário
      </h2>

      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-card class="pa-4 mb-6" elevation="0" color="#eaf2ff">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">
            Informações do Usuário
          </h3>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nome"
                v-model="user.name"
                type="text"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Digite seu CPF"
                v-model="user.cpf"
                @input="formatCPF"
                maxlength="14"
                required
                :rules="[(v) => !!v || 'CPF é obrigatório']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="user.profile_id"
                :items="profiles"
                item-value="value"
                item-title="text"
                label="Selecione o Perfil"
                required
                :rules="[(v) => !!v || 'Selecione um perfil']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="E-mail"
                v-model="user.email"
                type="email"
                required
                :rules="[rules.email]"
              />
            </v-col>

            <v-col cols="12" md="12">
              <v-btn
                class="mb-4"
                color="primary"
                @click="showPasswordFields = !showPasswordFields"
              >
                {{ showPasswordFields ? "Fechar" : "Alterar Senha" }}
              </v-btn>
            </v-col>

            <v-col v-if="showPasswordFields" cols="12" md="6">
              <v-text-field
                label="Senha"
                v-model="user.password"
                :type="passwordVisible ? 'text' : 'password'"
                :rules="[rules.passwordMin]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="passwordVisible = !passwordVisible">
                    {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col v-if="showPasswordFields" cols="12" md="6">
              <v-text-field
                label="Confirme a Senha"
                v-model="user.password_confirmation"
                :type="passwordVisibleCF ? 'text' : 'password'"
                :rules="[rules.confirmPassword]"
              >
                <template v-slot:append-inner>
                  <v-icon @click="passwordVisibleCF = !passwordVisibleCF">
                    {{ passwordVisibleCF ? "mdi-eye-off" : "mdi-eye" }}
                  </v-icon>
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

          <div
            class="mb-6"
            v-for="(address, index) in addresses"
            :key="`address-${index}`"
          >
            <v-card class="pa-4 mb-4" elevation="0">
              <h4 class="text-body-1 font-weight-bold mb-4">
                Endereço {{ index + 1 }}
              </h4>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field label="Rua *" v-model="address.public_place" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Número *" v-model="address.number" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Bairro *"
                    v-model="address.neighborhood"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Cidade *" v-model="address.city" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field label="Estado *" v-model="address.state" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="CEP *"
                    v-model="address.cep"
                    @input="formatCEP(index)"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
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
          <v-btn color="primary" small :loading="loading" @click="editUser">
            Salvar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/services/api";
import { id } from "vuetify/locale";

export default {
  props: {
    modelValue: Boolean,
    userToEdit: Object,
    profiles: Array,
  },
  data() {
    return {
      formValid: true,
      loading: false,
      passwordVisible: false,
      passwordVisibleCF: false,
      showPasswordFields: false,
      addresses: [
        {
          public_place: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          cep: "",
          complement: "",
        },
      ],
      user: {
        id: null,
        name: "",
        email: "",
        cpf: "",
        profile_id: "",
        password: "",
        password_confirmation: "",
      },
      rules: {
        required: (v) => !!v || "Campo obrigatório",
        email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
        passwordMin: (v) =>
          !v || v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
        confirmPassword: (v) =>
          !this.user.password ||
          v === this.user.password ||
          "As senhas não coincidem",
      },
    };
  },
  watch: {
    userToEdit: {
      handler(newVal) {
        if (this.modelValue && newVal) {
          this.initializeFormData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleUpdateUser(updatedUser) {
      this.selectedUser = { ...updatedUser };
      const idx = this.users.findIndex((u) => u.id === updatedUser.id);
      if (idx !== -1) {
        this.users.splice(idx, 1, updatedUser);
      }
    },
    confirmPasswordRule() {
      return (v) => v === this.user.password || "As senhas não coincidem";
    },
    handleDialogUpdate(val) {
      this.$emit("update:modelValue", val);
    },
    initializeFormData() {
      if (this.userToEdit) {
        this.user = {
          id: this.userToEdit.id || null,
          name: this.userToEdit.name || "",
          email: this.userToEdit.email || "",
          cpf: this.formatLoadedCPF(this.userToEdit.cpf) || "",
          profile_id: this.userToEdit.profile_id || "",
          password: "",
          password_confirmation: "",
        };

        this.addresses =
          this.userToEdit.addresses?.length > 0
            ? this.userToEdit.addresses.map((addr) => ({
                id: addr.id || null,
                public_place: addr.public_place || "",
                number: addr.number || "",
                neighborhood: addr.neighborhood || "",
                city: addr.city || "",
                state: addr.state || "",
                cep: this.formatLoadedCEP(addr.cep || ""),
                complement: addr.complement || "",
              }))
            : [
                {
                  public_place: "",
                  number: "",
                  neighborhood: "",
                  city: "",
                  state: "",
                  cep: "",
                  complement: "",
                },
              ];
      }
    },
    formatLoadedCPF(cpf) {
      let v = cpf.replace(/\D/g, "");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
      return v;
    },
    formatLoadedCEP(cep) {
      const cleaned = cep.replace(/\D/g, "");
      return cleaned.length > 5
        ? cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8)
        : cleaned;
    },
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

      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        api
          .get(`http://localhost:8000/api/address/cep/${cleanCep}`)
          .then((response) => {
            const data = response.data;
            this.addresses[index] = {
              public_place: data.public_place || "",
              neighborhood: data.neighborhood || "",
              city: data.city || "",
              state: data.state || "",
              number: data.number || "",
              cep: data.cep || "",
              complement: data.complement || "",
            };
          })
          .catch((error) => {
            console.log("CEP não encontrado:", error);
            // Opcional: limpar os campos se o CEP não for encontrado
            this.addresses[index].public_place = "";
            this.addresses[index].neighborhood = "";
            this.addresses[index].city = "";
            this.addresses[index].state = "";
            this.addresses[index].number = "";
            this.addresses[index].complement = "";
          });
      }
    },
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
    resetForm() {
      this.user = {
        id: null,
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
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          cep: "",
          complement: "",
        },
      ];
    },
    editUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        const payload = {
          ...this.user,
          cpf: this.user.cpf.replace(/\D/g, ""),
          addresses: this.addresses.map((addr) => ({
            ...addr,
            id: addr.id,
            cep: addr.cep.replace(/\D/g, ""),
          })),
        };

        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }

        api
          .patch(`http://localhost:8000/api/user/${this.user.id}`, payload)
          .then((response) => {
            this.$emit("update-user", response.data);
            console.log(response.data);
            this.$emit("update:modelValue", false);
            this.loading = false;
            this.resetForm();
          })
          .catch((error) => {
            this.loading = false;
            // aqui você pode tratar os erros, por exemplo:
            if (error.response && error.response.data) {
              console.log("Erros de validação:", error.response.data);
              alert("Erro ao salvar: " + JSON.stringify(error.response.data));
            } else {
              alert("Erro inesperado ao salvar usuário.");
            }
          });
      }
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
