<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title class="text-h5 ml-2"> Confirmar exclusão </v-card-title>

        <v-card-text>
          Deseja realmente excluir o usuário <strong>{{ user.name }}?</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="error" @click="confirmDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  props: {
    modelValue: Boolean,
    user: Object,
  },
  emits: ["update:modelValue", "confirm-delete"],
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
    async confirmDelete() {
      try {
        const response = await api.delete(
          `http://localhost:8000/api/user/${this.user.id}`,
        );
        this.$emit("confirm-delete", response.data);
      } catch (error) {
        if (error.response?.data) {
          console.error("Erro ao excluir usuário:", error.response.data);
        }
      } finally {
        this.closeDialog();
      }
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>
