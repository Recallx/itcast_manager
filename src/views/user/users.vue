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
      <el-button
        type="success"
        plain
        style="margin-left:15px"
        @click="addDialogFormVisible = true"
      >添加用户</el-button>
    </div>
    <!-- 表格展示区域 -->
    <el-table border :data="userList" style="width: 100%; margin-top:20px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="UpdateUser(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 拿到当前行的数据 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditdialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showGantdialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="deleteUsers(scope.row.id)"></el-button>
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
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" ref="addform" :label-width="'80px'" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addfroms">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editform" ref="editform" :label-width="'80px'" :rules="rules">
        <el-form-item label="用户名:">
          <el-input v-model="editform.username" auto-complete="off" style="width: 80px" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantform" :label-width="'80px'">
        <el-form-item label="用户名:">
          <el-input v-model="grantform.username" auto-complete="off" style="width: 80px" disabled></el-input>
        </el-form-item>
        <el-select v-model="grantform.rid" clearable placeholder="请选择">
          <el-option
            v-for="item in grantRole"
            :key="item.value"
            :label="item.roleDesc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUsers,
  getAddUser,
  editUser,
  grantUserRole,
  deleteUser,
  updateUserState
} from '../../api/user-index.js'
import { getAllUserss } from '../../api/role-index.js'
export default {
  data () {
    return {
      // 分配角色定义
      grantDialogFormVisible: false,
      grantRole: [],
      grantform: {
        username: '',
        // 用户id
        id: '',
        // 我们要操作的id
        rid: ''
      },
      // 编辑用户定义
      editDialogFormVisible: false,
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 用户添加定义
      addDialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    // 用户登录状态
    UpdateUser (id, state) {
      // console.log(id, state)
      updateUserState(id, state)
        .then(res => {
          // console.log(res)
          // 如果成功就修改
          if (res.data.meta.status === 200) {
            // 提示用户
            this.$message({
              type: 'success',
              message: '修改状态成功！'
            })
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(() => {
          this.$message.error('修改状态失败！')
        })
    },
    // 删除用户数据
    deleteUsers (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                //  这里不能直接刷新，
                // 需求：如果当前页经过这一次删除，没有任何数据了，那么应该自动的跳转到上一页
                // 所谓上一页，就是将userObj.pagenum--
                // 那么问题的关键就是我们到底什么时候需要将pageNum --
                // 公式用total总数组/pagesize
                this.userobj.pagenum = Math.ceil((this.total - 1) / this.userobj.pagesize) < this.userobj.pagenum ? --this.userobj.pagenum : this.userobj.pagenum
                this.init()
              } else {
                this.$message.error('删除数据失败！')
              }
            })
            .catch(() => {
              this.$message.error('删除数据失败！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打开分配角色
    showGantdialog (row) {
      this.grantDialogFormVisible = true
      console.log(row)
      // 将数据赋值给定义好的变量
      this.grantform.username = row.username
      this.grantform.id = row.id
      this.grantform.rid = row.rid
    },
    // 分配角色确定
    addUser () {
      // 判断有没有rid
      if (this.grantform.rid) {
        grantUserRole(this.grantform)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              // 提示用户
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
            }
            // 刷新数据
            this.init()
            // 表单隐藏
            this.grantDialogFormVisible = false
          })
          .catch(() => {
            this.$message.error('设置角色失败')
          })
      } else {
        this.$message.error('请选择正确的角色')
      }
    },
    // 编辑用户确定
    editUser () {
      // 二次验证有没有数据
      this.$refs.editform.validate(vaild => {
        if (vaild) {
          // 将数据传上去
          editUser(this.editform)
            // 成功就提示用户编辑成功，刷新数据，隐藏表单让form清空
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                // 提示用户
                this.$message({
                  type: 'success',
                  message: '编辑数据成功'
                })
                // 刷新数据，隐藏表单让form清空
                this.init()
                this.editDialogFormVisible = false
              }
            })
            .catch(() => {
              this.$message.error('编辑数据失败')
            })
        } else {
          // 如果没有数据，提示用户
          this.$message.error('请输入正确的数据')
        }
      })
    },
    // 编辑用户
    showEditdialog (row) {
      this.editDialogFormVisible = true
      console.log(row)
      // 要加多一个id上去
      this.editform.id = row.id
      // 将对应的数据默认展示在模板中
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    // 添加用户
    addfroms () {
      // 通过refs的validate判断二次判断有数据才发送请求，如果没有就提示用户输入正确的数据
      this.$refs.addform.validate(vaild => {
        if (vaild) {
          // 用封装好的方法，把数据发送上去
          getAddUser(this.addform)
            .then(res => {
              if (res.data.meta.status === 201) {
                // 提示用户添加成功
                this.$message({
                  type: 'success',
                  message: '新增用户成功'
                })
              }
              this.addDialogFormVisible = false
              // 清空表单内容,通过refs清空
              this.$refs.addform.resetFields()
              // 刷新
              this.init()
            })
            .catch(() => {
              this.$message.success('新增用户失败')
            })
        } else {
          // 提示用户失败
          this.$message.warning('请输入所有必填数据')
        }
      })
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
    // 加载角色数据
    getAllUserss()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          // 将数据添加到数组里面
          this.grantRole = res.data.data
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
