import axios from 'axios'
import qs from 'qs'

const URL = 'https://rickandmortyapi.com/api/character/'

export const state = () => ({
  characters: [],
})

export const actions = {
  async getCharacters({ commit }, { params = {}, assignToken = () => {} }) {
    const data = await axios
      .get(`${URL}`, {
        params,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
        cancelToken: new axios.CancelToken((c) => {
          if (assignToken) {
            assignToken(c)
          }
        }),
      })
      .then(
        ({ data }) => Promise.resolve(data.results),
        (err) => {
          if (axios.isCancel(err)) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ err, canceled: true })
          }
          return Promise.reject(err)
        }
      )
    commit('SET_CHARACTERS', data)
  },

  async getMoreCharacters({ commit }, pageNumber) {
    const data = await axios
      .get(`${URL}?page=${pageNumber}`)
      .then(({ data }) => data.results)

    commit('SET_NEW_CHARACTERS', data)
  },
}

export const mutations = {
  SET_CHARACTERS(state, characters) {
    state.characters = characters
  },

  SET_NEW_CHARACTERS(state, data) {
    state.characters.push(...data)
  },
}

export const getters = {
  characters: (state) => state.characters,
}
