<template>
  <vis-base class="curved-graph">
    <g v-for="n in nodes" :class="{ selected1: n.parent == selected, selected2: n.id == selected }">
      <g @mouseover="selected = n.id" @mouseout="selected = -1" class="token">
        <text class="word" :x="wordWidth * n.id" :y="treeHeight - wordHeight" :class="{ root: n.id == 0 }">{{ n.word }}</text>
        <text class="tag" :x="wordWidth * n.id" :y="treeHeight">{{ n.tag | partOfSpeech }}</text>
        <text class="lemma" :x="wordWidth * n.id" :y="treeHeight + 16">{{ n.lemmaForm }}</text>
      </g>
      <g v-if="n.id" class="edge">
        <text class="edge-dependency" :x="n.mid" :y="n.arrow - 7">{{ n.dependency }}</text>
        <path class="edge-line" :d="edgePath(n)" />
        <path class="edge-arrow" :d="arrowPath" :transform="arrowTransform(n)" />
      </g>
    </g>
  </vis-base>
</template>

<script>
import { symbol, symbolTriangle } from 'd3-shape'
import VisBase from './BaseGraph.vue';
import _ from '../../mylodash';

export default {
  components: {
    VisBase
  },

  data () {
    return {
      selected: -1
    }
  },

  props: ['tokens'],

  computed: {
    arrowPath: function() { return symbol().type(symbolTriangle).size(5)(); },

    data: function() { return this.computeEdgeLevels(this.parse(this.tokens)); },

    wordWidth: function() { return 110; },

    wordHeight: function() { return 20; },

    treeWidth: function() { return this.wordWidth * this.data.length - this.wordWidth / 3; },

    treeHeight: function() { return this.levelHeight(_.max(_.map(this.data, function(edge) { return edge.level }))) + 2 * this.wordHeight; },

    nodes: function() {
      var that = this;
      return _.each(this.data, function(item) {
        item.bottom = that.treeHeight - 1.8 * that.wordHeight;
        item.top = item.bottom - that.levelHeight(item.level);
        item.left = item.id * that.wordWidth;
        // FIXME: item.parent || 0 for ROOT
        item.right = (item.parent || 0) * that.wordWidth;
        item.mid = (item.right + item.left) / 2;
        item.diff = (item.right - item.left) / 4;
        item.arrow = item.top + (item.bottom - item.top) * 0.25;
      });
    }
  },

  methods: {
    edgePath: function(n) {
      return 'M' + n.left + ',' + n.bottom + ' C' + (n.mid - n.diff) + ',' + n.top + ' ' + (n.mid + n.diff) + ',' + n.top + ' ' + n.right + ',' + n.bottom;
    },

    arrowTransform: function(n) {
      return 'translate(' + n.mid + ',' + n.arrow + ') rotate(' + (n.id < n.parent ? '' : '-') + '90)';
    },

    levelHeight: function(level) { return 2 + (level ** 1.5) * 25; },

    computeEdgeLevels: function(data) {
      let edges = _.filter(data, function(item) { return item.id });
      let len = edges.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
          let edge1 = edges[j];

          let edgesUnder = _.filter(edges, edge2 => {
            let ma;
            let mi;

            [mi, ma] = _.sortBy([edge1.id, edge1.parent || 0]); // FIXME: 0 due to ROOT having no parent

            return edge1.id !== edge2.id && edge2.id >= mi && edge2.parent >= mi && edge2.id <= ma && edge2.parent <= ma;
          });

          edge1.level = 1 + (_.max(_.map(edgesUnder, f => f.level)) || 0);
        }
      }

      return data;
    },

    parse: function(tokens) {
      let data = [];

      data.push({
        id: 0,
        word: 'ROOT',
        level: 0
      });

      let indexes = {};
      let j = 1; // Offset by one to make room for the ROOT symbol

      tokens.forEach((t, i) => {
        if (t.empty_token_sort !== 'P') {
          indexes[t.id] = j;
          j++;
        }
      });

      tokens.forEach(t => {
        if (t.empty_token_sort !== 'P')
          data.push({
            id: indexes[t.id],
            word: t.form || 'EMPTY',
            lemmaForm: t.variant ? [t.lemma, t.variant].join('#') : t.lemma,
            tag: t.part_of_speech || t.empty_token_sort + '-',
            parent: indexes[t.head_id],
            dependency: t.relation,
            level: 1
          })
      });

      return data;
    }
  }
}
</script>

<style lang="sass" scoped>
.word
  fill: #555
  text-anchor: middle
  cursor: default

.tag
  fill: #777
  text-anchor: middle
  font-size: 90%

.lemma
  fill: #777
  text-anchor: middle
  font-size: 90%
  font-style: italic

.edge-line
  stroke: #ccc
  stroke-width: 1.5
  fill: none

.edge-arrow
  stroke: #ccc
  stroke-width: 1.5
  fill: none

.edge-dependency
  fill: black
  text-anchor: middle
  font-size: 90%

.selected1 .edge path
  stroke: #f276b1 !important

.selected1 .edge text
  fill: #f276b1 !important

.selected2 .edge path
  stroke: #3276b1 !important

.selected2 .edge text
  fill: #3276b1 !important

.selected2 .token text
  fill: #3276b1 !important

.word.root
  fill: #ccc
</style>
