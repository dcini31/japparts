<template>
  <div class="parts">
    <nav>
      <v-toolbar>
        <v-app-bar-nav-icon variant="text" @click.stop="burgerMenu = !burgerMenu"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline text-uppercase">
          <span>Japparts</span>
        </v-toolbar-title>
        <v-btn @click="showForm = true">
          <span>Add Part</span>
          <v-icon end icon="mdi-plus"></v-icon>
        </v-btn>
        <div id="nav" v-if="$store.state.user">
          <v-btn @click="$store.dispatch('logout')">
            <span>Sign Out</span>
            <v-icon end icon="mdi-logout"></v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <v-navigation-drawer v-model="burgerMenu" color="#e0e0e0">
        <v-list class="d-flex align-left flex-column mt-4 ml-6">
          <v-list-tile v-for="link in links" :key="link.text" class="mt-6">
            {{ parts.content }}

            <router-link :to="link.route" class="link">
              <v-list-tile-action>
                <v-icon start>{{ link.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ link.text }}</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </nav>

    <v-container>
      <v-table>
        <v-card class="d-flex align-center flex-column">
          <v-card-title>Parts List</v-card-title>
          <transition-group name="fade" tag="div" class="parts-list">
            <transition-group name="fade-in-list" tag="div" appear>
              <PartsCard v-for="part in parts.slice(startIndex, endIndex)" :key="part.id" :part="part"
                @delete-part="deletePart" @update-part="updatePart" class="fade-item" />
            </transition-group>
          </transition-group>
          <v-pagination v-model="page" :length="totalPages">
            <router-link id="prev" :to="{ name: 'PartList', query: { page: page - 1 } }" v-if="page != 1">
              Prev Page
            </router-link>
            <router-link id="next" :to="{ name: 'PartList', query: { page: page + 1 } }" v-if="hasNextPage != 1">
              Next Page
            </router-link>
          </v-pagination>
        </v-card>
      </v-table>
      <v-dialog v-model="showForm" max-width="500px">
        <v-card>
          <v-card-title>Add Part</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addPart">
              <v-text-field @blur="v$.manufacturer.$touch()" v-model.trim="manufacturer"
                :error-messages="v$.manufacturer.$errors.map(e => e.$message)" label="Manufacturer"
                type="text"></v-text-field>
              <v-text-field @blur="v$.partNumber.$touch()" v-model.trim="partNumber"
                :error-messages="v$.partNumber.$errors.map(e => e.$message)" label="Part Number" type="numeric">
              </v-text-field>
              <v-text-field @blur="v$.name.$touch()" v-model.trim="name" label="Name" type="text"
                :error-messages="v$.name.$errors.map(e => e.$message)">
              </v-text-field>
              <v-text-field @blur="v$.price.$touch()" v-model.trim="price" label="Price" type="numeric"
                :error-messages="v$?.price?.$errors.map(e => e.$message)">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="v$.$invalid || !manufacturer || !partNumber || !name || !price"
              @click="addPart(manufacturer, partNumber, name, price)" type="submit">Confirm</v-btn>
            <v-btn color="error" @click="cancelForm">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { onBeforeMount, defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';

import PartsCard from '../components/PartsCard.vue';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';
import useVuelidate from "@vuelidate/core";
import { required, numeric, minLength, maxLength } from 'vuelidate/lib/validators';

const v$ = useVuelidate();

export default defineComponent({
  name: 'PartsView',
  components: {
    PartsCard,
  },
  setup() {
    const store = useStore()
    const addPartRef = ref(null);


    onBeforeMount(() => {
      store.dispatch('fetchUser')
    })
    const parts = ref([]);
    const manufacturer = ref('');
    const partNumber = ref('');
    const name = ref('');
    const price = ref('');
    const showForm = ref(false);
    const editMode = ref(false);
    const editPartData = ref(null);
    const burgerMenu = ref(false);
    const page = ref(1);
    const itemsPerPage = 4;
    const startIndex = computed(() => (page.value - 1) * itemsPerPage);
    const endIndex = computed(() => startIndex.value + itemsPerPage);
    const totalPages = computed(() => Math.ceil(parts.value.length / itemsPerPage));
    const links = ref([
      { icon: 'mdi-archive', text: 'Parts List', route: '/' },
      { icon: 'mdi-account-multiple', text: 'Account', route: '/account' },
      { icon: 'mdi-archive-clock', text: 'Parts List', route: '/comingsoon' },
    ]);

    const addPart = () => {
      const newPart = {
        manufacturer: manufacturer.value,
        partNumber: partNumber.value,
        name: name.value,
        price: price.value,
      };

      addPartRef.value = addPart;

      addDoc(collection(db, 'parts'), newPart)
        .then(() => {
          resetForm();
          showForm.value = false;
        })
        .catch((error) => {
          console.error('Error adding part:', error);
        });
    };


    const savePart = (updatedPart) => {
      const partRef = doc(db, 'parts', updatedPart.id);
      return updateDoc(partRef, updatedPart)
        .then(() => {
          console.log('Part updated successfully');
        })
        .catch((error) => {
          console.error('Error updating part:', error);
        });
    };

    const editPart = (part) => {
      editMode.value = true;
      editPartData.value = part;
      manufacturer.value = part.manufacturer;
      partNumber.value = part.partNumber;
      name.value = part.name;
      price.value = part.price;
      showForm.value = true;
      savePart = part.id;
    };

    const updatePart = () => {
      if (editPartData.value) {
        const partRef = doc(db, 'parts', editPartData.value.id);
        const updatedPart = {
          manufacturer: manufacturer.value,
          partNumber: partNumber.value,
          name: name.value,
          price: price.value,
        };

        updateDoc(partRef, updatedPart)
          .then(() => {
            const index = parts.value.findIndex((part) => part.id === editPartData.value.id);
            if (index !== -1) {
              parts.value[index] = updatedPart;
            }
            savePart(updatedPart);

            resetForm();
            showForm.value = false;
          })
          .catch((error) => {
            console.error('Error updating part:', error);
          });
      }
    };

    const deletePart = (partId) => {
      deleteDoc(doc(db, 'parts', partId))
        .then(() => {
          parts.value = parts.value.filter(part => part.id !== partId);
        })
        .catch((error) => {
          console.error('Error deleting part:', error);
        });
    };

    const cancelForm = () => {
      resetForm();
      showForm.value = false;
    };

    const resetForm = () => {
      editMode.value = false;
      editPartData.value = null;
      manufacturer.value = '';
      partNumber.value = '';
      name.value = '';
      price.value = '';
    };

    onMounted(() => {
      onSnapshot(collection(db, 'parts'), (querySnapshot) => {
        const fbParts = [];
        querySnapshot.forEach((doc) => {
          const part = {
            id: doc.id,
            manufacturer: doc.data().manufacturer,
            partNumber: doc.data().partNumber,
            price: doc.data().price,
            inStock: doc.data().inStock,
            name: doc.data().name,
          };
          fbParts.push(part);
        });
        parts.value = fbParts;
      });
    });

    return {
      parts,
      manufacturer,
      partNumber,
      name,
      price,
      showForm,
      editMode,
      editPartData,
      cancelForm,
      burgerMenu,
      links,
      addPart,
      editPart,
      deletePart,
      updatePart,
      updatePart: savePart,
      page,
      startIndex,
      endIndex,
      totalPages,
      activePart: null,
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      manufacturer: '',
      partNumber: '',
      name: '',
      price: '',
    };
  },

  validations() {
    return {
      manufacturer: { required, minLength: minLength(2), maxLength: maxLength(18) },
      partNumber: { required, numeric, minLength: minLength(6), maxLength: maxLength(20) },
      name: { required, maxLength: maxLength(40) },
      price: { required, numeric },
    }
  },

  methods: {
    success() {

      alert('Successfully added part');
      if (!v$.$invalid) {
        addPartRef.value();
      }
    },
    formIsInvalid() {
      return this.$v.$invalid
    },
    signOut() {
      this.$router.push('/registration');
    }
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active,
.fade-in-list-enter-active,
.fade-in-list-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to,
.fade-in-list-enter,
.fade-in-list-leave-to {
  opacity: 0;
}

.fade-in-list-move {
  transition: transform 0.5s;
}

.fade-item {
  will-change: transform;
}

.fade-item.fade-in-list-enter {
  transform: translateY(30px);
}

.fade-item.fade-in-list-leave-to {
  transform: translateY(-30px);
}
</style>