<template>
  <div class="app">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="primary" round>添加角色</el-button>
    <!-- 表格 -->
    <el-table border :data="UserList" style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这里面需要自己写 -->
          <el-row v-for="first in scope.row.children" :key="first.id">
            <el-col :span="4">
              <!-- 在ui模板里找到tag可删除标签 -->
              <el-tag
                closable
                :type="'success'"
                @close="delPou(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="spond in first.children" :key="spond.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="delPou(scope.row,spond.id)"
                  >{{spond.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'warning'"
                    v-for="sclend in spond.children"
                    :key="sclend.id"
                    @close="delPou(scope.row,sclend.id)"
                  >{{sclend.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果没有数据了就提示用户 -->
          <el-row>
            <el-col v-if="scope.row.children.length === 0">没有权限了，快点添加！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
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
    <!-- 添加分配角色doi框 -->
    <el-dialog title="分配权限" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="roleList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="cheAllbox"
        :props="defaultProps"
      ></el-tree>
    </el-dialog>
  </div>
</template>
<script>
import { getAllUserRole, deleteUserp } from '@/api/role-index.js'
import { getAllRightList } from '../../api/rigth-index.js'
export default {
  data () {
    return {
      // props的属性名
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 定义分配权限
      grantdialogTableVisible: true,
      roleList: [],
      UserList: [],
      // 当前角色所拥有的权限id
      cheAllbox: []
    }
  },
  //  注册事件
  methods: {
    delPou (row, Rid) {
      //   console.log(row, Rid)
      deleteUserp(row.id, Rid)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.info(res.data.meta.msg)
            //   刷新
            row.children = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllUserRole().then(res => {
        console.log(res)
        // 添加到数组里面
        if (res.data.meta.status === 200) {
          this.UserList = res.data.data
        }
      })
    }
  },
  //   添加钩子函数
  mounted () {
    this.init()
    // 调用方法拿到所有角色权限的数据
    getAllRightList('tree')
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}

</script>
<style lang="less" scoped>
</style>
