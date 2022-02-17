<template>
  <b-select v-model="computedValue">
    <option :value="null">Any part of speech</option>

    <option value="V-">Verbs</option>

    <optgroup label="Nouns">
      <option value="Nb">Common nouns</option>
      <option value="Ne">Proper nouns</option>
    </optgroup>

    <option value="A-">Adjectives</option>

    <optgroup label="Adverbs">
      <option value="Df">Adverbs</option>
      <option value="Dq">Relative adverbs</option>
      <option value="Du">Interrogative adverbs</option>
    </optgroup>

    <optgroup label="Pronouns">
      <option value="Pc">Reciprocal pronouns</option>
      <option value="Pd">Demonstrative pronouns</option>
      <option value="Pi">Interrogative pronouns</option>
      <option value="Pk">Personal reflexive pronouns</option>
      <option value="Pp">Personal pronouns</option>
      <option value="Pr">Relative pronouns</option>
      <option value="Ps">Possessive pronouns</option>
      <option value="Pt">Possessive reflexive pronouns</option>
      <option value="Px">Indefinite pronouns</option>
      <option value="Py">Quantifiers</option>
    </optgroup>

    <optgroup label="Numerals">
      <option value="Ma">Cardinal numerals</option>
      <option value="Mo">Ordinal numerals</option>
    </optgroup>

    <option value="S-">Articles</option>
    <option value="R-">Prepositions</option>
    <option value="N-">Infinitive markers</option>
    <option value="C-">Conjunctions</option>
    <option value="G-">Subjunctions</option>
    <option value="I-">Interjections</option>

    <option value="F-">Foreign words</option>

    <option value="X-">Unassigned words</option>
  </b-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      default: null,
    }
  },

  data() {
    return {
      selected: this.value,
    }
  },

  computed: {
    computedValue: {
      get() {
        return this.selected
      },

      set(value) {
        this.selected = value
        this.$emit('input', value)
      }
    },
  }
}
</script>
