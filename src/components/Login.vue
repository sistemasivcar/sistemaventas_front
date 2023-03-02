<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Acceso al Sistema </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            autofocus
            color="accent"
            v-model="email"
            label="Email"
            required
          >
          </v-text-field>
          <v-text-field
            type="password"
            color="accent"
            v-model="password"
            label="Password"
            required
          >
          </v-text-field>

          <v-flex class="red--text" v-if="faliedLogMessage">
            {{ faliedLogMessage }}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn color="primary" @click="ingresar">Ingresar</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
      faliedLogMessage: "",
    };
  },

  methods: {
    ingresar() {
      axios
        .post("users/login", { email: this.email, password: this.password })
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          this.$store.dispatch("saveToken", data.token);
          this.$router.push({ name: "home" });
        })
        .catch((err) => {
          this.faliedLogMessage = null;
          if (err.response.status == 404)
            this.faliedLogMessage = "Credenciales inválidas";
          else {
            this.faliedLogMessage = "Error de conexión";
          }
        });
    },
  },
};
</script>
