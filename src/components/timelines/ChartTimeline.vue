<template>
  <svg :width="svgWidth" :height="svgHeight">
    <g ref="svg" :transform="transform">
    </g>
  </svg>
</template>

<script>
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';

import _ from '../../mylodash';

export default {
  data() {
    return {
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
      },

      totalWidth: 600,
      totalHeight: 300,
    };
  },

  props: {
    events: {
      type: Array,
      required: true
    },
  },

  computed: {
    width() {
      return this.totalWidth - this.margin.left - this.margin.right;
    },

    height() {
      return this.totalHeight - this.margin.top - this.margin.bottom;
    },

    svgWidth() {
      return this.width + this.margin.left + this.margin.right;
    },

    svgHeight() {
      return this.height + this.margin.top + this.margin.bottom;
    },

    transform() {
      return `translate(${this.margin.left},${this.margin.top})`;
    },

    data() {
      return _.sortBy(this.events.filter(d => d.year > 0), d => d.year);
    }
  },

  mounted() {
    this.$nextTick(() => this.draw());
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
      // Derived from the example here https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4.
      let x = scaleBand()
                .range([0, this.width])
                .padding(0.1);
      let y = scaleLinear()
                .range([this.height, 0]);

      let svg = select(this.$refs['svg']);

      x.domain(this.data.map(function(d) { return d.year; }));
      y.domain([0, max(this.data, function(d) { return d.n; })]);

      svg.selectAll(".bar")
          .data(this.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.year); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.n); })
          .attr("height", (d) => { return this.height - y(d.n); });

      svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(axisBottom(x));

      svg.append("g")
          .call(axisLeft(y));
    }
  }
};
</script>

<style>
.bar { fill: #A88ABF; }
</style>