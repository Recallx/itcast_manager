<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/index/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 进度条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 里面夹一个标签页 -->
    <el-form label-width="80px" style="margin-top:30px">
      <el-tabs
        v-model="activeName"
        tabPosition="left"
        @tab-click="handleClick"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="基本信息" style="margin-left:20px">
          <el-form-item label="商品名称" name="0">
            <el-input v-model="addgoods.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addgoods.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addgoods.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addgoods.goods_number"></el-input>
          </el-form-item>
          <!-- 级联 -->
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateGires"
              change-on-select
              :props="cateGirProps"
              v-model="addgoods.goods_cat"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-checkbox-group
            v-model="item.attr_vals"
            v-for="item in attrValies"
            :key="item.attr_id"
          >
            <el-checkbox :label="submt" v-for="(submt,index) in item.attr_vals" :key="index" border></el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="商品属性"></el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-upload="handleBefore"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor v-model="addgoods.goods_introduce"></quill-editor>
        </el-tab-pane>
        <!-- 按钮 -->
        <el-button type="primary" @click="addGoods" round style="float:right; margin:80px 30px">添加商品</el-button>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { getAllParamsList } from '../../api/params-index.js'
import { getAllCate, addGoods } from '../../api/goods-index.js'
export default {
  data () {
    return {
      // 存数据
      attrValies: [],
      // 验证图片
      cateGires: [],
      fileList: [],
      // 级联选择器
      cateGirProps: {
        // 显示给用户看的内容
        label: 'cat_name',
        // 我们操作的对应的id
        value: 'cat_id',
        // 需要选择下一级的数据源
        children: 'children'
      },
      // 添加商品的表单
      addgoods: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 步骤条的索引
      activeName: '0'
    }
  },
  // 注册富文本框
  components: {
    quillEditor
  },
  methods: {
    // 标签页切换之前的钩子
    beforeLeave (activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)
      // 判断
      if (this.activeName === '1' || this.activeName === '2') {
        // 在判断有没有选择分类
        if (this.addgoods.goods_cat.length !== 3) {
          // 提示用户
          this.$message.error('请选择分类数据！')
          // 让页面保存在1
          this.activeName = '0'
          // 返回false
          return false
        }
      }
    },
    // tab点击
    async handleClick () {
      // 判断用户是否选择了第二和第三
      if (this.activeName === '1') {
        // 就获取动态数据
        let res = await getAllParamsList(this.addgoods.goods_cat[2], 'many')
        console.log(res.data.data)
        this.attrValies = res.data.data
        // 遍历数据，将里面的attr-vals转换为数组
        for (let i = 0; i < this.attrValies.length; i++) {
          // 转换为数组
          this.attrValies[i].attr_vals = this.attrValies[i].attr_vals.split(
            ','
          )
        }
      } else if (this.activeName === '2') {
      }
    },
    // 文件上传前的钩子
    handleBefore (file) {
      // console.log(file)
      // 判断里面type值是什么类型的
      if (file.type.indexOf('image/') !== 0) {
        // 提示用户要选择jpg类型的
        this.$message.error('请选择图片类型！,如jpg,png')
        // 停止操作
        return false
      }
    },
    // 上传图片成功之后钩子函数
    handleSuccess (res, file, fileList) {
      // console.log(res)
      // 将res里面的图片路径存到pics里面,因为是数组
      // 所以要push以键值对的方式存
      this.addgoods.pics.push({ pic: res.data.tmp_path })
    },
    // 拿到token值
    getToken () {
      // 拿到之前存在本地存储的token
      let Token = localStorage.getItem('itcast_managet')
      // console.log(id)
      return { Authorization: Token }
    },
    // 移除图片
    handleRemove (file, fileList) {
      console.log(file)
      // 判断file里面的respons
      if (!file.response) {
        return
      }
      // file里面存着我们移除图片的路径
      // 这里做个遍历数组，对比如果有相同就删除数组里面同路径的。
      // 拿到移除的路径
      let temp = file.response.data.tmp_path
      // 遍历
      for (let i = 0; i < this.addgoods.pics.length; i++) {
        // 如果有相同就移除
        if (this.addgoods.pics[i].pic === temp) {
          this.addgoods.pics.splice(i, 1)
        }
      }
    },
    // 图片预览
    handlePreview (file) {
      console.log(file)
    },
    // 添加商品按钮
    async addGoods () {
      // 点击确定的时候，将数据存到attr里面
      for (let i = 0; i < this.attrValies.length; i++) {
        let id = this.attrValies[i].attr_id
        for (let j = 0; j < this.attrValies[i].attr_vals.length; j++) {
          this.addgoods.attrs.push({
            attr_id: id,
            attr_value: this.attrValies[i].attr_vals[j]
          })
        }
      }
      // 调用方法添加商品
      this.addgoods.goods_cat = this.addgoods.goods_cat.join(',')
      // console.log(this.addgoods)
      let res = await addGoods(this.addgoods)
      if (res.data.meta.status === 201) {
        this.$message.success('添加商品成功！')
        // 跳转页面
        this.$router.push({ name: 'list' })
      }
    }
  },
  mounted () {
    getAllCate().then(res => {
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.cateGires = res.data.data
      }
    })
  }
}
</script>
<style lang="less" scoped>
</style>
