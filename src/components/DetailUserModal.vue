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
            <strong>Nome:</strong>
            <div>Ricardo</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>CPF:</strong>
            <div>645.443.444-44</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>E-mail:</strong>
            <div>ricardo@ricardo.com</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Perfil:</strong>
            <div>ADM</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Data de Cadastro:</strong>
            <div>19/10/2000</div>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <h4 class="mb-2">Endereço</h4>
        <v-row dense>
          <v-col cols="12" md="6">
            <strong>Logradouro:</strong>
            <div>Rua Vital Santos</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Bairro:</strong>
            <div>Brotas</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>Complemento:</strong>
            <div>Ap Edifício Bonina</div>
          </v-col>

          <v-col cols="12" md="6">
            <strong>CEP:</strong>
            <div>12345-678</div>
          </v-col>
        </v-row>
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
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
h4 {
  font-weight: 500;
}
</style>
