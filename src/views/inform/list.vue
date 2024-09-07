<template>
    <OAMain title="通知列表">
        <el-card>
            <el-table :data="informs" style="width: 100%">
                <el-table-column label="标题">
                    <template #default="scope">
                        <RouterLink :to="{ name: 'inform_detail' }"> {{ scope.row.title }}
                        </RouterLink>

                    </template>
                </el-table-column>
                <el-table-column label="发起者">
                    <template #default="scope">
                        {{ '[' + scope.row.author.department.name + ']' + scope.row.author.realname }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template #default="scope">
                        {{ timeFomatter.stringFromDateTime(scope.row.created_time) }}
                    </template>
                </el-table-column>
                <el-table-column label="通知部门">
                    <template #default="scope">
                        <el-tag v-if="scope.row.public" type="success">所有部门</el-tag>
                        <el-tag v-else v-for="department in scope.row.departments" type="primary"
                            :key="department.name">{{ department.name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button v-if="scope.row.author.uid == authStore.user.uid" @click="onShowDialog(scope.$index)"
                            type="danger" icon="Delete" />
                        <el-button v-else disabled type="default">无</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <!-- <el-pagination :page-size="1" :pager-count="11" layout="prev, pager, next" :total="pagination.total"
                    v-model:current-page="pagination.page" /> -->
                <OAPaginaton v-model="pagination.page" :total="pagination.total" :pagesize="10"></OAPaginaton>
            </template>
        </el-card>
    </OAMain>

    <OADialog v-model="dialogVisible" title="提示" @submit="onDeleteInform">
        <span>您确定要执行删除操作吗？</span>
    </OADialog>
</template>

<script setup name="inform_list">
import OAMain from '@/components/OAMain.vue';
import OADialog from '@/components/OADialog.vue';
import OAPaginaton from '@/components/OAPaginaton.vue';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import informHttp from '@/api/informHttp';
import timeFomatter from '@/utils/timeFomatter';
import { useAuthStore } from '@/stores/auth';


const authStore = useAuthStore()
let handleIndex = 0
let dialogVisible = ref(false)
let informs = ref([])
let pagination = reactive({
    total: 0,
    page: 1

})

const onShowDialog = (index) => {
    handleIndex = index
    dialogVisible.value = true

}

const onDeleteInform = async () => {
    try {
        let inform = informs.value[handleIndex]
        await informHttp.deleteInform(inform.id)
        informs.value.splice(handleIndex, 1)
        dialogVisible.value = false;
        ElMessage.success("通知删除成功！")
    } catch (detail) {
        ElMessage.error(detail)
    }
}

onMounted(async () => {
    try {
        let data = await informHttp.getInformList()
        let total = await data.count
        pagination.total = total
        informs.value = data.results

    } catch (detail) {
        ElMessage.error(detail)
    }
})

</script>

<style lang="scss" scoped>
.el-badge {
    margin-right: 4px;
    margin-top: 4px;
}
</style>