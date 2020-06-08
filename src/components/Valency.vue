<template>
  <div>
    <section>
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Arguments</th>
            <th>Non-reflexive</th>
            <th>Reflexive</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="frame in valency">
            <td v-if="frame.arguments.length > 0">
              <span v-for="argument in frame.arguments">
                {{ argument.relation.toUpperCase() }}
                <span v-html="featuresAsString(argument)"></span>
              </span>
            </td>
            <td v-else>
              (none)
            </td>
            <td v-if="frame.partitions.a">
              <router-link :to="{ name: 'tokens',  query: { frame_id: frame.partitions.a.frame_id }}">{{ frame.partitions.a.n }}</router-link>
            </td>
            <td v-else>
            </td>
            <td v-if="frame.partitions.r">
              <router-link :to="{ name: 'tokens',  query: { frame_id: frame.partitions.r.frame_id }}">{{ frame.partitions.r.n }}</router-link>
            </td>
            <td v-else>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import schema from '../data/schema.json'

export default {
  name: 'Valency',

  props: ['valency'],

  methods: {
    featuresAsString(argument) {
      let s = ''

      if (argument.lemma) {
        s += schema.part_of_speech[argument.part_of_speech]
        s += ' <em>'
        s += argument.lemma
        s += '</em>'

        if (argument.case || argument.mood) {
          if (argument.part_of_speech === 'G-' || argument.part_of_speech === 'R-') {
            s += ' +'
          } else {
            s += ','
          }

          if (argument.case) {
            s += ' '
            s += schema.case[argument.case]
          }

          if (argument.mood) {
            s += ' '
            s += schema.mood[argument.mood]
          }
        }
      } else {
        if (argument.case) {
          s += schema.case[argument.case]
        }

        if (argument.mood) {
          if (argument.case)
            s += ' '
          s += schema.mood[argument.mood]
        }
      }

      return s === '' ? '' : '(' + s + ')'
    }
  }
}
</script>
