<template>
  <div ref="map" class="map">
  </div>
</template>

<script>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, fromLonLat } from 'ol/proj'

import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import testJson from '@/enum/json'
import {Vector as VectorSource} from 'ol/source'
import { Style, Stroke, Fill, Circle } from 'ol/style'

const projection = getProjection('EPSG:3857')
const tileSizeMtrs = getWidth(projection.getExtent()) / 256
const matrixIds = new Array(18)
const resolutions = new Array(18)
for (let i = 0; i < 19; ++i) {
  const pow = Math.pow(2, i)
  matrixIds[i] = i
  resolutions[i] = tileSizeMtrs / pow
}

export default {
  name: 'vector-layer',
  data() {
    return {
      map: null,
      draw: null,
      layer: null,
    }
  },
  mounted() {
    this.init()
    this.drawImg()
  },
  methods: {
    init() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new WMTS({
              url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk=eb6ea6e1715a5f581eca71813dc4317e',
              layer: 'vec',
              format: 'tiles',
              matrixSet: 'w',
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
              url: 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk=eb6ea6e1715a5f581eca71813dc4317e',
              layer: 'cva',
              format: 'tiles',
              matrixSet: 'w',
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
          center: fromLonLat([104.912777, 34.730746]),
          zoom: 5,
        })
      })
    },
    drawImg() {
      const sourceLayer = new VectorLayer()
      const sourceVector = new VectorSource()
      sourceLayer.setSource(sourceVector)
      this.map.addLayer(sourceLayer)
      sourceLayer.setStyle(new Style({
         image: new Circle({
            radius: 4,
            stroke: new Stroke({
              color: "red",
              width: 4,
            }),
            fill: new Fill({
              color: "red",
            }),
          }),
        stroke: new Stroke({
            color: "red",
            width: 4,
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.8)",
          }),
      }))
      sourceVector.addFeatures(new GeoJSON().readFeatures(testJson))
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
