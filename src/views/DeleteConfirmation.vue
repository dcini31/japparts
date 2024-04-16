<template>
  <v-dialog v-model="showConfirmation" max-width="500px">
    <v-card>
      <v-card-title>Delete Part</v-card-title>
      <v-card-text>
        Are you sure you want to delete this part?
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="confirmDelete">Delete</v-btn>
        <v-btn color="error" @click="cancelDelete">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteConfirmation",
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showConfirmation: true,
    };
  },
  methods: {
    confirmDelete() {
      this.$emit("confirm-delete", this.part);
      this.showConfirmation = false;
    },
    cancelDelete() {
      this.$emit("cancel-delete");
      this.showConfirmation = false;
    },
  },
};
</script>