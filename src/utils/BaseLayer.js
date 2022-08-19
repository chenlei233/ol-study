/*
 * @Author: chen zhen
 * @Date: 2018-10-27 15:35:32
 * @Last Modified by: chen zhen
 * @Last Modified time: 2019-07-20 16:31:32
 * @Description 基础地图底图图层类
 */

import _ from 'lodash'

import TiandituLayer from './TiandituLayer-goverment'

const MAP_LIST = [
  {
    name: 'TiandituLayerVecW',
    label: '天地图-全球矢量地图服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerVecW',
      type: '矢量底图',
    })),
  },
  {
    name: 'TiandituLayerVcaW',
    label: '天地图-全球矢量中文注记服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerVcaW',
      type: '矢量标注',
    })),
  },
  {
    name: 'TiandituLayerImgW',
    label: '天地图-全球影像地图服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerImgW',
      type: '影像底图',
    })),
  },
  {
    name: 'TiandituLayerCiaW',
    label: '天地图-全球影像中文注记服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerCiaW',
      type: '影像标注',
    })),
  },
  {
    name: 'TiandituLayerTerW',
    label: '天地图-全球地形晕渲地图服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerTerW',
      type: '地形底图',
    })),
  },
  {
    name: 'TiandituLayerCtaW',
    label: '天地图-全球地形中文标记服务',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerCtaW',
      type: '地形标注',
    })),
  },
  {
    name: 'TiandituLayerIboW',
    label: '天地图-全球行政边界服务（影像）',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerIboW',
      type: '边界-影像',
    })),
  },
  {
    name: 'TiandituLayerTboW',
    label: '天地图-全球行政边界服务（地形）',
    layer: () => (new TiandituLayer({
      id: 'TiandituLayerTboW',
      type: '边界-地形',
    })),
  },
]

let mapListNameCache = null // 用于懒缓存地图的name属性

/**
 * 支持的地图底图的图层数据，可以进行全局获取，亦可以根据对应的编码进行获取
 */
class BaseLayer {
  /**
   * 返回支持的地图图层的数据
   */
  static MapList() {
    return _.cloneDeep(MAP_LIST)
  }

  /**
   * 返回支持的底图对应的名称（name属性）
   */
  static MapListName() {
    if (_.isNull(mapListNameCache)) {
      mapListNameCache = MAP_LIST.map(i => i.name)
    }
    return mapListNameCache
  }

  /**
   * 获取某个基础地图底图
   * @param {String} baseLayerName 基础地图底图的名称
   * @param {Object} option 底图的设置项
   * @return {Layer | null} 返回的底图
   */
  static BaseLayer(baseLayerName, option = null) {
    if (_.isString(baseLayerName) && (_.isObject(option) || _.isNull(option))) {
      const baseLayer = MAP_LIST.find(i => i.name === baseLayerName)
      if (baseLayer) return baseLayer.layer(option)

      // 如果为一个警告更为好一点
      console.warn(`${baseLayerName} is not supported baseLayer Name. Please use 'MapPlus.BaseLayer.MapListName' to query`)
      // throw new RangeError(`${baseLayerName} is not supported baseLayer Name. Please use 'MapPlus.BaseLayer.MapListName' to query`)
    } else if (!_.isString(baseLayerName)) {
      throw new TypeError(`baseLayerName: ${baseLayerName} id not String`)
    } else if (!_.isObject(option) && !_.isNull(option)) {
      throw new TypeError(`option: ${option} id not object or not null`)
    } else {
      // null
    }
    return null
  }
}

export default BaseLayer
