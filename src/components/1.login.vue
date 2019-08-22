<template>
  <div class="login">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="100px"
      :rules="rules"
      class="demo-ruleForm"
    >
      <el-form-item label="活动名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
</style>
