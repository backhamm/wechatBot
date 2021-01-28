import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

const state = {
  sendBegin: false,
  sendEnd: false,
  completedNum: 0,
  readyList: []
}

const mutations = {
  SET_STATE(state, [key, val]) {
    state[key] = val
  }
}

const actions = {
  socket_begin({commit}, val = true) {
    commit('SET_STATE', ['sendBegin', val])
  },
  send_end({commit}) {
    commit('SET_STATE', ['sendEnd', false])
  },
  set_completed_num({commit}, val) {
    commit('SET_STATE', ['completedNum', val])
  },
  set_ready_list({commit}, val) {
    commit('SET_STATE', ['readyList', val])
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
