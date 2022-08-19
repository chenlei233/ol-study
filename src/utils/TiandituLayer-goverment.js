/*
 * @Author: chen zhen
 * @Date: 2018-10-23 11:27:03
 * @Last Modified by: chen zhen
 * @Last Modified time: 2019-07-20 16:32:02
 * @Description: openlayer 天地图类
 * 根据传入的参数,返回不同的天地图服务
 * 全部采用墨卡托的数据
 */

import TileLayer from 'ol/layer/Tile'

import { getWidth, getTopLeft } from 'ol/extent'

// import TileLayer from 'ol/layer/Tile.js'
import { get as getProjection } from 'ol/proj'

import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'

const projection = getProjection('EPSG:3857')
const tileSizePixels = 256
const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels
const matrixIds = []
const resolutions = []
for (let i = 0; i <= 18; i += 1) {
  matrixIds[i] = i
  resolutions[i] = tileSizeMtrs / (2 ** i)
}
const tileGrid = new WMTSTileGrid({
  origin: getTopLeft(projection.getExtent()),
  resolutions,
  matrixIds,
})

const TIANDITU_TK = '9df1e2d38f43b8983357c36603d366e5'

const DEFAULT_OPTION = {
  type: '影像底图',
  opacity: 1,
  source: undefined,
  visible: true,
  extent: undefined,
}

/**
 * 根据传入的不同类型名称，
 * 返回不同的地图名称
 * @param {String} layerName 图层的名称
 */

const getLayerInfo = (layerName) => {
  switch (layerName) {
    case '影像底图':
      return 'img_w'
    case '影像标注':
      return 'cia_w'
    case '地形底图':
      return 'ter_w'
    case '地形标注':
      return 'cta_w'
    case '矢量底图':
      return 'vec_w'
    case '矢量标注':
      return 'cva_w'
    case '边界-影像':
      return 'ibo_w'
    case '边界-地形':
      return 'tbo_w'

    default:
      return 'img_w' // 默认为影像底图
  }
}

/**
 * 获取对应的urls
 * @param {String} type 地图英文名称
 */

class TiandituLayer {
  constructor(option) {
    const {
      id,
      opacity,
      type,
      visible,
      extent,
    } = Object.assign(DEFAULT_OPTION, option)

    const layerName = getLayerInfo(type)

    const layer = new TileLayer({
      id,
      name: option.id,
      opacity, // 可见度
      source: new WMTS({
        url: `http://t{0-7}.tianditu.gov.cn/${layerName}/wmts?tk=${TIANDITU_TK}`,
        layer: layerName.match(/^[a-z]*/)[0],
        format: 'tiles',
        matrixSet: 'w', // w 对应的为Web墨卡托投影
        tileGrid,
        style: 'default',
        wrapX: true,
      }),
      visible, // 是否可见
      extent, // 视野范围
    })
    return layer
  }
}

export default TiandituLayer
