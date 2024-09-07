<template>
    <el-pagination :page-size="props.pagesize" layout="prev, pager, next" :total="props.total"
        v-model:current-page="page" />
</template>

<script setup name="OAPagination">


const props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    pagesize: {
        type: Number,
        default: 10
    }
})

const page = defineModel({ required: true })

</script>

<style lang="scss" scoped>
.el-pagination {
    justify-content: center;
}
</style>