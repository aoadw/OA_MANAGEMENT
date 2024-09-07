<template>
    <el-space direction="vertical" fill style="width: 100%;" :size=20>
        <OAPageHeader :content='props.title'></OAPageHeader>
        <slot></slot>
    </el-space>
</template>

<script setup name="OAMain">
import OAPageHeader from './OAPageHeader.vue';


const props = defineProps({
    title: ''
})
</script>

<style lang="scss" scoped>
.el-space :deep(.el-space__item) {
    width: 100%;
}
</style>