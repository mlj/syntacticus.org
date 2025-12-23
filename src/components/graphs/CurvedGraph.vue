<template>
  <vis-base class="curved-graph">
    <g v-for="n in nodes" :class="{ selected1: n.parent == selected, selected2: n.id == selected }">
      <g v-if="!n.isSecondary" @mouseover="selected = n.id" @mouseout="selected = -1" class="token">
        <text class="word" :x="wordWidth * n.id" :y="treeHeight - wordHeight" :class="{ root: n.id == 0 }">{{ n.word }}</text>
        <text class="tag" :x="wordWidth * n.id" :y="treeHeight">{{ n.tag | partOfSpeech }}</text>
        <text class="lemma" :x="wordWidth * n.id" :y="treeHeight + 16">{{ n.lemmaForm }}</text>
      </g>
      <g v-if="n.id" class="edge">
        <text class="edge-dependency" :x="n.mid" :y="n.arrow - 7">{{ n.dependency }}</text>
        <path class="edge-line" :class="{ secondary: n.isSecondary }" :d="edgePath(n)" />
        <path class="edge-arrow" :class="{ secondary: n.isSecondary }" :d="arrowPath" :transform="arrowTransform(n)" />
      </g>
    </g>
  </vis-base>
</template>

<script>
import { symbol, symbolTriangle } from 'd3-shape'
import VisBase from './BaseGraph.vue';

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

    wordWidth: function() { return 120; },

    wordHeight: function() { return 25; },

    treeWidth: function() { 
      // Count unique nodes for width calculation, excluding secondary edges
      const uniqueNodes = new Set(this.data.map(d => d.id)).size;
      return this.wordWidth * uniqueNodes - this.wordWidth / 3; 
    },

    treeHeight: function() {
      const maxLevel = Math.max(...this.data.map(edge => edge.level));
      return this.levelHeight(maxLevel) + 2 * this.wordHeight;
    },

    nodes: function() {
      var that = this;
      this.data.forEach(function(item) {
        item.bottom = that.treeHeight - 1.8 * that.wordHeight;
        item.top = item.bottom - that.levelHeight(item.level);
        item.left = item.id * that.wordWidth;
        // FIXME: item.parent || 0 for ROOT
        item.right = (item.parent || 0) * that.wordWidth;
        item.mid = (item.right + item.left) / 2;
        item.diff = (item.right - item.left) / 4;
        item.arrow = item.top + (item.bottom - item.top) * 0.25;
      });
      return this.data;
    }
  },

  methods: {
    edgePath: function(n) {
      return 'M' + n.left + ',' + n.bottom + ' C' + (n.mid - n.diff) + ',' + n.top + ' ' + (n.mid + n.diff) + ',' + n.top + ' ' + n.right + ',' + n.bottom;
    },

    arrowTransform: function(n) {
      let angle = (n.id < n.parent) ? 90 : -90;

      if (n.isSecondary) {
        angle = -angle;
      }

      return 'translate(' + n.mid + ',' + n.arrow + ') rotate(' + angle + ')';
    },

    levelHeight: function(level) { return 2 + (level ** 1.5) * 25; },

    computeEdgeLevels: function(data) {
      let edges = data.filter(function(item) { return item.id });
      let len = edges.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
          let edge1 = edges[j];

          let edgesUnder = edges.filter(edge2 => {
            let ma;
            let mi;

            // Native replacement for _.sortBy([edge1.id, edge1.parent || 0])
            // Just use Math.min/max directly
            mi = Math.min(edge1.id, edge1.parent || 0);
            ma = Math.max(edge1.id, edge1.parent || 0);

            let mi2 = Math.min(edge2.id, edge2.parent || 0);
            let ma2 = Math.max(edge2.id, edge2.parent || 0);

            // Use _uid to differentiate distinct edges that might share the same source (id)
            if (edge1._uid === edge2._uid) return false;

            const contained = edge2.id >= mi && edge2.parent >= mi && edge2.id <= ma && edge2.parent <= ma;

            if (contained) {
              // If ranges are identical, use uid as tie-breaker to stack them
              if (mi === mi2 && ma === ma2) {
                return edge2._uid < edge1._uid;
              }
              return true;
            }
            return false;
          });

          // _.max returns -Infinity for empty list, or undefined? Lodash max returns undefined for empty array.
          // Math.max returns -Infinity for empty args.
          const levels = edgesUnder.map(f => f.level);
          const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;
          edge1.level = 1 + maxLevel;
        }
      }

      return data;
    },

    parse: function(tokens) {
      let data = [];
      let uidCounter = 0;

      data.push({
        id: 0,
        word: 'ROOT',
        level: 0,
        isSecondary: false,
        _uid: uidCounter++
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
        if (t.empty_token_sort !== 'P') {
          // Primary edge
          data.push({
            id: indexes[t.id],
            word: t.form || 'EMPTY',
            lemmaForm: t.variant ? [t.lemma, t.variant].join('#') : t.lemma,
            tag: t.part_of_speech || t.empty_token_sort + '-',
            parent: indexes[t.head_id],
            dependency: t.relation,
            level: 1,
            isSecondary: false,
            _uid: uidCounter++
          });

          // Secondary edges
          if (t.slashes) {
            t.slashes.forEach(slash => {
              const targetId = slash[1]; // API: [relation, target_id]
              const relation = slash[0];
              
              if (indexes[targetId] !== undefined) {
                 data.push({
                  id: indexes[t.id],
                  word: '', // Not used
                  lemmaForm: '', // Not used
                  tag: '', // Not used
                  parent: indexes[targetId],
                  dependency: relation,
                  level: 1,
                  isSecondary: true,
                  _uid: uidCounter++
                 });
              }
            });
          }
        }
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

.lemma
  fill: #777
  text-anchor: middle
  font-style: italic

.edge-line
  stroke: #ccc
  stroke-width: 1.5
  fill: none

.edge-line.secondary
  stroke-dasharray: 5, 5

.edge-arrow
  stroke: #ccc
  stroke-width: 1.5
  fill: none

.edge-arrow.secondary
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
