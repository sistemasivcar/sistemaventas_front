import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import routes from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null
  },
  getters: {
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    saveToken({ commit }, token) {
      commit("setToken", token);
      commit("setUser", decode(token));
      localStorage.setItem("token", token);

    },
    autoLogin({ commit }) {
      let token = localStorage.getItem("token");
      if (token) {
        commit("setToken", token);
        commit("setUser", decode(token));
      }
      routes.push({ name: 'home' })

    },
    logOut({ commit }) {
      commit("setUser", null);
      commit("setToken", null);
      localStorage.removeItem("token");
      routes.push({ name: 'login' })
    }
  },
  modules: {
  }
})
