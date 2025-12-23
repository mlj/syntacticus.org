<template>
  <svg :width="svgWidth" :height="svgHeight"><g :transform="transform"><line class="timeline" :y2="innerHeight"></line><g class="link-layer" ref="linkLayer"></g><g class="label-layer" ref="labelLayer"></g><g class="dot-layer" ref="dotLayer"></g></g></svg>
</template>

<script>
import { scaleTime, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { extent } from 'd3-array'
import { select } from 'd3-selection'

import labella from 'labella'

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
    },

    nodeHeight() {
      return this.layoutNodes[0] ? this.layoutNodes[0].width : 0
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
      if (dummyGroup.empty()) return // Should not happen if mounted

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

      // 2. Compute Layout (Labella Force)
      const timeScale = scaleTime()
        .domain(extent(this.events, d => d.date))
        .range([0, this.height - this.margin.top - this.margin.bottom]) // Use prop height for scale
        .nice()
      
      const nodes = eventsWithDimensions.map(d => new labella.Node(timeScale(d.date), d.h + 2, d))
      
      // Force simulation to prevent overlap
      this.layoutNodes = new labella.Force({ minPos: -10 }).nodes(nodes).compute().nodes()
      
      // 3. Calculate new SVG dimensions
      // currentPos is center of rect (height 20). Bottom is +10.
      const maxPos = this.layoutNodes.length > 0 
        ? Math.max(...this.layoutNodes.map(n => n.currentPos)) + 10 
        : 0
      
      this.svgHeight = Math.max(this.height, maxPos + this.margin.top + this.margin.bottom)
      
      // 20 (margin-left) + 60 (layerGap) + 175 (rect width) + 20 (margin-right) = 275
      const requiredWidth = this.margin.left + 60 + 175 + this.margin.right
      this.svgWidth = Math.max(this.width, requiredWidth)
      
      this.draw()
    },

    draw() {
      if (!this.layoutNodes) return

      const renderer = new labella.Renderer({
        layerGap: 60,
        nodeHeight: this.nodeHeight,
        direction: 'right'
      })
      renderer.layout(this.layoutNodes)

      const colorScale = scaleOrdinal(schemeCategory10)

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
        .attr('cy', d => d.getRoot().idealPos)

      const e = labelLayer.selectAll('rect.flag')
        .data(this.layoutNodes)
        .enter()
        .append('g')
        .attr('transform', d => 'translate(' + d.x + ',' + (d.y - 10) + ')') // FIXME: 'translate(' + d.x + ',' + (d.y - d.dy / 2) + ')')

      // FIXME: For some reason the rect w/h change after transitions, as does the relative positioning. Why?
      e.append('rect')
        .attr('class', 'flag')
        .attr('width', 175) // FIXME: d => d.data.w + 9)
        .attr('height', 20) // FIXME: d => d.dy)
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
        .attr('d', d => renderer.generatePath(d))
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

