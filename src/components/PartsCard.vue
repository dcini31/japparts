<template>
    <v-card class="part-card" outlined min-width="300">
      <v-card-title>Manufacturer: {{ part.manufacturer }}</v-card-title>
      <v-card-text>
        <div>Part Number: {{ part.partNumber }}</div>
        <div>Name: {{ part.name }}</div>
        <div>Price: {{ part.price }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ma-2" color="primary" @click="editPart()">
          Edit
          <v-icon end icon="mdi-pencil"></v-icon>
        </v-btn>
        <v-btn class="ma-2" color="red" @click="showDeleteConfirmation(part)">
          Delete
          <v-icon end icon="mdi-delete"></v-icon>
        </v-btn>
      </v-card-actions>
      <v-divider v-if="editing" class="mt-2"></v-divider>
      <v-form v-if="editing" class="pa-4">
        <v-text-field v-model="editedPart.manufacturer" label="Manufacturer"></v-text-field>
        <v-text-field v-model="editedPart.partNumber" label="Part Number"></v-text-field>
        <v-text-field v-model="editedPart.name" label="Name"></v-text-field>
        <v-text-field v-model="editedPart.price" label="Price"></v-text-field>
        <v-btn class="ma-2" color="primary" @click="updatePart">
          Save
          <v-icon end icon="mdi-content-save"></v-icon>
        </v-btn>
        <v-btn class="ma-2" color="red" @click="cancelEdit">
          Cancel
          <v-icon end icon="mdi-close"></v-icon>
        </v-btn>
      </v-form>
      <transition name="fade" mode="out-in">
        <delete-confirmation v-if="showDelete" :part="part" @confirm-delete="deletePart" @cancel-delete="hideDeleteConfirmation"></delete-confirmation>
      </transition>
    </v-card>
  </template>
  
  <script>
  import DeleteConfirmation from '../views/DeleteConfirmation.vue';

  export default {

    name: "PartsCard",
    components: {
    DeleteConfirmation
  },
    props: {
      part: Object
    },
    data() {
      return {
        editing: false,
        showDelete: false,
        editedPart: {
          manufacturer: "",
          partNumber: "",
          name: "",
          price: ""
        }
      };
    },
    methods: {
      editPart() {
        this.editing = true;
        this.editedPart = {
            manufacturer: this.part.manufacturer,
            partNumber: this.part.partNumber,
            name: this.part.name,
            price: this.part.price
        };
      },

      updatePart() {
        this.$emit("update-part", {
            id: this.part.id,
            manufacturer: this.editedPart.manufacturer,
            partNumber: this.editedPart.partNumber,
            name: this.editedPart.name,
            price: this.editedPart.price
        });
        this.editing = false;
       },

      cancelEdit() {
        this.editing = false;
      },

        showDeleteConfirmation(part) {
            this.showDelete = true;
            this.partToDelete = part;
        },

        hideDeleteConfirmation() {
        this.showDelete = false;
        this.partToDelete = null;
        },

        deletePart() {
            this.$emit("delete-part", this.part.id);
            this.hideDeleteConfirmation();
        },
    }
  };
  </script>
  
  <style scoped>
  .part-card {
    max-width: 300px;
    margin-bottom: 20px;
  }
  
  </style>