<template>
  <div ref="map" class="map">
    <span class="btn" @click="handleChange">北京</span>
  </div>
</template>

<script>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { getWidth, getTopLeft } from 'ol/extent'
import { get as getProjection, fromLonLat } from 'ol/proj'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { Image as ImageLayer } from 'ol/layer'
import { ImageWMS } from 'ol/source'
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
  name: 'wms-layer',
  data() {
    return {
      map: null,
      wmsLayer: null,
      CQL_FILTER: null,
    }
  },
  mounted() {
    this.init()
    this.wms()
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
    wms() {
      this.wmsLayer = new ImageLayer({
        source: new ImageWMS({
          url: 'http://114.116.246.55:7090/geoserver/lsyd/wms',
          params: {
            layers: 'lsyd:view_lsyd_dkxx_csba_jgrw',
            CQL_FILTER: this.CQL_FILTER
          },
        }),
      })
      this.map.addLayer(this.wmsLayer)
    },
    handleChange() {
      this.CQL_FILTER = `SXZQDM like '1101' and QDJSRQ >= 2022-08-17`
      this.wms()
    },
  },
}
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
}
.btn {
  position: absolute;
  z-index: 99;
  left: 50%;
  top: 20px;
  color: red;
  cursor: pointer;
}
</style>
