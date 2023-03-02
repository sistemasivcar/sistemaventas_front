<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text color="white">
        <v-toolbar-title>Compras</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
          v-if="!verNuevo"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          v-if="!verNuevo"
          @click="mostrarNuevo()"
          ><v-icon>add</v-icon> Nuevo</v-btn
        >
        <v-dialog v-model="dialogArticles" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione Articulo</span>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                class="text-xl-center"
                v-model="searchArticulo"
                append-icon="search"
                label="Búsqueda"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-flex xs12 sm12 md12>
                  <v-text>
                    <div class="red--text">
                      {{ validationErrorAddArt }}
                    </div></v-text
                  ></v-flex
                >
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <template>
                      <v-data-table
                        :headers="headersArticulos"
                        :items="articulos"
                        :search="searchArticulo"
                        sort-by="name"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.agregar`]="{ item }">
                          <v-icon
                            medium
                            fab
                            dark
                            color="teal"
                            class="mr-2"
                            @click="agregarDetalle(item)"
                          >
                            add
                          </v-icon>
                        </template>
                        <template v-slot:[`item.state`]="{ item }">
                          <div v-if="item.state">
                            <span class="blue--text">Activo</span>
                          </div>
                          <div v-else>
                            <span class="red--text">Inactivo</span>
                          </div>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeModalArt"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
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
            ><span v-if="!adAction">DESACTIVAR</span> el ingreso
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
      <!-- TABLA INGRESOS -->
      <v-alert
        v-model="alertSuccess"
        border="left"
        elevation="1"
        :type="typeAlert"
      >
        {{ alertText }}
      </v-alert>
      <v-data-table
        v-if="!verNuevo"
        :headers="headers"
        :items="ingresos"
        :search="search"
        sort-by="fechaRegistro"
        :sort-desc="true"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="verIngreso(item)"> tab </v-icon>

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
          <div v-else><span class="red--text">Anulado</span></div>
        </template>
        <template v-slot:[`item.total`]="{ item }">
          ${{ item.total }}
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()"> Reset </v-btn>
        </template>
      </v-data-table>

      <!--NUEVO INGRESO FROM-->
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Comprobante"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="num_comprobante" label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-autocomplete
              :items="proveedores"
              v-model="proveedor"
              label="Proveedor"
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm6 md6 lg6 v-if="detalles.length != 0">
            <v-btn color="primary" @click="mostrarModalArticulos">
              <v-icon dark>add</v-icon> Agregar Articulos
            </v-btn>
          </v-flex>

          <!--TABLA DETALLES ARTICULOS -->
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="headersDetalles"
                :items="detalles"
                :search="search"
                sort-by="articleName"
                class="elevation-1"
              >
                <template v-slot:[`item.borrar`]="{ item }">
                  <v-icon
                    medium
                    class="mr-2"
                    @click="eliminarDetalle(detalles, item)"
                  >
                    delete
                  </v-icon>
                </template>

                <template v-slot:[`item.subtotal`]="{ item }">
                  ${{ item.cantidad * item.precioCompra }}
                </template>
                <template v-slot:[`item.cantidad`]="{ item }">
                  <v-text-field
                    v-model="item.cantidad"
                    type="number"
                  ></v-text-field>
                </template>
                <template v-slot:[`item.precioCompra`]="{ item }">
                  <v-text-field
                    v-model="item.precioCompra"
                    type="number"
                  ></v-text-field>
                </template>
                <template v-slot:no-data>
                  <v-btn color="primary" @click="mostrarModalArticulos">
                    <v-icon dark>add</v-icon> Agregar Articulos
                  </v-btn>
                </template>
              </v-data-table>

              <v-flex xs12 sm4 md4 class="text-xs-rigth pa-3">
                <strong>Total Neto:</strong> $ {{ (total = calcularTotal) }}
              </v-flex>
            </template>
          </v-flex>

          <v-flex xs12 sm8 md8>
            <v-text>
              <div class="red--text pa-3">
                {{ validationError }}
              </div></v-text
            ></v-flex
          >

          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="primary mr-3  " text @click="ocultarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn color="success" v-if="!verDetalle" @click.native="save()"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    dialogArticles: false,
    dialogDelete: false,
    alertSuccess: false,
    validationError: "",
    validationErrorAddArt: "",
    fechaRegistro: "",
    search: "",
    typeAlert: "",
    alertText: "",
    headers: [
      { text: "Acciones", value: "actions", sortable: false },
      { text: "Ususario", value: "user.name" },
      { text: "Proveedor", value: "proveedor.razonSocial" },
      { text: "Tipo Comprobante", value: "tipoComprobante", sortable: false },
      {
        text: "Numero Comprobante",
        value: "serieComprobante",
        sortable: false,
      },
      { text: "Fecha", value: "fechaRegistro", sortable: true },
      { text: "Monto", value: "total", sortable: true },
      { text: "Estado", value: "state", sortable: false },
    ],
    headersDetalles: [
      { text: "Borrar", value: "borrar", sortable: false },
      { text: "Artículo", value: "articleName", sortable: false },
      { text: "Cantidad", value: "cantidad", sortable: false },
      { text: "Precio Unitario", value: "precioCompra", sortable: false },
      { text: "Sub Total", value: "subtotal", sortable: false },
    ],
    headersArticulos: [
      { text: "Agregar", value: "agregar", sortable: false },
      { text: "Nombre", value: "name" },
      { text: "Precio", value: "price", sortable: false },
      { text: "Stock", value: "stock", sortable: false },
      { text: "Categoría", value: "category.name" },
      { text: "Estado", value: "state", sortable: false },
    ],
    ingresos: [],
    editedIndex: -1,
    detalles: [],
    _id: "",
    user: "",
    proveedor: "",
    searchArticulo: "",
    proveedores: [],
    articulos: [],
    texto: "",
    comprobantes: ["FACTURA", "BOLETA", "TICKET"],
    tipo_comprobante: "",
    num_comprobante: "",
    fecha: "",
    total: "",
    verDetalle: 0,
    verNuevo: 0,

    adModal: 0,
    adAction: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Compra" : "Editar Compra";
    },
    calcularTotal() {
      let res = 0;
      for (let i = 0; i < this.detalles.length; i++) {
        res = res + this.detalles[i].cantidad * this.detalles[i].precioCompra;
      }
      return res;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectProveedor();
    this.listarArticulos();
  },

  methods: {
    mostrarModalArticulos() {
      this.validationErrorAddArt = "";
      this.dialogArticles = true;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },

    selectProveedor() {
      let me = this;
      let proveedoresArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("proveedores/list", configuracion)
        .then(function (response) {
          proveedoresArray = response.data;
          proveedoresArray.map(function (x) {
            me.proveedores.push({ text: x.razonSocial, value: x._id });
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarArticulos() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("articles/list", conf)
        .then((res) => {
          this.articulos = res.data;
          console.log("dasdad--->", res.data);
        })
        .catch((err) => console.log(err));
    },
    agregarDetalle(item) {
      this.validationErrorAddArt = null;
      if (this.encuentra(item._id) == true) {
        this.validationErrorAddArt = "El artículo ya ha sido agregado.";
      } else if (!item.state) {
        this.validationErrorAddArt = "El artículo no está activo";
      } else {
        this.detalles.push({
          _id: item._id,
          articleName: item.name,
          cantidad: 1,
          precioCompra: item.price,
        });
      }
      console.log(this.detalles);
    },
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },

    listar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("ingresos/list", conf)
        .then((res) => {
          this.ingresos = res.data;
        })
        .catch((err) => console.log(err));
    },
    save() {
      //guardar
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      const date = new Date();
      axios
        .post(
          "ingresos/add",
          {
            user: this.$store.state.user._id,
            proveedor: this.proveedor,
            serieComprobante: this.num_comprobante,
            tipoComprobante: this.tipo_comprobante,
            detalles: this.detalles,
            total: this.total,
            fechaRegistro:
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " " +
              (date.getHours() < 9 ? "0" + date.getHours() : date.getHours()) +
              ":" +
              (date.getMinutes() < 9
                ? "0" + date.getMinutes()
                : date.getMinutes()) +
              ":" +
              (date.getSeconds() < 9
                ? "0" + date.getSeconds()
                : date.getSeconds()),
          },
          conf
        )
        .then((res) => {
          this.limpiar();
          this.close();
          this.listar();
          this.typeAlert = "success";
          this.alertText = "Ingreso registrado con éxito";
          this.alertSuccess = true;
          this.ocultarNuevo();
          setTimeout(() => {
            this.alertSuccess = false;
          }, 3000);
        })
        .catch((err) => {
          this.validationError = err.response.data.message;
        });
    },
    limpiar() {
      this._id = null;
      this.name = "";
      this.detalles = [];
      this.num_comprobante = "";
      this.tipo_comprobante = "";
      this.fechaRegistro = "";
      this.proveedor = "";
      this.searchArticulo = "";
      this.verDetalle = 0;
      this.adNombre = "";
      this.adAction = 0;
      this.adId = "";
      this.validationError = "";
    },
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.validationError = "";
      this.dialogArticles = false;
      this.adModal = false;
      this.limpiar();
      this.editedIndex = -1;
    },
    closeModalArt() {
      this.validationErrorArt = "";
      this.dialogArticles = false;
    },

    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("ingresos/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      console.log(item);
      this.limpiar();
      this.tipo_comprobante = item.tipoComprobante;
      this.num_comprobante = item.serieComprobante;
      this.proveedor = item.proveedor._id;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
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
        .put("ingresos/act", {}, conf)
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
        .put("ingresos/desact", {}, conf)
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
