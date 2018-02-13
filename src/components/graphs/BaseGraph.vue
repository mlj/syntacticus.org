<template>
  <svg :width="svgWidth" :height="svgHeight">
    <rect x="0" y="0" :width="svgWidth" :height="svgHeight" class="zoom-layer"></rect>

    <g :transform="marginTransform">
      <g :transform="zoomTransform">
        <slot></slot>
      </g>
    </g>

    <g>
      <circle cx="50" cy="50" r="42" fill="white" opacity="0.75"/>
      <path class="button" @click="panThing(0,50)" d="M50 10 l12 20 a40,70 0 0,0 -24,0z" />
      <path class="button" @click="panThing(50,0)" d="M10 50 l20 -12 a70,40 0 0,0 0,24z" />
      <path class="button" @click="panThing(0,-50)" d="M50 90 l12 -20 a40,70 0 0,1 -24,0z" />
      <path class="button" @click="panThing(-50,0)" d="M90 50 l-20 -12 a70,40 0 0,1 0,24z" />
      <circle class="compass" cx="50" cy="50" r="20"/>
      <circle class="button"  cx="50" cy="41" r="8" @click="zoomThing(0.8)"/>
      <circle class="button"  cx="50" cy="59" r="8" @click="zoomThing(1.25)"/>
      <rect class="plus-minus" x="46" y="39.5" width="8" height="3"/>
      <rect class="plus-minus" x="46" y="57.5" width="8" height="3"/>
      <rect class="plus-minus" x="48.5" y="55" width="3" height="8"/>
    </g>
  </svg>
</template>

<script>
// The 'compass' in this component, which is a temporary replacement for D3's zoom/pan functions, was borrowed from http://www.petercollingridge.co.uk/interactive-svg-components/pan-and-zoom-control.
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';

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

      zoomTransform: 'matrix(1 0 0 1 0 0)',

      transMatrix: [1, 0, 0, 1, 0, 0],
    }
  },

  methods: {
    panThing(dx, dy) {
      this.transMatrix[4] += dx;
      this.transMatrix[5] += dy;

      this.zoomTransform = "matrix(" +  this.transMatrix.join(' ') + ")";
    },

    zoomThing(scale) {
      for (let i = 0; i < this.transMatrix.length; i++)
        this.transMatrix[i] *= scale;

      this.transMatrix[4] += (1 - scale) * this.width/2;
      this.transMatrix[5] += (1 - scale) * this.height/2;

      this.zoomTransform = "matrix(" +  this.transMatrix.join(' ') + ")";
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
    this.zoomThing(0.75);

// FIXME: This doesn't work
//    const _zoom = zoom()
//      .scaleExtent(this.zoomExtent)
//      .on('zoom', () => {
//        this.zoomTransform = event.transform;
//      });
//    select('zoom-layer').call(_zoom);
  }
}
</script>

<style>
.zoom-layer {
  fill: #ffffff;
}
.compass {
  fill: #fff;
  stroke: #000;
  stroke-width: 1.5;
}
.button {
  fill: #A88ABF;
  stroke: #0C2C84;
  stroke-miterlimit: 6;
  stroke-linecap: round;
}
.plus-minus {
  fill: #fff;
  pointer-events: none;
}
</style>
