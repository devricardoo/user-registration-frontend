<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Detalhes do Usuário</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <strong>Data de Cadastro:</strong>
            <div>
              {{
                user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : " - "
              }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Nome:</strong>
            <div>{{ user.name || " - " }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>CPF:</strong>
            <div>{{ formatCPF(user.cpf) || " - " }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>E-mail:</strong>
            <div>{{ user.email || " - " }}</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Perfil:</strong>
            <div>
              {{
                user.profile && user.profile.name ? user.profile.name : " - "
              }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div v-if="user.addresses && user.addresses.length">
          <div
            v-for="(address, index) in user.addresses"
            :key="index"
            class="mb-4"
          >
            <v-divider class="my-4" v-if="index > 0" />
            <h3 class="mb-2">Endereço {{ index + 1 }}</h3>
            <v-row dense>
              <v-col cols="12" md="6">
                <strong>Logradouro:</strong>
                <div>{{ address.public_place || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>CEP:</strong>
                <div>{{ formatCEP(address.cep) || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>Bairro:</strong>
                <div>{{ address.neighborhood || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>Cidade:</strong>
                <div>{{ address.city || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>Estado:</strong>
                <div>{{ address.state || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>Número:</strong>
                <div>{{ address.number || " - " }}</div>
              </v-col>

              <v-col cols="12" md="6">
                <strong>Complemento:</strong>
                <div>{{ address.complement || " - " }}</div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text color="primary" @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DetailUserModal",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    formatCPF(cpf) {
      if (!cpf || typeof cpf !== "string") return "";
      const cleaned = cpf.replace(/\D/g, "");
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },
    formatCEP(cep) {
      if (!cep || typeof cep !== "string") return "";
      const cleaned = cep.replace(/\D/g, "");
      return cleaned.length > 5
        ? cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8)
        : cleaned;
    },
  },
  watch: {
    user(newVal) {
      console.log("Usuário detalhado mudou:", newVal);
    },
  },
};
</script>

<style scoped>
h4 {
  font-weight: 500;
}
</style>
