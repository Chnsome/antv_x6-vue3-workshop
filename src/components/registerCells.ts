import { register } from '@antv/x6-vue-shape'
import Foo from './vue-nodes/Foo.vue'
import Bar from './vue-nodes/Bar.vue'

// #region 初始化连接桩
const ports = {
  // 输出链接桩群组定义
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 10,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 10,
          magnet: true,
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 10,
          fill: '#fff',
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          style: {
            visibility: 'hidden',
          },
          r: 10,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    },
  },
  // 可以自定义每一条边有多少个连接桩
  items: [
    {
      id: "top",
      group: "top"
    },
    {
      id: "right1",
      group: "right"
    },
    {
      id: "right2",
      group: "right"
    },
    {
      id: "right3",
      group: "right"
    },
    {
      id: "right4",
      group: "right"
    },
    {
      id: "right5",
      group: "right"
    },
    {
      id: "bottom",
      group: "bottom"
    },
    {
      id: "left1",
      group: "left"
    },
    {
      id: "left2",
      group: "left"
    },
    {
      id: "left3",
      group: "left"
    },
    {
      id: "left4",
      group: "left"
    },
    {
      id: "left5",
      group: "left"
    },
  ]
}
// #endregion

register({
  shape: 'foo',
  component: Foo,
  ports: { ...ports },
})
register({
  shape: 'bar',
  component: Bar,
  ports: { ...ports },
})
