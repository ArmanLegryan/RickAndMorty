<template>
  <main>
    <h1>Characters</h1>

    <div class="position-sticky">
      <v-row>
        <v-col md="4" cols="12">
          <v-text-field
            v-model="name"
            label="Name"
            outlined
            @input="() => getData()"
          ></v-text-field>
        </v-col>

        <v-col md="4" cols="12">
          <v-select
            v-model="status"
            :items="statuses"
            label="Status"
            outlined
            @change="getData"
          ></v-select>
        </v-col>

        <v-col md="4" cols="12">
          <v-select
            v-model="gender"
            :items="genders"
            label="Gender"
            outlined
            @change="getData"
          ></v-select>
        </v-col>
      </v-row>
    </div>

    <v-row>
      <v-col v-for="(character, idx) of characters" :key="idx">
        <v-card class="mx-auto" max-width="260">
          <v-img :src="character.image" height="250px"></v-img>
          <v-card-title class="name"> {{ character.name }} </v-card-title>
          <v-card-subtitle> {{ character.species }} </v-card-subtitle>
          <v-card-subtitle class="pt-0 text-right">
            <span
              class="status"
              :class="{
                alive: character.status === 'Alive',
                dead: character.status === 'Dead',
                unknown: character.status === 'unknown',
              }"
            ></span>
            {{ character.status }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      genders: ['female', 'male', 'genderless', 'unknown'],
      statuses: ['alive', 'dead', 'unknown'],
      name: null,
      gender: null,
      status: null,
      page: 1,
    }
  },

  computed: {
    ...mapGetters({
      characters: 'characters/characters',
    }),
  },

  async mounted() {
    await this.getData()

    window.onscroll = () => {
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      if (bottomOfWindow) {
        this.loadMore()
      }
    }
  },

  methods: {
    ...mapActions({
      getCharacters: 'characters/getCharacters',
      getMoreCharacters: 'characters/getMoreCharacters',
    }),

    async getData() {
      if (this.cancelToken) {
        this.cancelToken()
      }
      await this.getCharacters({
        params: {
          page: this.page,
          status: this.status,
          gender: this.gender,
          name: this.name,
        },
        assignToken: (token) => {
          this.cancelToken = token
        },
      }).then(
        () => {},
        (err) => err
      )
    },

    async loadMore() {
      await this.getMoreCharacters(this.page++)
    },
  },
}
</script>

<style lang="scss" scoped>
.position-sticky {
  position: sticky;
  top: 55px;
  background: #121212;
  z-index: 1;
  padding-top: 25px;
  margin-bottom: 16px;
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 200px;
}

.status {
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.alive {
  background: green;
}
.dead {
  background: red;
}
.unknown {
  background: grey;
}
</style>
