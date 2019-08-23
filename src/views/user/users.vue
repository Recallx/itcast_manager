<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
      <el-button type="success" plain style="margin-left:15px">添加用户</el-button>
    </div>
    <!-- 表格展示区域 -->
    <el-table border :data="userList" style="width: 100%; margin-top:20px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分享" placement="top">
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
import { getAllUsers } from '../../api/user-index.js'
export default {
  data () {
    return {
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
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
    },
    init () {
      getAllUsers(this.userobj)
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            //   获取总记录数
            this.total = res.data.data.total
            // 拿到数据设置给对应的地方
            this.userList = res.data.data.users
          } else if (res.data.meta.status === 400) {
            // 提示用户获取数据失败
            this.$message.error(res.data.meta.msg)
            // 不成功就是没有token值，强制跳转回login
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
