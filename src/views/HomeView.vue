<template>
  <v-container grid-list-m>
    <v-layout wrap>
      <template> </template>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChartVentasMontos"> </canvas>
        </div>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChartVentasNro"> </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";
export default {
  data() {
    return {
      valores: [],
      meses: [],
      totales: [],
      cantidad_ventas: [],
    };
  },
  methods: {
    listar() {
      let header = { token: this.$store.state.token };
      let conf = { headers: header };
      axios
        .get("ventas/grafico12meses", conf)
        .then((res) => {
          this.valores = res.data;
          this.graficar();
        })
        .catch((err) => console.log(err));
    },
    graficar() {
      let mesn = "";
      this.valores.map((x) => {
        switch (parseInt(x._id.month)) {
          case 1:
            mesn = "Enero";
            break;
          case 2:
            mesn = "Febrero";
            break;
          case 3:
            mesn = "Marzo";
            break;
          case 4:
            mesn = "Abril";
            break;
          case 5:
            mesn = "Mayo";
            break;
          case 6:
            mesn = "Junio";
            break;
          case 7:
            mesn = "Julio";
            break;
          case 8:
            mesn = "Agosto";
            break;
          case 9:
            mesn = "Setiembre";
            break;
          case 10:
            mesn = "Octubre";
            break;
          case 11:
            mesn = "Noviembre";
            break;
          case 12:
            mesn = "Diciembre";
            break;
          default:
            mesn = "error";
        }
        this.meses.push(mesn + "-" + x._id.year);
        this.totales.push(x.total);
        this.cantidad_ventas.push(x.numero);
      });
      var ctx = document.getElementById("myChartVentasMontos");
      var myChartVentasMontos = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.meses,
          datasets: [
            {
              label: "MONTO COBRADO POR MES",
              data: this.totales,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });

      //VENTAS NRO
      var ctx = document.getElementById("myChartVentasNro");
      var myChartVentasNro = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.meses,
          datasets: [
            {
              label: "CANTIDAD DE PRODUCTOS VENDIDOS POR MES",
              data: this.cantidad_ventas,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },
  },
  mounted() {
    this.listar();
  },
};
</script>
