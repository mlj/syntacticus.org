<template>
  <svg :width="svgWidth" :height="svgHeight" ref="svg">
    <rect x="0" y="0" :width="svgWidth" :height="svgHeight" class="zoom-layer"></rect>

    <g :transform="marginTransform">
      <g :transform="zoomTransform">
        <slot></slot>
      </g>
    </g>
  </svg>
</template>

<script>
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';

export default {
  data() {
    return {
      width: 1200 - 20,
      height: 480 - 20,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },

      zoomExtent: [0.1, 3],
      zoomTransform: 'translate(0,0) scale(1)',
    }
  },

  computed: {
    svgWidth() {
      return this.width + this.margin.left + this.margin.right;
    },

    svgHeight() {
      return this.height + this.margin.top + this.margin.bottom;
    },

    marginTransform() {
      return `translate(${this.margin.left},${this.margin.right})`;
    },
  },

  mounted() {
    const svg = select(this.$refs.svg);
    const z = zoom()
      .scaleExtent(this.zoomExtent)
      .on('zoom', (event) => {
        this.zoomTransform = event.transform;
      });

    svg.call(z);
  }
}
</script>

<style>
.zoom-layer {
  fill: #ffffff;
}
</style>
