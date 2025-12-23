<template>
  <svg :width="svgWidth" :height="svgHeight"><g :transform="transform"><line class="timeline" :y2="innerHeight"></line><g class="link-layer" ref="linkLayer"></g><g class="label-layer" ref="labelLayer"></g><g class="dot-layer" ref="dotLayer"></g></g></svg>
</template>

<script>
import { scaleTime, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { extent } from 'd3-array'
import { select } from 'd3-selection'
import { linkHorizontal } from 'd3-shape'

export default {
  props: {
    events: {
      type: Array,
      required: true
    },

    width: {
      type: Number,
      default: 250
    },

    height: {
      type: Number,
      default: 350
    }
  },

  data() {
    return {
      margin: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      },
      svgWidth: this.width,
      svgHeight: this.height,
      layoutNodes: []
    }
  },

  computed: {
    innerHeight() {
      return this.svgHeight - this.margin.top - this.margin.bottom
    },

    transform() {
      return 'translate(' + this.margin.left + ',' + this.margin.top + ')'
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateLayout()
    })
  },

  watch: {
    events: 'updateLayout',
    width: 'updateLayout',
    height: 'updateLayout'
  },

  methods: {
    updateLayout() {
      if (!this.$el) return

      // 1. Calculate dimensions of labels
      // We need to render text to get BBox. We use a dummy text element in the SVG.
      const dummyGroup = select(this.$el).select('g')
      if (dummyGroup.empty()) return

      const dummyText = dummyGroup.append('text')

      const eventsWithDimensions = this.events.map(d => {
        const bbox = dummyText.text(d.label).node().getBBox()
        return {
          ...d,
          w: bbox.width,
          h: bbox.height
        }
      })

      dummyText.remove()

      // 2. Compute Layout (Simple Greedy Stacking)
      const timeScale = scaleTime()
        .domain(extent(this.events, d => d.date))
        .range([0, this.height - this.margin.top - this.margin.bottom]) // Use prop height for scale
        .nice()

      // Sort by date (idealPos)
      eventsWithDimensions.sort((a, b) => timeScale(a.date) - timeScale(b.date))

      const nodes = []
      let lastBottom = -Infinity
      const nodeHeight = 20 // Fixed rect height
      const spacing = 2 // Gap between nodes

      eventsWithDimensions.forEach(d => {
        const idealPos = timeScale(d.date)
        // Ensure we don't overlap with previous node.
        // If idealPos is far enough down, use it. Otherwise stack.
        // We centre the node at currentPos. The top is currentPos - nodeHeight/2.
        // But let's simplify: position = center y.
        // Node extends from y - 10 to y + 10.
        // lastBottom is the bottom edge of previous node.

        // Actually, let's treat currentPos as the vertical center of the node/rect,
        // consistent with previous 'd.y' usage where rect was at y-10.

        let y = idealPos
        const topEdge = y - nodeHeight / 2

        if (topEdge < lastBottom + spacing) {
          y = lastBottom + spacing + nodeHeight / 2
        }

        // Push slightly if it's too close?
        // The greedy approach ensures non-overlap.

        lastBottom = y + nodeHeight / 2

        nodes.push({
          data: d,
          idealPos: idealPos,
          currentPos: y,
          x: 60 // Fixed horizontal offset for labels
        })
      })

      this.layoutNodes = nodes

      // 3. Calculate new SVG dimensions
      // Bottom of last node
      const maxPos = lastBottom + 10 // Add some padding at bottom

      this.svgHeight = Math.max(this.height, maxPos + this.margin.top + this.margin.bottom)

      // 20 (margin-left) + 60 (layerGap) + 175 (rect width) + 20 (margin-right) = 275
      const requiredWidth = this.margin.left + 60 + 175 + this.margin.right
      this.svgWidth = Math.max(this.width, requiredWidth)

      this.draw()
    },

    draw() {
      if (!this.layoutNodes) return

      const colorScale = scaleOrdinal(schemeCategory10)
      const pathGenerator = linkHorizontal()
        .x(d => d.x)
        .y(d => d.y)

      const dotLayer = select(this.$refs.dotLayer)
      const labelLayer = select(this.$refs.labelLayer)
      const linkLayer = select(this.$refs.linkLayer)

      dotLayer.selectAll('circle').remove()
      labelLayer.selectAll('rect').remove()
      labelLayer.selectAll('text').remove()
      linkLayer.selectAll('path').remove()

      dotLayer.selectAll('circle.dot')
        .data(this.layoutNodes)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('fill', '#c2a53c')
        .attr('r', 3)
        .attr('cy', d => d.idealPos)

      const e = labelLayer.selectAll('rect.flag')
        .data(this.layoutNodes)
        .enter()
        .append('g')
        .attr('transform', d => 'translate(' + d.x + ',' + (d.currentPos - 10) + ')')

      e.append('rect')
        .attr('class', 'flag')
        .attr('width', 175)
        .attr('height', 20)
        .attr('rx', 2)
        .attr('ry', 2)
        .style('fill', (d, i) => colorScale(i))

      e.append('text')
        .attr('x', 4)
        .attr('y', 15)
        .attr('fill', '#fff')
        .text(d => d.data.label)

      linkLayer.selectAll('path.link')
        .data(this.layoutNodes)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d => {
          // Source: (0, idealPos), Target: (x, currentPos)
          return pathGenerator({
            source: { x: 0, y: d.idealPos },
            target: { x: d.x, y: d.currentPos }
          })
        })
        .attr('stroke-width', 2)
        .attr('opacity', 0.6)
        .attr('fill', 'none')
        .style('stroke', (d, i) => colorScale(i))
    }
  }
}
</script>

<style lang="sass" scoped>
svg
  border: none

line.timeline
  stroke-width: 2px
  stroke: #C2A53C
</style>

