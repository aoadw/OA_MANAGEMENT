<template>
    <el-page-header title="返回" @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3"> {{ props.content }} </span>
        </template>
    </el-page-header>
</template>

<script setup name='OAHeader'>
import { useRouter } from 'vue-router';



const router = useRouter()

const goBack = () => {
    router.go(-1)
}

const props = defineProps({
    content: ''
})

</script>

<style lang="scss" scoped></style>