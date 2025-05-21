<template>
  <v-dialog v-model="internalDialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>Deseja realmente excluir o endereço?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel">Cancelar</v-btn>
        <v-btn color="red" text @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Confirmação",
    },
  },
  emits: ["update:modelValue", "confirm"],
  computed: {
    internalDialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    cancel() {
      this.internalDialog = false;
    },
    confirm() {
      this.$emit("confirm");
      this.internalDialog = false;
    },
  },
};
</script>
