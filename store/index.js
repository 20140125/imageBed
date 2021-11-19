import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		authorized: {}
	},
	mutations: {
		/**
		* todo: 更新vuex数据
		* @param state
		* @param update
		*/
		UPDATE_MUTATIONS(state, update) {
		    Object.keys(update).forEach(item => {
		      state[item] = update[item];
		    });
		}
	},
})
export default store
