<template>
  <div class="good">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;"
        @keydown.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        style="margin-left:15px"
        @click="add"
      >添加商品</el-button>
    </div>
    <!-- 表格展示区域 -->
    <el-table border :data="goodsList" style="width: 100%; margin-top:20px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="200"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态" width="200"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="250"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="150"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 拿到当前行的数据 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页数条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllmenus } from '@/api/goods-index.js'
export default {
  data () {
    return {
      // 定义表格
      goodsList: [],
      total: 0,
      // 定义搜索框
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 添加商品跳转
    add () {
      this.$router.push({ name: 'add' })
    },
    // 搜索按钮
    async init () {
      let res = await getAllmenus(this.userobj)
      console.log(res)
      if (res.data.meta.status === 200) {
        //   获取总记录数
        this.total = res.data.data.total
        // 拿到数据设置给对应的地方
        this.goodsList = res.data.data.goods
      } else if (res.data.meta.status === 401) {
        // 提示用户获取数据失败
        this.$message.error(res.data.meta.msg)
        // 不成功就是没有token值，强制跳转回login
        this.$router.push({ name: 'login' })
      }
    },
    handleSizeChange (val) {
      //   console.log(`每页 ${val} 条`)
      // 将当前的页数赋值给定义好的变量，重新刷新
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      //   console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
