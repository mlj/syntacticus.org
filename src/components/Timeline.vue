<template>
  <svg :width="width" :height="height"><g :transform="transform"><line class="timeline" :y2="innerHeight"></line><g class="link-layer" ref="linkLayer"></g><g class="label-layer" ref="labelLayer"></g><g class="dot-layer" ref="dotLayer"></g></g></svg>
</template>

<script>
import { scaleTime, schemeCategory10, scaleOrdinal } from 'd3-scale'
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
      default: 300
    },

    height: {
      type: Number,
      default: 600
    }
  },

  data() {
    return {
      margin: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    }
  },

  computed: {
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom
    },

    transform() {
      return 'translate(' + this.margin.left + ',' + this.margin.top + ')'
    },

    nodesWithBBoxes() {
      const dummy = select(this.$el).select('g').append('text')

      const n = this.events.map(d => {
        const bbox = dummy.text(d.label).node().getBBox()

        d.h = bbox.height
        d.w = bbox.width
        return d
      })

      dummy.remove()

      return n
    },

    nodes() {
      const timeScale = scaleTime()
        .domain(extent(this.events, d => d.date))
        .range([0, this.innerHeight])
        .nice()

      const n = this.nodesWithBBoxes.map(d => new labella.Node(timeScale(d.date), d.h + 2, d))

      return new labella.Force({ minPos: -10 }).nodes(n).compute().nodes()
    },

    nodeHeight() {
      return this.nodes[0] ? this.nodes[0].width : 0
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.draw()
    })
  },

  watch: {
    events(n, o) {
      this.$nextTick(() => {
        this.draw()
      })
    }
  },

  methods: {
    draw() {
      const renderer = new labella.Renderer({
        layerGap: 60,
        nodeHeight: this.nodeHeight,
        direction: 'right'
      })
      renderer.layout(this.nodes)

      const colorScale = scaleOrdinal(schemeCategory10)

      const dotLayer = select(this.$refs.dotLayer)
      const labelLayer = select(this.$refs.labelLayer)
      const linkLayer = select(this.$refs.linkLayer)

      dotLayer.selectAll('circle').remove()
      labelLayer.selectAll('rect').remove()
      labelLayer.selectAll('text').remove()
      linkLayer.selectAll('path').remove()

      dotLayer.selectAll('circle.dot')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('fill', '#c2a53c')
        .attr('r', 3)
        .attr('cy', d => d.getRoot().idealPos)

      const e = labelLayer.selectAll('rect.flag')
        .data(this.nodes)
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
        .data(this.nodes)
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

