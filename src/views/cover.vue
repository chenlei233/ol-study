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
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import {Vector as VectorSource} from 'ol/source'
import { Style, Stroke, Fill } from 'ol/style'
import {
  asArray,
} from 'ol/color'
const projection = getProjection('EPSG:3857')
const tileSizeMtrs = getWidth(projection.getExtent()) / 256
const matrixIds = new Array(18)
const resolutions = new Array(18)
for (let i = 0; i < 19; ++i) {
  const pow = Math.pow(2, i)
  matrixIds[i] = i
  resolutions[i] = tileSizeMtrs / pow
}
const geoJSON = new GeoJSON({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
})
const VECTOR_LAYER_DEFAULT_STYLE = new Style({
  stroke: new Stroke({
    color: 'rgba(100, 100, 100, 0.8)',
    width: 0.5,
  }),
  fill: new Fill({
    color: 'rgba(21, 170, 200, 0.66)', // 默认颜色
  }),
})
const SET_FILL_COLOR_OPACITY = (color, opacity = 0.6) => {
  console.log(color)
  let highAlpColor = asArray(color)
  highAlpColor = highAlpColor.slice()
  highAlpColor[3] = opacity
  return highAlpColor
}
const COLORS = [
  '#f8f4b8',
  '#f3e68a',
  '#f3dc84',
  '#eec875',
  '#eab459',
  '#e79a4e',
  '#da922d',
  '#d7642a',
  '#cd4a2b',
  '#c55644',
]
const STYLE_LIST = COLORS.map((color) => {
  const style = VECTOR_LAYER_DEFAULT_STYLE.clone()
  style.setFill(new Fill({ color: SET_FILL_COLOR_OPACITY(color) }))
  return style
})
export default {
  name: 'epsg-3857',
  data() {
    return {
      map: null,
      regionList: [],
      regionVectorSource: null,
      regionSourceLayer: null,
    }
  },
  mounted() {
    this.init()
    this.getRegion()
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
          center: fromLonLat([108.948024, 34.263161]),
          zoom: 6,
        })
      })
    },
    async getRegion() {
      const res = await this.$axios.get('http://www.sasclouds.com/api/region/v1/region/pid/610000/l')
      this.regionList = res.data.data
      this.regionVectorSource = new VectorSource()
      const features = this.regionList.map(({regionId, regionName, boundary}, index) => {
        const feature = geoJSON.readFeature(boundary)
        const porperties = {
            regionId,
            regionName,
            filterData: index,
            regionInfo: null,
          }
        feature.setProperties(porperties)
        return feature
      })
      this.regionVectorSource.addFeatures(features)
      this.map.addLayer(new VectorLayer({
        source: this.regionVectorSource,
        style: (feature) => {
          const porperties = feature.getProperties()
          const level = porperties.filterData
          return STYLE_LIST[level]
        }
      }))
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
