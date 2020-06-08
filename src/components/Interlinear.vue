<template>
  <div class="content">
    <div class="interlinear">
      <template v-for="token in tokens">
        <div class="intlin" >
          <span :lang="language" class="form">
            <span v-if="showPresentationData">{{ token.presentation_before }}</span>{{ token.form }}<span v-if="showPresentationData">{{ token.presentation_after }}</span>
          </span>
          <span v-if="showPartOfSpeech" class="annotation">
            {{ token.part_of_speech | partOfSpeech }}
          </span>
          <span v-if="showLemmata" :lang="language" class="annotation">
            <em><router-link to="{ name: 'lemma', params: { language: language, lemma: token.lemma, part_of_speech: token.part_of_speech }}">{{ token.lemma }}</router-link></em>
          </span>
          <span v-if="showGlosses" class="annotation">{{ token.glosses.eng | printGloss }}</span>
        </div>

        <div class="intlin">
          <span class="form space">&nbsp;</span>
          <span v-if="showPartOfSpeech" class="annotation space">&nbsp;</span>
          <span v-if="showLemmata" class="annotation space">&nbsp;</span>
          <span v-if="showGlosses" class="annotation space">&nbsp;</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import filterMixin from '../filters'
import annotationSchema from '../data/schema.json'

export default {
  mixins: [filterMixin],

  data() {
    return {
      schema: annotationSchema
    }
  },

  props: {
    language: String,
    tokens: Array,

    showGlosses: {
      type: Boolean,
      default: true
    },

    showLemmata: {
      type: Boolean,
      default: true
    },

    showPartOfSpeech: {
      type: Boolean,
      default: true
    },

    showPresentationData: {
      type: Boolean,
      default: true
    }
  },

  filters: {
    printGloss(v) {
      return v === undefined ? '' : `‘${v}’`
    }
  }
}
</script>

<style lang="sass">
.interlinear
  clear: both
  text-align: left

  .intlin
    float: left
    text-align: left
    margin-bottom: 1.2em

    .form
      display: block
      font-size: 1.3em
      text-align: center

    .space
      width: 1em

    .annotation
      display: block
      text-align: center
      color: grey

.interlinear:after
  visibility: hidden
  display: block
  font-size: 0
  content: " "
  clear: both
  height: 0
</style>
