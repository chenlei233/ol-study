<template>
  <div ref="map" class="map">
    <div class="draw">
      <span v-for="item in operation" :key="item.type" @click="drawImg(item.type)">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, fromLonLat } from 'ol/proj'

import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import {Vector} from 'ol/source'
import {createBox} from 'ol/interaction/Draw'
import { Style, Stroke, Fill, Circle } from 'ol/style'
// import CircleStyle from 'ol/style/Circle'

import GeoJSON from 'ol/format/GeoJSON'
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
  name: 'draw-img',
  data() {
    return {
      map: null,
      vector: null,
      draw: null,
      vectorSource: null,
      operation: [
        {
          label: '点',
          type: 'Point'
        },
        {
          label: '线',
          type: 'LineString'
        },
        {
          label: '矩形',
          type: 'Circle'
        },
        {
          label: '多边形',
          type: 'Polygon'
        },
      ],
    }
  },
  mounted() {
    this.init()
    this.vectorSource = new Vector({ wrapX: false })
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
    drawImg(type) {
      this.map.removeInteraction(this.draw)
      // this.map.removeLayer(this.vector)
      this.vector = new VectorLayer({
        source: this.vectorSource,
        style: type !== 'Point' ? new Style({
          stroke: new Stroke({
            color: "red",
            width: 4,
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.8)",
          }),
        }) : new Style({
          image: new Circle({
            radius: 4,
            stroke: new Stroke({
              color: "red",
              width: 4,
            }),
            fill: new Fill({
              color: "red",
            }),
          })
        })
      })
      if (type === 'Circle') {
        this.draw = new Draw({
          source: this.vectorSource,
          type,
          geometryFunction: new createBox()
        })
      } else {
        this.draw = new Draw({
          source: this.vectorSource,
          type,
        })
      }
      this.map.addInteraction(this.draw)
      this.map.addLayer(this.vector)
      console.log(this.vectorSource)
      let featureGeoJson = JSON.parse(new GeoJSON().writeFeatures(this.vectorSource.getFeatures()))
        console.log(featureGeoJson)
      // this.draw.on('drawend', (e) => {
      //   let featureGeoJson = JSON.parse(new GeoJSON().writeFeature(e.feature))
      //   console.log(featureGeoJson)
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
}
.draw {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 20px;
  color: red;
  span {
    margin-right: 30px;
    cursor: pointer;
  }
}
</style>
