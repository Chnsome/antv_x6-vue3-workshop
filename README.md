[toc]

## 前言

### 2.x 与 1.x 的不同

1、@2.x 将 @1.x 中画布的每个格外的功能独立成了单独的包，比如框选功能、快捷键功能等

2、@2.x 的 API 文档、代码演示更清晰易懂（不再需要去 sandbox 找代码），代码风格向 tsx、vue-composition-api 看齐，对于 react、vue3 项目更友好



## 搭建开发框架

### 一、安装

```shell
npm i @antv/x6 @antv/x6-plugin-history @antv/x6-plugin-selection @antv/x6-plugin-snapline @antv/x6-plugin-transform @antv/x6-vue-shape -D
```

```json
// package.json
{
  "@antv/x6": "^2.0.0",
  "@antv/x6-plugin-clipboard": "^2.0.0", // 如果使用剪切板功能，需要安装此包
  "@antv/x6-plugin-history": "^2.0.0", // 如果使用撤销重做功能，需要安装此包
  "@antv/x6-plugin-keyboard": "^2.0.0", // 如果使用快捷键功能，需要安装此包
  "@antv/x6-plugin-minimap": "^2.0.0", // 如果使用小地图功能，需要安装此包
  "@antv/x6-plugin-scroller": "^2.0.0", // 如果使用滚动画布功能，需要安装此包
  "@antv/x6-plugin-selection": "^2.0.0", // 如果使用框选功能，需要安装此包
  "@antv/x6-plugin-snapline": "^2.0.0", // 如果使用对齐线功能，需要安装此包
  "@antv/x6-plugin-dnd": "^2.0.0", // 如果使用 dnd 功能，需要安装此包
  "@antv/x6-plugin-stencil": "^2.0.0", // 如果使用 stencil 功能，需要安装此包
  "@antv/x6-plugin-transform": "^2.0.0", // 如果使用图形变换功能，需要安装此包
  "@antv/x6-plugin-export": "^2.0.0", // 如果使用图片导出功能，需要安装此包
  "@antv/x6-react-components": "^2.0.0", // 如果使用配套 UI 组件，需要安装此包
  "@antv/x6-react-shape": "^2.0.0", // 如果使用 react 渲染功能，需要安装此包
  "@antv/x6-vue-shape": "^2.0.0" // 如果使用 vue 渲染功能，需要安装此包
}
```



### 二、初始化画布 + 使用插件

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Graph, Shape } from "@antv/x6";

// 引入插件
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { History } from '@antv/x6-plugin-history'
import { Transform } from '@antv/x6-plugin-transform'
    
const graph = ref<Graph>()

onMounted(() => {
  setTimeout(() => {
    graph.value = initGraph()
  })
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
</script>

<template>
    <div class="outer">
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
```



### 三、注册自定义节点

> **官网中的提示是：**
>
> 在选择渲染方式时我们推荐：
>
> - 如果节点内容比较简单，而且需求比较固定，使用 `SVG` 节点
> - 其他场景，都推荐使用当前项目所使用的框架来渲染节点

```typescript
// registerCells.ts
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
```



### 四、绑定事件

```typescript
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
```



### 五、添加工具按钮

```vue
<script setup lang="ts">
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
    <div class="outer">
        <div id="container"></div>
    </div>
</template>
```



## 开发

### 一、添加节点

```typescript
function addNodes() {
  graph.value?.addNodes([
    {
      id: 'foo',
      shape: 'rect',
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      attrs: {
        body: {
          fill: "#191919",
        }
      }
    },
    {
      id: 'bar',
      shape: 'rect',
      width: 100,
      height: 100,
      x: 500,
      y: 500,
      attrs: {
        body: {
          fill: "#000",
        }
      }
    }
  ])
}
```



### 二、通过连接桩进行连线

### 三、保存节点

点击【节点转JSON（保存）】按钮，查看控制台的打印信息，并且保存在 json 文件中

### 四、展示已保存的节点

这样就可以实时保存自己画的图了

```typescript
import { onMounted, ref } from "vue";
import { Graph, type Cell } from "@antv/x6";
import cells from './cells.json'

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
  // graph.value?.zoomToFit({ padding: 10, maxScale: 16 }) // 建议画好后再开启

  // 继续添加节点
  addNodes()
    
  // 绑定事件
  addEvents()
})
```



### 五、将画布居中对齐、等比缩放

```typescript
graph.value?.centerContent()
graph.value?.zoomToFit({ padding: 10, maxScale: 16 })
```



### 六、响应式方案

```shell
npm i @vueuse/core -D
```

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useResizeObserver } from '@vueuse/core'
import { Graph } from "@antv/x6";

const graph = ref<Graph>()

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
  graph.centerContent()
  graph.zoomToFit({ maxScale: 10 })
}
</script>

<template>
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
```



## 附录

### 自定义 VUE 节点模板

```vue
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Node } from '@antv/x6'

const getNode = inject('getNode', Function, true)

const dataSource = ref({
  title: '',
})

onMounted(() => {
  const node = getNode() as Node
  const nodeData = node.getData()
  Object.entries(nodeData).forEach(([key, value]) => {
    dataSource.value[key as keyof typeof dataSource.value] = value as string
  })
})

</script>

<template>
  <div class="template-class">
    {{ dataSource.title }}
  </div>
</template>

<style lang="less" scoped>
.template-class {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
}
</style>
```



### 完整模板

```vue
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
```

