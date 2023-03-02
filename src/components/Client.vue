<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text color="white">
        <v-toolbar-title>Clientes</v-toolbar-title>
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

        <v-dialog v-model="modalPrintResumenCuenta" max-width="1000">
          <v-card>
            <v-card-title class="headline"
              ><v-btn @click="crearPDFResumen()" class="mr-2"
                ><v-icon class="pa-2">print</v-icon></v-btn
              >
              Reporte de Venta</v-card-title
            >

            <v-card-text>
              <div id="resumendecuenta">
                <header>
                  <div id="logo">
                    <img
                      src="data:image/png;base64,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"
                      id="imagen"
                    />
                  </div>
                  <div id="datos">
                    <p id="encabezado">
                      <b>IVCAR ALARMAS</b><br />España 252 - Córdoba,
                      Laboulaye<br />Telefono:3385448580<br />Email:ivcaralarmas@gmail.com
                    </p>
                  </div>
                  <div id="fact">
                    <p>
                      RESUMEN DE CUENTA A LA FECHA<br />
                      {{ fechaHoy }}
                    </p>
                  </div>
                </header>
                <br />
                <section>
                  <div>
                    <div id="facliente">RESUMEN DE:</div>
                    <table id="facliente">
                      <tbody>
                        <tr>
                          <td id="cliente">
                            <strong>Sr(a). {{ name }}</strong
                            ><br />
                            <strong>Dirección:</strong>
                            {{ calle }}
                            {{ nro }}<br />
                            <strong>Teléfono:</strong> {{ phone }}<br />
                            <strong>Cuit:</strong> {{ cuit }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <br />
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>NRO RECIBO</th>
                          <th>FECHA</th>
                          <th>MONTO COMPRA</th>
                          <th>PAGADO</th>
                          <th>SALDO</th>
                          <th>ESTADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="compra in resumenesCompras"
                          :key="compra.serieComprobante"
                        >
                          <td style="text-align: center">
                            {{ compra.serieComprobante }}
                          </td>
                          <td>
                            {{ compra.fechaFacturacion }}
                          </td>
                          <td style="text-align: center">
                            {{ compra.total }}
                          </td>
                          <td style="text-align: center">
                            {{ compra.entregado }}
                          </td>
                          <td style="text-align: center">
                            {{ compra.total - compra.entregado }}
                          </td>
                          <td style="text-align: center">
                            <div v-if="compra.state">
                              <div v-if="compra.entregado >= compra.total">
                                <strong class="success--text">PAGADO</strong>
                              </div>
                              <div v-else>
                                <strong class="orange--text">PENDIENTE</strong>
                              </div>
                            </div>
                            <div v-if="!compra.state">
                              <strong class="red--text">AUNLADA</strong>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">
                            MONTO TOTAL EN COMPRAS
                          </th>
                          <th style="text-align: right">
                            ${{ montoFacturado }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">
                            MONTO TOTAL EN PAGOS ${{ impuesto }}
                          </th>
                          <th style="text-align: right">
                            {{ montoEntregado }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">SALDO NETO</th>
                          <th style="text-align: right">
                            ${{ montoFacturado - montoEntregado }}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="gracias">
                    <p><b>Gracias por su compra!</b></p>
                  </div>
                </footer>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="ocultarModalPrintResumenCuenta"
                >Cancelar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

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
                    <v-text-field v-model="name" label="Nombre(*)">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="cuit" label="CUIT"> </v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="calle" label="Calle"> </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field type="number" v-model="nro" label="Número">
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field type="number" v-model="phone" label="Celular">
                    </v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-text>
                      <div class="red--text">
                        {{ validationError }}
                      </div></v-text
                    ></v-flex
                  >
                  (*)Campos obligatorios
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

        <v-dialog v-model="modalResumenCuenta" max-width="1000">
          <v-card>
            <v-card-title class="headline">
              Resumen de Cuenta: {{ name }}</v-card-title
            >
            <v-card-text>
              <v-container grid-list-md>
                <div>
                  Monto facturado: <strong>${{ montoFacturado }}</strong
                  ><br />
                  Monto entregado:<strong>${{ montoEntregado }}</strong>
                </div>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <template>
                      <v-data-table
                        :headers="headersCompras"
                        :items="resumenesCompras"
                        sort-by="createdAt"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.saldo`]="{ item }">
                          {{ item.total - item.entregado }}
                        </template>
                        <template v-slot:[`item.estado_pago`]="{ item }">
                          <div v-if="item.state">
                            <div v-if="item.entregado >= item.total">
                              <strong class="success--text">PAGADO</strong>
                            </div>
                            <div v-else>
                              <strong class="orange--text">PENDIENTE</strong>
                            </div>
                          </div>
                          <div v-if="!item.state">
                            <strong class="red--text">AUNLADA</strong>
                          </div>
                        </template>

                        <template v-slot:no-data
                          >El cliente no tiene compras registradas
                        </template>
                      </v-data-table>
                      <v-flex xs12 sm6 md6 lg6 xl6>
                        <p class="text-xs-center">
                          SALDO:
                          <strong
                            >${{ montoFacturado - montoEntregado }}</strong
                          >
                        </p></v-flex
                      >
                      <v-text>IMPRIMIR RESUMEN CUENTA: </v-text>
                      <v-btn class="mr-2"
                        ><v-icon
                          @click="mostrarModalPrintResumenCuenta"
                          class="pa-2"
                          >print</v-icon
                        ></v-btn
                      >
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions
              ><v-btn
                color="blue darken-1"
                text
                @click="ocultarModalResumenCuenta"
                >Cancelar</v-btn
              >
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
              ><span v-if="!adAction">DESACTIVAR</span> el cliente
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
        :items="clients"
        :search="search"
        sort-by="fechaRegistro"
        :sort-desc="true"
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
          <v-icon small class="mr-2" @click="mostrarModalResumenCuenta(item)">
            payment
          </v-icon>
        </template>
        <template v-slot:[`item.direccion`]="{ item }">
          {{ item.direccion.calle + " " + item.direccion.nro }}
        </template>
        <template v-slot:[`item.state`]="{ item }">
          <div v-if="item.state"><span class="blue--text">Activo</span></div>
          <div v-else><span class="red--text">Inactivo</span></div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    alertSuccess: false,
    validationError: "",
    search: "",
    typeAlert: "",
    montoEntregado: "",
    montoFacturado: "",
    fechaRegistro: "",
    alertText: "",
    modalResumenCuenta: 0,
    resumenesCompras: [],
    headers: [
      { text: "Acciones", value: "actions", sortable: false },
      { text: "Nombre", value: "name" },
      { text: "CUIT", value: "cuit", sortable: false },
      { text: "Celular", value: "phones", sortable: false },
      { text: "Direccion", value: "direccion", sortable: false },
      { text: "Fecha Ingreso", value: "fechaRegistro", sortable: true },
      { text: "Estado", value: "state", sortable: false },
    ],
    headersCompras: [
      { text: "Nro Recibo", value: "serieComprobante", sortable: false },
      { text: "Fecha", value: "fechaFacturacion", sortable: false },
      { text: "Monto Compra", value: "total", sortable: false },
      { text: "Pago", value: "entregado", sortable: false },
      { text: "Saldo", value: "saldo", sortable: false },
      { text: "Estado", value: "estado_pago", sortable: false },
    ],
    clients: [],
    editedIndex: -1,
    totalPrint: 0,
    entregadoPrint: 0,
    _id: "",
    phone: "",
    calle: "",
    nro: "",

    name: "",
    cuit: "",
    phones: [],
    phone: "",
    fechaHoy: "",
    direccion: {},
    calle: "",
    modalPrintResumenCuenta: 0,
    nro: "",
    adModal: 0,
    adAction: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
  },

  methods: {
    calcularFecha() {
      const date = new Date();
      return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      );
    },
    crearPDFResumen() {
      var quotes = document.getElementById("resumendecuenta");
      html2canvas(quotes).then(function (canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        var pageHeight = 295;

        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;

        var doc = new jspdf("p", "mm", "a4");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(`resumenCuenta.pdf`);
      });
    },
    mostrarModalPrintResumenCuenta() {
      this.modalPrintResumenCuenta = 1;
      this.fechaHoy = this.calcularFecha();
      this.ocultarModalResumenCuenta();
      console.log(resumenesCompras);
    },
    ocultarModalPrintResumenCuenta() {
      this.modalPrintResumenCuenta = 0;
      this.mostrarModalResumenCuenta();
    },
    calcularDatosResumen(cliente_id) {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };

      axios
        .get("ventas/resumen?_id=" + cliente_id, conf)
        .then((res) => {
          this.resumenesCompras = res.data;

          //calculo lo pagado por cada compra
          let entregado = 0;
          let facturado = 0;
          for (let ii = 0; ii < this.resumenesCompras.length; ii++) {
            let sum = 0;
            for (let i = 0; i < this.resumenesCompras[ii].pagos.length; i++) {
              if (this.resumenesCompras[ii].pagos[i].state == 1) {
                sum =
                  parseInt(sum) +
                  parseInt(this.resumenesCompras[ii].pagos[i].monto);
              } else {
                sum = sum + 0;
              }
            }
            this.resumenesCompras[ii].entregado = sum;
            entregado = entregado + sum;
            facturado = facturado + this.resumenesCompras[ii].total;
          }
          // calculo total facturado y total entregado
          this.montoEntregado = entregado;
          this.montoFacturado = facturado;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async mostrarModalResumenCuenta(item) {
      this.phone = item.phones[0] || "";
      this.nombre = item.name || "";
      this.calle = item.direccion.nro || "";
      this.cuit = item.cuit || "";
      this.nro = item.direccion.nro || "";
      this.calcularDatosResumen(item._id);
      this.modalResumenCuenta = 1;
      this.name = item.name;
      this.totalPrint = item.total;
      this.entregadoPrint = item.entregado;
    },
    ocultarModalResumenCuenta() {
      this.modalResumenCuenta = 0;
    },
    listar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("clients/list", conf)
        .then((res) => {
          this.clients = res.data;
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
            "clients/update",
            {
              name: this.name,
              phones: [this.phone],
              direccion: { calle: this.calle, nro: this.nro },
              cuit: this.cuit,
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
        const date = new Date();
        axios
          .post(
            "clients/add",
            {
              name: this.name,
              phones: [this.phone],
              direccion: { calle: this.calle, nro: this.nro },
              cuit: this.cuit,
              fechaRegistro:
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear() +
                " " +
                (date.getHours() < 9
                  ? "0" + date.getHours()
                  : date.getHours()) +
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
            this.alertText = "Cliente registrado con éxito";
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
      this.direccion = {};
      this.calle = "";
      this.nro = "";
      this.phone = "";
      this.cuit = "";
      this.adNombre = "";
      this.adAction = 0;
      this.adId = "";
      this.validationError = "";
    },
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.adModal = false;
      this.limpiar();
      this.editedIndex = -1;
    },
    editItem(item) {
      this._id = item._id;
      this.name = item.name;
      this.cuit = item.cuit;
      this.fechaRegistro = item.fechaRegistro;
      this.phone = item.phones[0];
      this.direccion = {
        calle: this.calle,
        nro: this.nro,
      };
      this.calle = item.direccion.calle;
      this.nro = item.direccion.nro;
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
        .put("clients/act", {}, conf)
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
        .put("clients/desact", {}, conf)
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
<style>
#resumendecuenta {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}
#pagos {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 100px;
}

#fact {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
}

#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}

#clientedatos {
  padding: 0px;
  background: #2183e3;
  text-align: left;
  color: #ffffff;
  font-size: 14px;
  width: 80px;
  height: 120;
  border-bottom: 1px solid #ffffff;
}

#gracias {
  text-align: center;
}
</style>
