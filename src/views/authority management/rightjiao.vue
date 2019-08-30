<template>
  <div class="app">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="primary" round @click="tanchu">添加角色</el-button>
    <!-- 表格 -->
    <el-table border :data="UserList" style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这里面需要自己写 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:10px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4" style="margin-bottom:20px">
              <!-- 在ui模板里找到tag可删除标签 -->
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;delPou(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="spond in first.children" :key="spond.id" style="margin-bottom:20px">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;delPou(scope.row,spond.id)"
                  >{{spond.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'warning'"
                    v-for="sclend in spond.children"
                    :key="sclend.id"
                    style="margin-right:10px"
                    @close="cnt=0;delPou(scope.row,sclend.id)"
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
            <el-button type="primary" icon="el-icon-share" @click="showUserID(scope.row)"></el-button>
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
        :ref="'tree'"
        :data="roleList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="cheAllbox"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="getUserRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisibleL">
      <el-form :model="addUsern" ref="addUsern" :label-width="'80px'" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addUsern.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addUsern.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisibleL = false">取 消</el-button>
        <el-button type="primary" @click="addUserns">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUserRole,
  deleteUserp,
  grantUserRole
} from '@/api/role-index.js'
import { getAllRightList } from '../../api/rigth-index.js'
import { grantUser } from '../../api/role-index'
export default {
  data () {
    return {
      // 添加用户定义
      addUserDialogFormVisibleL: false,
      addUsern: {
        roleName: '',
        roleDesc: ''
      },
      cnt: '0',
      // 拿到用户id
      Ridf: '',
      // props的属性名
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 验证输入框
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 定义分配权限
      grantdialogTableVisible: false,
      roleList: [],
      UserList: [],
      // 当前角色所拥有的权限id
      cheAllbox: []
    }
  },
  //  注册事件
  methods: {
    // 弹出添加角色框
    tanchu () {
      this.addUserDialogFormVisibleL = true
    },
    // 添加角色确定按钮
    addUserns () {
      // 二次验证
      this.$refs.addUsern.validate(valid => {
        if (valid) {
          // console.log(this.addUsern)
          // 发送请求
          grantUser(this.addUsern)
            // 如果成功，提示用户，刷新
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.addUserDialogFormVisibleL = false
                this.$refs.addUsern.resetFields()
                this.init()
              }
            })
            .catch(() => {
              // console.log(err)
              this.$message.error('创建失败')
            })
        } else {
          this.$message.error('请输入正确的内容')
        }
      })
    },
    // 分配权限确定按钮
    async getUserRoles () {
      // 拿到用户选择的
      let arr = this.$refs.tree.getCheckedNodes()
      // console.log(arr)
      // 拼接数组
      let temp = []
      // 循环数组拼接id添加到数组里面
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      // console.log(temp)
      // 里面的id是字符串，要去掉转换为数组
      temp = temp.join(',').split(',')
      // console.log(tempirs)
      // 发现数组里面id重复，去重
      // es6新语法
      // 输出看了是对象，我们不要对象，要转换为数组
      temp = [...new Set(temp)]
      // console.log(temp)

      // 拿到数据之后发送请求，带两个参数
      let res = await grantUserRole(this.Ridf, temp.join(','))
      console.log(res)
      // 如果成功就提示用户
      if (res.data.meta.status === 200) {
        // 提示用户，隐藏弹窗，刷新
        this.$message.success(res.data.meta.msg)
        this.grantdialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 点击分配权限按钮
    async showUserID (row) {
      console.log(row)
      // 点击按钮弹框
      this.grantdialogTableVisible = true
      // 拿到当前行的用户id
      this.Ridf = row.id
      // 发送请求拿到权限数据
      let res = await getAllRightList('tree')
      // 将数据添加到数组里面
      this.roleList = res.data.data
      // 先把数组里面的id清空
      this.cheAllbox.length = 0
      // 判断里面数有没有数据，如果有就循环到第三级，把id存到默认展示的数组里面
      if (row.children && row.children.length > 0) {
        // 大于0就代表有数据,循环
        row.children.forEach(frist => {
          // 判断下一级的有没有数据
          if (frist.children && frist.children.length > 0) {
            // 就是还有数据,继续循环
            frist.children.forEach(scend => {
              // 判断第三级有没有id，如果有就存到默认展示的数组里面
              if (scend.children && scend.children.length > 0) {
                // 添加到数组
                this.cheAllbox.push(scend.id)
              }
            })
          }
        })
      }
    },
    delPou (row, Rid) {
      //   console.log(row, Rid)
      deleteUserp(row.id, Rid)
        .then(res => {
          if (this.cnt === 0) {
            this.$message.success(res.data.meta.msg)
            this.cnt++
          }
          // console.log(res)
          if (res.data.meta.status === 200) {
            //   刷新
            row.children = res.data.data
            // 判断当前权限是否还有下一级权限
            row.children.forEach((v1, in1) => {
              // 判断
              if (v1.children.length === 0) {
                // 如果等于0就是没有二级权限，就调用外面的函数删除，实现递归
                this.delPou(row, v1.id)
              } else {
                // 否者就是还有二级权限，如果还有二级权限就继续遍历
                v1.children.forEach((v2, in2) => {
                  if (v2.children.length === 0) {
                    // 如果等于0就是没有三级权限了，就调用删除的方法
                    this.delPou(row, v2.id)
                  }
                })
              }
            })
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
        console.log(res)
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
