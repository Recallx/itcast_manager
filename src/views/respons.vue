<template>
  <div class="reports">
    <v-chart :options="data"></v-chart>
  </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import { getlist } from '../api/responts-index.js'
export default {
  data () {
    return {
      data: {}
    }
  },
  components: {
    'v-chart': ECharts
  },
  mounted () {
    getlist(1)
      .then(res => {
        // console.log(res)
        this.data = res.data.data
      })
  }
}
</script>
<style lang="less">
.reports {
  width: 100%;
  height: 100%;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
