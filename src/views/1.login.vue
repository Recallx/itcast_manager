<template>
  <div class="login">
    <div class="container">
      <img src="../assets/snipaste_20190822_165759.png" alt class="avatar" />
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="myicon-user"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type='password' v-model="loginForm.password" placeholder="请输入密码" prefix-icon="myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login } from '../api/login-index'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 添加表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  // 点击事件
  methods: {
    login () {
      this.$refs.loginForm.validate((valid) => {
        // console.log(valid)
        if (valid) {
          // 就是有数据，可以发送请求
          // 引入的login发送请求
          login(this.loginForm)
            .then((res) => {
              if (res.data.meta.status === 200) {
                // vue中是用token来获取状态保持的，将token存储到本地存在中(文件名，数据)
                localStorage.setItem('itcast_managet', res.data.data.token)
                // 实现页面跳转
                // 记住页面跳转router.push
                this.$router.push({ name: 'index' })
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'warning'
                })
              }
            })
            .catch(() => {
              // 提示用户错误
              this.$message({
                message: '服务器异常，请稍后再试！',
                type: 'warning'
              })
            })
        } else {
          console.log(this)
          // valid = false
          // 提示用户输入数据
          this.$message({
            message: '请输入用户名或密码',
            // 提示类型：success,info,error,warning
            type: 'warning'
          })
        }
        return false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
