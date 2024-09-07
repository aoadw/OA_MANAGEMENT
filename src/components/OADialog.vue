<template>
    <el-dialog v-model="dialogVisible" :title="props.title" :width="props.width">
        <slot></slot>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onQuit">退出</el-button>
                <el-button type="primary" @click="onSubmit">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="OADialog">


//自定义model
let dialogVisible = defineModel({ required: true })

//自定义属性
let props = defineProps({
    title: {
        type: String,
        default: ""
    },
    width: {
        type: String,
        default: '500'
    }
})

//自定义事件
let emits = defineEmits(['quit', 'submit'])

let onQuit = () => {
    dialogVisible.value = false
    emits('quit')
}
let onSubmit = () => {
    emits('submit')
}
</script>

<style lang="scss" scoped></style>