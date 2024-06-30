<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Graph, Shape, type Cell } from '@antv/x6';
import { useResizeObserver } from '@vueuse/core'
import './registerCells'
import cells from './cells.json'

// 引入插件
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'

// 导航图响应式显示
const outer = ref(null)

useResizeObserver(outer, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  graph.value && resizeGraph(graph.value, width, height)
})
const resizeGraph = (graph: Graph, width: number, height: number) => {
  graph.resize(width, height)
  // 图表居中显示
  // graph.centerContent() // 建议画好后再开启
  // graph.zoomToFit({ maxScale: 1 }) // 建议画好后再开启
}

const graph = ref<Graph>()

onMounted(() => {
  graph.value = initGraph()

  // 加载已保存节点
  const res: Cell[] = []
  cells.forEach(i => {
    if (['edge'].includes(i.shape)) {
      res.push(graph.value?.createEdge(i)!)
    } else {
      res.push(graph.value?.createNode(i)!)
    }
  })
  graph.value.resetCells(res as Cell[])
  // graph.value?.centerContent() // 建议画好后再开启
  // graph.value?.zoomToFit({ maxScale: 1 }) // 建议画好后再开启

  // 继续添加节点
  // addNodes()

  // 绑定事件
  addEvents()
})

function initGraph() {
  const container = document.getElementById('container')!;
  const graph = new Graph({
    container,
    autoResize: true, // 自动变化画布大小
   	// 是否显示网格
    grid: {
      size: 5,
      visible: true,
    },
    // 自定义交互限制
    interacting: {
      nodeMovable: true,  // 节点是否可以被移动。
      edgeMovable: true,  // 边是否可以被移动。
      edgeLabelMovable: true,  // 边的标签是否可以被移动。
      magnetConnectable: true,  // 当在具有 magnet 属性的元素上按下鼠标开始拖动时，是否触发连线交互。
      arrowheadMovable: true,  // 边的起始/终止箭头是否可以被移动。
      vertexMovable: true,  // 边的路径点是否可以被移动。
      vertexAddable: true,  // 是否可以添加边的路径点。
      vertexDeletable: true,  // 边的路径点是否可以被删除。
    },
    // 是否限制节点移动范围
    translating: {
      restrict: true,
    },
    // 定义点击节点链接桩后的连接线
    connecting: {
      allowBlank: true, // 是否允许连接到画布空白位置的点
      // 自定义连接器
      connector: {
        name: 'rounded',
        args: {
          radius: 20,
        },
      },
      // 自定义路由
      router: {
        name: 'orth',
        args: {
          padding: 1,
        },
      },
      // 是否开启连线过程中自动吸附
      snap: {
        radius: 20, // 吸附半径
        anchor: 'center',
      },
      // 自定义新建边样式
      createEdge() {
        return new Shape.Edge({
          markup: [
            {
              tagName: 'path',
              selector: 'fill',
            },
          ],
          attrs: {
            fill: {
              connection: true,
              strokeWidth: 2,
              fill: 'none',
              stroke: {
                type: 'linearGradient',
                stops: [
                  { offset: '0%', color: '#006EFF' },
                  { offset: '100%', color: '#A42FD6' },
                ],
              },
              // 箭头
              targetMarker: {
                name: 'block',
                fill: '#A42FD6',
                offset: 0,
                width: 5,
                height: 10,
              },
            },
          },
        });
      },
      // 在移动边的时候判断连接是否有效
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    // 连接到连接桩时的高亮显示
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF',
          },
        },
      },
    },
  })

  // 挂载插件
  .use(
    new Selection({
      enabled: true,
      multiple: true,
      rubberband: true,
      movable: true,
      showNodeSelectionBox: true,
    }),
  )
  .use(
    new History({
      enabled: true,
    }),
  )
  .use(
    new Snapline({
      enabled: true,
    }),
  )
  .use(
    new Transform({
      resizing: true,
      rotating: true,
    }),
  )

  return graph
}

function addEvents() {
  if (!graph.value) {
    return
  }
  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<HTMLElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  };
  graph.value.on("node:mouseenter", () => {
    const container = document.getElementById("container")!;
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<HTMLElement>;
    showPorts(ports, true);
  });
  graph.value.on("node:mouseleave", () => {
    const container = document.getElementById("container")!;
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<HTMLElement>;
    showPorts(ports, false);
  });

  // 添加连接线时附带辅助工具
  graph.value.on("edge:mouseenter", ({ cell }) => {
    cell.addTools("vertices", "onhover");
  });
  graph.value.on("edge:mouseleave", ({ cell }) => {
    if (cell.hasTools("onhover")) {
      cell.removeTools();
    }
  });
}

function addNodes() {
  graph.value?.addNodes([
    {
      id: 'foo',
      shape: 'foo',
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      data: {
        title: 'i am foo'
      }
    },
    {
      id: 'bar',
      shape: 'bar',
      width: 100,
      height: 100,
      x: 500,
      y: 500,
      data: {
        title: 'i am bar'
      }
    }
  ])
}


function showJSON() {
  console.log(graph.value?.toJSON())
}

function undo() {
  graph.value?.undo()
}

function zoom() {
  graph.value?.zoomToFit({ maxScale: 1 })
}
</script>

<template>
  <button @click="showJSON">Show JSON</button>
  <button @click="undo">Undo</button>
  <button @click="zoom">Zoom</button>
  <div ref="outer" class="outer">
    <div id="container"></div>
  </div>
</template>

<style lang="less" scoped>
.outer {
  margin: 0 auto;
  width: 95vw;
  height: 95vh;

  #container {
    width: 100%;
    height: 100%;
  }
}
</style>
