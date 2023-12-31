<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar text color="white">
        <v-toolbar-title>Ventas</v-toolbar-title>
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
              <span class="headline">Seleccione Productos</span>
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
                        <template v-slot:[`item.nroPago`]="{ item }">
                          <div v-if="item.nroPago == ''">--</div>
                          <div v-else>{{ item.nroPago }}</div>
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
            ><span v-if="!adAction">DESACTIVAR</span> la venta
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

      <v-dialog v-model="pagosModal" max-width="900">
        <v-card>
          <v-card-title v-if="!nuevoPagoContent" class="headline"
            >Pagos del Recibo: {{ num_comprobante }}</v-card-title
          >
          <v-card-title v-if="nuevoPagoContent" class="headline"
            >Nuevo Pago</v-card-title
          >

          <v-card-text>
            <v-container grid-list-md>
              <div v-if="!nuevoPagoContent">
                Monto facturado: <strong>${{ montoFacturado }}</strong
                ><br />
                Monto entregado:<strong>${{ montoEntregado }}</strong>
              </div>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <template>
                    <v-data-table
                      v-if="!nuevoPagoContent"
                      :headers="headersPagos"
                      :items="pagos"
                      sort-by="createdAt"
                      class="elevation-1"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <template v-if="item.state">
                          <v-icon
                            small
                            class="mr-2"
                            @click="actDesactPago(0, item)"
                          >
                            block
                          </v-icon>
                        </template>
                        <template v-else>
                          <v-icon
                            small
                            class="mr-2"
                            @click="actDesactPago(1, item)"
                          >
                            check
                          </v-icon>
                        </template>
                      </template>

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
                      <template v-slot:[`item.monto`]="{ item }">
                        ${{ item.monto }}
                      </template>

                      <template v-slot:no-data
                        >No hay pagos registrados
                      </template>
                    </v-data-table>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                      <p class="text-xs-center">
                        SALDO:
                        <strong>${{ montoFacturado - montoEntregado }}</strong>
                      </p></v-flex
                    >
                    <v-text>IMPRIMIR RESUMEN PAGOS: </v-text>
                    <v-btn @click="mostrarModalPrintPagos" class="mr-2"
                      ><v-icon class="pa-2">print</v-icon></v-btn
                    >

                    <container v-if="nuevoPagoContent">
                      <v-flex xs12 sm12 md12>
                        <v-text>
                          <div class="red--text">
                            {{ validationErrorAddPayment }}
                          </div></v-text
                        ></v-flex
                      >
                      <v-flex>
                        <v-layout wrap>
                          <v-flex xs12 sm12 md12>
                            <v-select
                              v-model="formaPago"
                              :items="formasPago"
                              label="Forma Pago"
                            >
                            </v-select>
                          </v-flex>
                          <v-flex xs12 sm12 md12>
                            <v-text-field
                              v-model="monto"
                              type="number"
                              label="Monto"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex
                            xs12
                            sm12
                            md12
                            v-if="
                              formaPago == 'CHEQUE' ||
                              formaPago == 'TRANSFERENCIA'
                            "
                          >
                            <v-text-field
                              v-model="comprobantePago"
                              type="number"
                              label="Nro. Comprobante de Pago"
                            >
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
                      </v-flex>
                    </container>
                  </template>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              v-if="!nuevoPagoContent"
              @click="closeNuevoPago"
              >Cancelar</v-btn
            >
            <v-btn
              color="green darken-1"
              text
              v-if="nuevoPagoContent"
              @click="closeNuevoPagoContent"
              >Cancelar</v-btn
            >
            <v-btn v-if="nuevoPagoContent" @click="savePago" color="success"
              >Guardar</v-btn
            >
            <v-btn @click="nuevoPago()" v-if="!nuevoPagoContent" color="success"
              ><v-icon>add</v-icon>Nuevo</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="printFacturaModal" max-width="1000">
        <v-card>
          <v-card-title class="headline"
            ><v-btn @click="crearPDF" class="mr-2"
              ><v-icon class="pa-2">print</v-icon></v-btn
            >
            Imprimir {{ tipo_comprobante.toLowerCase() }}</v-card-title
          >

          <v-card-text>
            <div id="factura">
              <header id="header">
                <div id="">
                  <img
                    src="data:image/png;base64,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"
                    id="imagen"
                  />
                </div>
                <div id="">
                  <p id="encabezado" style="max-width: 550px;">
                    <b style="font-size: medium; letter-spacing: 1.4px;">IVCAR ALARMAS</b><br />Domicilio Fiscal: España 252 Laboulaye, Cba. -
                    I.V.A: Resp Inscripto - 
                    ivcaralarmas@gmail.com -
                    Razon Social: Osvaldo Norberto Castro - 
                    CUIT: 20-14910961-8 -
                    www.ivcaralarmas.com
                    3385448580

                  </p>
                </div>
                <!-- <div id="fact">
                  <p id="datosivcar">
                    ivcaralarmas@gmail.com <br />
                    ivcaralarmas.com <br />
                    3385-448580<br />
                    
                  </p>
                </div> -->
                <div style="display: flex; flex-direction: column;  align-items: center;">
                  <p id="recibonro">{{ tipo_comprobante }} NRO {{ num_comprobante }}</p>
                  <p style="margin:0 ; line-height:1.6; font-size: small;" ><em>No valido como factura</em></p>
                  <p style="font-size: small;  margin: 0; line-height: 1.6;">{{ fecha.substring(0, 10) }}</p>
                </div>
              </header>
              
              <section>
                <div>
                  <table id="facliente">
                    <tbody>
                      <tr>
                        <td id="td">
                          <em>Cliente: <strong> {{ nombre.toUpperCase() }}</strong></em>
                        </td>
                        <td id="td">Direccion: {{ calle.toUpperCase() }} {{ nro }}</td>
                        <td id="td">CUIT: {{ cuit }}</td>
                        <td id="td">Tel: {{ phone }}</td>
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
                        <th>CANT</th>
                        <th>DESCRIPCION</th>
                        <th>PRECIO UNIT</th>
                        <th>DESC.</th>
                        <th>PRECIO TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="det in detalles" :key="det._id">
                        <td style="text-align: center">{{ det.cantidad }}</td>
                        <td>
                          {{ det.articleName }}
                        </td>
                        <td style="text-align: right">
                          {{ det.precioCompra }}
                        </td>
                        <td style="text-align: right">0</td>
                        <td style="text-align: right">
                          {{ det.precioCompra * det.cantidad }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right">SUBTOTAL$</th>
                        <th style="text-align: right">
                          {{ (total = calcularTotal) }}
                        </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right">IVA({{ impuesto }})</th>
                        <th style="text-align: right">
                          {{ (total = calcularImpuesto) }}
                        </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right">TOTAL$</th>
                        <th style="text-align: right">
                          {{ (total = calcularTotalNeto) }}
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
            <v-btn color="green darken-1" text @click="ocultarModalPrint"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="modalPrintPagos" max-width="1000">
        <v-card>
          <v-card-title class="headline"
            ><v-btn @click="crearPDFPagos" class="mr-2"
              ><v-icon class="pa-2">print</v-icon></v-btn
            >
            Resumen de Pagos</v-card-title
          >

          <v-card-text>
            <div id="pagos">
              <header id="header">
                <div id="logo">
                  <img
                    src="data:image/png;base64,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"
                    id="imagen"
                  />
                </div>
                <div id="datos">
                  <p id="encabezado">
                    <b>IVCAR ALARMAS</b><br />España 252 - Córdoba, Laboulaye<br />Telefono:3385448580<br />Email:ivcaralarmas@gmail.com
                  </p>
                </div>
                <div id="fact">
                  <p>
                    RECIBO: {{ num_comprobante }}<br />
                    MONTO: {{ montoFacturado }}
                  </p>
                </div>
              </header>
              <br />
              <section>
                <div>
                  <div id="facliente">RECIBI DE:</div>
                  <table id="facliente">
                    <tbody>
                      <tr>
                        <td id="cliente">
                          <strong>Sr(a). {{ nombre }}</strong
                          ><br />
                          <strong>Dirección:</strong>
                          {{ calle }}
                          {{ nro }}<br />
                          <strong>Teléfono:</strong> {{ phone }}<br />
                          <strong>Email:</strong> {{ email }}
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
                        <th>NRO.PAGO</th>
                        <th>FECHA Y HORA</th>
                        <th>MONTO</th>
                        <th>FORMA PAGO</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="pago in pagos" :key="pago._id">
                        <td style="text-align: center">{{ pago.nroPago }}</td>
                        <td>
                          {{ pago.createdAt }}
                        </td>
                        <td style="text-align: center">
                          {{ pago.monto }}
                        </td>
                        <td style="text-align: center">{{ pago.forma }}</td>
                        <td style="text-align: center"></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right">TOTAL PAGADO$</th>
                        <th style="text-align: right">
                          {{ montoEntregado }}
                        </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right">SALDO$</th>
                        <th style="text-align: right">
                          {{ montoFacturado - montoEntregado }}
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
            <v-btn color="green darken-1" text @click="ocultarModalPrintPagos"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- TABLA ventas -->
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
        :items="ventas"
        :search="search"
        sort-by="fechaFacturacion"
        :sort-desc="true"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="verVenta(item)"> tab </v-icon>
          <v-icon small class="mr-2" @click="mostrarModalPrint(item)">
            print
          </v-icon>
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
          <template>
            <v-icon small class="mr-2" @click="mostrarModalPagos(item)">
              payment
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
        <template v-slot:[`item.estado_pago`]="{ item }">
          <div v-if="item.state">
            <div v-if="item.entregado >= item.total">
              <strong class="success--text">PAGADO</strong>
            </div>
            <div v-else><strong class="orange--text">PENDIENTE</strong></div>
          </div>
          <div v-if="!item.state">
            <strong class="red--text">AUNLADA</strong>
          </div>
        </template>

        <template v-slot:[`item.fechaFacturacion`]="{ item }">
          {{ item.fechaFacturacion }}
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()"> Reset </v-btn>
        </template>
      </v-data-table>

      <!--NUEVA VENTA FROM-->
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-autocomplete :items="clientes" v-model="cliente" label="Cliente">
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Comprobante"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm1 md1 lg1 xl1>
            <v-text-field v-model="impuesto" type="number" label="IVA(%)">
            </v-text-field>
          </v-flex>

          <v-flex xs12 sm3 md3 lg3 xl3>
            <v-text-field v-model="num_comprobante" label="Número Comprobante">
            </v-text-field>
          </v-flex>

          <v-flex xs12 sm4 md4 lg4 v-if="!verDetalle">
            <v-btn color="primary" @click="mostrarModalArticulos">
              <v-icon dark>add</v-icon> Agregar Productos
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
                  No hay productos agregados al detalle
                </template>
              </v-data-table>
              <v-flex xs12 sm12 md12>
                <v-flex xs12 sm4 md4 class="text-xs-">
                  <strong>SUBTOTAL:</strong> $ {{ (total = calcularTotal) }}
                </v-flex>
                <v-flex xs12 sm4 md4 class="text-xs-">
                  <strong>IVA ({{ this.impuesto }}%):</strong> $
                  {{ (total = calcularImpuesto) }}
                </v-flex>
                <v-flex xs12 sm4 md4 class="text-xs-">
                  <strong>TOTAL:</strong> $ {{ (total = calcularTotalNeto) }}
                </v-flex>
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
import jspdf from "jspdf";
import html2canvas from "html2canvas";
export default {
  data: () => ({
    dialogArticles: false,
    dialogDelete: false,
    alertSuccess: false,
    validationError: "",
    validationErrorAddArt: "",
    modalPrintPagos: 0,
    validationErrorAddPayment: "",
    search: "",
    typeAlert: "",
    headers: [
      { text: "Acciones", value: "actions", sortable: false },
      {
        text: "Nro. Comprobante",
        value: "serieComprobante",
        sortable: false,
      },
      { text: "Vendedor", value: "user.name" },
      { text: "Cliente", value: "client.name" },
      { text: "Fecha", value: "fechaFacturacion", sortable: true },
      { text: "Monto", value: "total", sortable: true },
      { text: "Estado", value: "estado_pago", sortable: false },
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
    headersPagos: [
      { text: "Acciones", value: "actions", sortable: false },
      { text: "Fecha", value: "createdAt", sortable: false },
      { text: "Nro. Pago", value: "nroPago", sortable: false },
      { text: "Monto", value: "monto", sortable: false },
      { text: "Forma Pago", value: "forma", sortable: false },
      { text: "Estado", value: "state", sortable: false },
    ],
    ventas: [],
    editedIndex: -1,
    detalles: [],
    _id: "",
    _idPago: "",
    cliente: "",
    searchArticulo: "",
    clientes: [],
    articulos: [],
    texto: "",
    comprobantes: ["RECIBO", "BOLETA", "PRESUPUESTO"],
    formasPago: ["EFECTIVO", "TRANSFERENCIA", "CHEQUE"],
    formaPago: "",
    comprobantePago: "",
    monto: "",
    estado_pago: "",
    tipo_comprobante: "RECIBO",
    num_comprobante: "",
    montoEntregado: 0,
    fecha: "",
    nuevoPagoContent: 0,
    alertSuccess: false,
    montoFacturado: 0,
    typeAlert: "",
    alertText: "",

    total: "",
    phone: "",
    calle: "",
    cuit: "",
    impuesto: 0,
    estadosFactura: ["PAGADO", "PENDIENTE"],
    estadoFactura: "",
    nombre: "",
    pagosModal: 0,
    pagos: [],
    entregado: "",
    nro: "",
    email: "",
    verDetalle: 0,
    verNuevo: 0,

    adModal: 0,
    printFacturaModal: 0,
    adAction: 0,
    adNombre: "",
    adId: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Venta" : "Editar Venta";
    },
    calcularTotal() {
      let res = 0;
      for (let i = 0; i < this.detalles.length; i++) {
        res = res + this.detalles[i].cantidad * this.detalles[i].precioCompra;
      }
      return res.toFixed(2);
    },
    calcularImpuesto() {
      let res = 0;
      for (let i = 0; i < this.detalles.length; i++) {
        res =
          res +
          this.detalles[i].cantidad *
            this.detalles[i].precioCompra *
            (this.impuesto / 100);
      }
      return res.toFixed(2);
    },
    calcularTotalNeto() {
      let res = 0;
      for (let i = 0; i < this.detalles.length; i++) {
        res = res + this.detalles[i].cantidad * this.detalles[i].precioCompra;
      }
      console.log(res, parseInt(this.calcularImpuesto));
      return (res + parseInt(this.calcularImpuesto)).toFixed(2);
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.selectCliente();
    this.listarArticulos();
  },

  methods: {
    mostrarModalPrintPagos() {
      this.modalPrintPagos = 1;

      this.ocultarModalPagos();
    },
    ocultarModalPrintPagos() {
      this.modalPrintPagos = 0;
      this.mostrarModalPagos();
    },
    nuevoPago() {
      this.nuevoPagoContent = 1;
    },
    calcularEntregado() {
      const largo = this.ventas.length;
      for (let ii = 0; ii < largo; ii++) {
        let sum = 0;
        for (let i = 0; i < this.ventas[ii].pagos.length; i++) {
          if (this.ventas[ii].pagos[i].state == 1) {
            sum = parseInt(sum) + parseInt(this.ventas[ii].pagos[i].monto);
          } else {
            sum = sum + 0;
          }
        }
        this.ventas[ii].entregado = sum;
      }
    },
    generateRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (1 + max - min) + min);
    },
    crearPDF() {
      var quotes = document.getElementById("factura");
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
        doc.save("ComprobanteVenta.pdf");
      });
    },
    crearPDFPagos() {
      var quotes = document.getElementById("pagos");
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
        doc.save("ComprobantePagos.pdf");
      });
    },
    ocultarModalPrint() {
      this.printFacturaModal = 0;
    },
    ocultarModalPagos() {
      this.pagosModal = 0;
    },
    mostrarModalPagos(item) {
      this.pagosModal = 1;
      this._id = item._id;
      this.email = item.client.email || "";
      this.phone = item.client.phones[0] || "";
      this.nombre = item.client.name || "";
      this.calle = item.client.direccion.calle || "";
      this.nro = item.client.direccion.nro || "";
      this.num_comprobante = item.serieComprobante;
      this.pagos = item.pagos;
      this.montoEntregado = item.entregado;
      this.montoFacturado = item.total;
    },
    mostrarModalPrint(item) {
      console.log(item);
      this.tipo_comprobante = item.tipoComprobante;
      this.num_comprobante = item.serieComprobante;
      this.impuesto = item.impuesto;
      this.email = item.client.email || "";
      this.phone = item.client.phones[0] || "";
      this.nombre = item.client.name || "";
      this.calle = item.client.direccion.calle || "";
      this.nro = item.client.direccion.nro || "";
      this.cuit = item.client.cuit || "";

      this.fecha = item.fechaFacturacion;
      this.listarDetalles(item._id);
      this.printFacturaModal = 1;
    },
    mostrarModalArticulos() {
      this.validationErrorAddArt = "";
      this.dialogArticles = true;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
      this.num_comprobante = this.generateRandom(100, 10000000);
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },

    selectCliente() {
      let me = this;
      let clientesArray = [];
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("clients/list", configuracion)
        .then(function (response) {
          clientesArray = response.data;
          clientesArray.map(function (x) {
            me.clientes.push({ text: x.name, value: x._id });
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
        .get("ventas/list", conf)
        .then((res) => {
          this.ventas = res.data;
          this.calcularEntregado();
          console.log(this.ventas);
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
          "ventas/add",
          {
            user: this.$store.state.user._id,
            client: this.cliente,
            serieComprobante: this.num_comprobante,
            tipoComprobante: this.tipo_comprobante,
            impuesto: this.impuesto,
            detalles: this.detalles,
            total: this.total,
            fechaFacturacion:
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
          console.log("success");
          this.verNuevo = false;
          this.limpiar();

          this.listar();
          this.typeAlert = "success";
          this.alertText = "Venta registrada con éxito";
          this.alertSuccess = true;
          this.alertSuccess = true;
          setTimeout(() => {
            this.alertSuccess = false;
          }, 3000);
        })
        .catch((err) => {
          this.validationError = err.response.data.message;
        });
    },
    limpiar() {
      this._id = "";
      this.name = "";
      this.detalles = [];
      this.num_comprobante = "";
      this.estadoFactura = "";
      this.tipo_comprobante = "RECIBO";
      this.cliente = "";
      this.searchArticulo = "";
      this.verDetalle = 0;
      this.adNombre = "";
      this.impuesto = 0;
      this.adAction = 0;
      this.adId = "";
      this.validationError = "";
    },
    closeNuevoPagoContent() {
      this.nuevoPagoContent = 0;
    },
    closeNuevoPago() {
      this.ocultarModalPagos();
      this.pagosModal = 0;
    },
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.validationError = "";
      this.dialogArticles = false;
      this.adModal = false;
      this.editedIndex = -1;
    },
    closeModalArt() {
      this.validationErrorArt = "";
      this.dialogArticles = false;
    },

    savePago() {
      if (this.validarFormPago()) {
        this.validationErrorAddPayment = this.validarFormPago();
        return;
      }
      const date = new Date();
      const pago = {
        monto: this.monto,
        forma: this.formaPago,
        nroPago: this.comprobantePago,
        createdAt:
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
          (date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds()),
        state: 1,
      };
      this.pagos.push(pago);
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .put(
          "ventas/update?_id=" + this._id,
          {
            pagos: this.pagos,
          },
          conf
        )
        .then((res) => {
          this.closeNuevoPagoContent();
          this.calcularEntregado();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    actDesactPago(action, item) {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      console.log(this.pagos);
      var pagoIndex = this.pagos.map((pago) => pago._id).indexOf(item._id);

      if (action) {
        this.pagos[pagoIndex].state = 1;
        axios
          .put(
            "ventas/update?_id=" + this._id,
            {
              pagos: this.pagos,
            },
            conf
          )
          .then((res) => {
            this.listar();
            this.calcularEntregado();
          })
          .cath((err) => console.log(err));
      } else if (!action) {
        this.pagos[pagoIndex].state = 0;
        axios
          .put(
            "ventas/update?_id=" + this._id,
            {
              pagos: this.pagos,
            },
            conf
          )
          .then((res) => {
            this.listar();
            this.calcularEntregado();
          })
          .cath((err) => console.log(err));
      }
    },
    validarFormPago() {
      if (!this.monto) {
        return "Ingrese un monto";
      } else if (!this.formaPago) {
        return "Ingrese una forma de pago";
      } else return "";
    },

    listarDetalles(id) {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("ventas/query?_id=" + id, configuracion)
        .then(function (response) {
          me.detalles = response.data.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verVenta(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipoComprobante;
      this.num_comprobante = item.serieComprobante;
      this.cliente = item.client._id;
      this.impuesto = item.impuesto;
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
        .put("ventas/act", {}, conf)
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
        .put("ventas/desact", {}, conf)
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
#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}
#pagos {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}


#imagen {
  width: 100px;
}

#fact {
  font-size: 12px;
  font-weight: bold;
  display: flex;
  text-align: center;
}
 
#recibonro{
  padding: 20px;
  background-color: #e1e1e1;
  font-weight: 900;
  margin: 0;
  text-align: center;
} 
#header {
  /* border: solid 1px black; */
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;

}

#datosivcar {
  font-size: 12px;
  font-weight: 300;
  text-align: center;
  line-height: 1.6;
}


#encabezado {
  text-align: left;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
  line-height: 1.6;
}

section {
  clear: left;
}

#cliente {
  text-align: left;
}

#facliente {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
  border: solid 1px black;
}

#td{
  padding: 8px;
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
