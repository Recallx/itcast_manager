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
      <el-tabs v-model="activeName" tabPosition="left">
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
            <!-- 按钮 -->
            <el-button type="primary" round style="float:right; margin:80px 30px">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数"></el-tab-pane>
        <el-tab-pane label="商品属性"></el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { getAllCate } from '../../api/goods-index.js'
export default {
  data () {
    return {
      // 验证图片
      cateGires: [],
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
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
