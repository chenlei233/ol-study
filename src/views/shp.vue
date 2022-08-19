<template>
  <div ref="map" class="map">
    <div class="btn">
      <span @click="handleIndex">修改层级</span>
      <span @click="handleColor">修改wms服务样式</span>
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
      squareLayer: null,
      zIndex: 0,
      color: 'color:ffff00;'
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
            CQL_FILTER: this.CQL_FILTER,
          },
        }),
        zIndex: this.zIndex,
      })
      this.map.addLayer(this.wmsLayer)
      this.squareLayer = new ImageLayer({
        source: new ImageWMS({
          url: 'http://localhost:8088/geoserver/test/wms',
          params: {
            layers: 'test:layer',
            env: this.color
          },
        }),
      })
      this.map.addLayer(this.squareLayer)
    },
    handleIndex() {
      this.zIndex = this.zIndex === 0 ? 30 :0
      this.map.removeLayer(this.squareLayer)
      this.map.removeLayer(this.wmsLayer)
      this.wms()
    },
    handleColor() {
      this.color = this.color === 'color:00ffff' ? 'color:ffff00;' : 'color:00ffff'
      this.map.removeLayer(this.squareLayer)
      this.map.removeLayer(this.wmsLayer)
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
  span {
    margin-right: 30px;
  }
}
</style>
