<template>
  <div ref="map" class="map">
  </div>
</template>

<script>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection } from 'ol/proj'

import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
const projection = getProjection('EPSG:4326')
const tileSizeMtrs = getWidth(projection.getExtent()) / 256
const matrixIds = new Array(18)
const resolutions = new Array(18)
for (let i = 0; i < 19; ++i) {
  const pow = Math.pow(2, i)
  matrixIds[i] = i
  resolutions[i] = tileSizeMtrs / pow
}
export default {
  name: 'epsg-3857',
  data() {
    return {
      map: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new WMTS({
              url: 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk=eb6ea6e1715a5f581eca71813dc4317e',
              layer: 'vec',
              format: 'tiles',
              matrixSet: 'c',
              projection,
              tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projection.getExtent()),
                resolutions,
                matrixIds,
              }),
              style: 'default',
              wrapX: true,
            }),
          }),
          new TileLayer({
            source: new WMTS({
              url: 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk=eb6ea6e1715a5f581eca71813dc4317e',
              layer: 'cva',
              format: 'tiles',
              matrixSet: 'c',
              projection,
              tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projection.getExtent()),
                resolutions,
                matrixIds,
              }),
              style: 'default',
              wrapX: true,
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [104.912777, 34.730746],
          zoom: 5,
          projection,
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
