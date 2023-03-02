<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text color="white">
        <v-toolbar-title>Productos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on"
              ><v-icon>add</v-icon> Nuevo</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="name" label="Nombre"> </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="code" label="Código"> </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                      v-model="categoryId"
                      :items="categories"
                      label="Categoría"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field type="number" v-model="stock" label="Stock">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="price" label="Precio venta">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text>
                      <div class="red--text">
                        {{ validationError }}
                      </div></v-text
                    ></v-flex
                  >
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAction == 1"
              >Activar Item</v-card-title
            >
            <v-card-title class="headline" v-if="adAction == 0"
              >Desctivar Item</v-card-title
            >
            <v-card-text>
              Estás a punto de <span v-if="adAction">ACTIVAR</span
              ><span v-if="!adAction">DESACTIVAR</span> el artículo
              {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="close">Cancelar</v-btn>
              <v-btn
                v-if="adAction == 1"
                color="orange darken-4"
                @click="activar"
                text
                >Activar</v-btn
              >
              <v-btn
                v-if="adAction == 0"
                color="orange darken-4"
                text
                @click="desactivar"
                >Desctivar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogDelete"
          transition="dialog-top-transition"
          max-width="500"
          max-heigth="200"
        >
        </v-dialog>
      </v-toolbar>

      <v-alert
        v-model="alertSuccess"
        border="left"
        elevation="1"
        :type="typeAlert"
      >
        {{ alertText }}
      </v-alert>

      <v-data-table
        :headers="headers"
        :items="articles"
        :search="search"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
          <!--<v-icon small class="mr-2" @click="deleteItem(item)"> delete </v-icon>-->
          <template v-if="item.state">
            <v-icon small class="mr-2" @click="actDesactItem(0, item)">
              block
            </v-icon>
          </template>
          <template v-else>
            <v-icon small class="mr-2" @click="actDesactItem(1, item)">
              check
            </v-icon>
          </template>
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <div v-if="item.state"><span class="blue--text">Activo</span></div>
          <div v-else><span class="red--text">Inactivo</span></div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    validationError: "",
    search: "",
    alertSuccess: false,
    typeAlert: "",
    alertText: "",
    headers: [
      { text: "Acciones", value: "actions", sortable: false },
      { text: "Nombre", value: "name" },
      { text: "Codigo", value: "code" },
      { text: "Precio", value: "price", sortable: false },
      { text: "Stock", value: "stock", sortable: true },
      { text: "Categoría", value: "category.name" },
      { text: "Estado", value: "state", sortable: false },
    ],
    categories: [],
    articles: [],
    editedIndex: -1,

    _id: "",
    name: "",
    stock: "",
    price: "",
    categoryId: "",
    code: "",

    adModal: 0,
    adAction: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectCategoria();
  },

  methods: {
    selectCategoria() {
      let me = this;
      let categoriaArray = [];
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("categories/list", conf)
        .then((response) => {
          categoriaArray = response.data;
          categoriaArray.map(function (x) {
            me.categories.push({ text: x.name, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("articles/list", conf)
        .then((res) => {
          this.articles = res.data;
        })
        .catch((err) => console.log(err));
    },
    save() {
      if (this.editedIndex > -1) {
        //editar
        let header = { token: this.$store.state.token };
        let conf = { headers: header, params: { id: this._id } };
        axios
          .put(
            "articles/update",
            {
              name: this.name,
              stock: this.stock,
              code: this.code,
              price: this.price,
              category: this.categoryId,
            },
            conf
          )
          .then((res) => {
            this.limpiar();
            this.close();
            this.listar();
          })
          .catch((err) => {
            this.validationError = err.response.data.message;
          });
      } else {
        //guardar

        let header = { token: this.$store.state.token };
        let conf = { headers: header };
        axios
          .post(
            "articles/add",
            {
              name: this.name,
              stock: this.stock,
              code: this.code,
              price: this.price,
              category: this.categoryId,
            },
            conf
          )
          .then((res) => {
            this.limpiar();
            this.close();
            this.listar();
            this.typeAlert = "success";
            this.alertText = "Producto registrado con éxito";
            this.alertSuccess = true;
            setTimeout(() => {
              this.alertSuccess = false;
            }, 3000);
          })
          .catch((err) => {
            this.validationError = err.response.data.message;
          });
      }
    },
    deleteCategoria() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header, params: { _id: this._id } };
      axios
        .delete("categories/remove", conf)
        .then((res) => {
          console.log(res.data);
          this.close();
          this.limpiar();
          this.listar();
        })
        .catch((err) => {});
    },
    limpiar() {
      this._id = null;
      this.name = "";
      this.stock = "";
      this.price = "";
      this.code = "";

      this.categoryId = "";
      this.adNombre = "";
      this.adAction = 0;
      this.adId = "";
      this.validationError = "";
    },
    close() {
      this.editedIndex = -1;
      this.dialog = false;
      this.dialogDelete = false;
      this.adModal = false;
      this.limpiar();
    },
    editItem(item) {
      this._id = item._id;
      this.name = item.name;
      this.stock = item.stock;
      this.price = item.price;
      this.categoryId = item.category._id;
      console.log(item.category);
      this.code = item.code;
      this.editedIndex = 1;
      this.dialog = true;
    },
    deleteItem(item) {
      this._id = item._id;
      this.name = item.name;
      this.dialogDelete = true;
    },
    actDesactItem(action, item) {
      this.adModal = 1;
      this.adNombre = item.name;
      this.adId = item._id;
      if (action == 1) this.adAction = 1;
      else if (action == 0) this.adAction = 0;
      else this.adModal = 0;
    },
    activar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header, params: { id: this.adId } };
      axios
        .put("articles/act", {}, conf)
        .then((res) => {
          this.close();
          this.listar();
          this.limpiar();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    desactivar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header, params: { id: this.adId } };
      axios
        .put("articles/desact", {}, conf)
        .then((res) => {
          this.close();
          this.listar();
          this.limpiar();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
