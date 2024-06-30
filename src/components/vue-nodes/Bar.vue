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
    我是Bar组件：{{ dataSource.title }}
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
  background-color: aqua;
}
</style>
