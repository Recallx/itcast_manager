<template>
  <div class="app">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table border :data="userList" style="width: 100%; margin-top:20px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200px"></el-table-column>
      <el-table-column prop="path" label="路径" width="200px"></el-table-column>
        <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
        <!-- 加个span -->
        <span>{{scope.row.level | cengJi}}</span>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRole } from '@/api/role-index'
export default {
  data () {
    return {
      // 表格数据定义
      userList: []
    }
  },
  // 添加过滤器将层级数字转换
  filters: {
    cengJi (row) {
      if (row === '0') {
        return '一级'
      } else if (row === '1') {
        return '二级'
      } else if (row === '2') {
        return '三级'
      }
    }
  },
  // 钩子函数一加载就拿到数据
  mounted () {
    getAllRole('list')
      .then(res => {
        // console.log(res)
        this.userList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
