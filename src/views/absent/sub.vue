<template>
    <OAMain title="下属考勤">
        <el-card>
            <el-table :data="absents" style="width: 100%">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="absent_type.name" label="类型" />
                <el-table-column label="申请人">
                    <template #default="scope">
                        {{ '[' + scope.row.requester.department.name + ']' + scope.row.requester.realname }}
                    </template>
                </el-table-column>
                <el-table-column prop="reason_text" label="原因" />
                <!-- <el-table-column label="创建时间">
                    <template #default="scope">
                        {{ timeFomatter.stringFromDateTime(scope.row.created_time) }}
                    </template>
</el-table-column> -->
                <el-table-column label="开始时间">
                    <template #default="scope">
                        {{ timeFomatter.stringFromDate(scope.row.start_date) }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间">
                    <template #default="scope">
                        {{ timeFomatter.stringFromDate(scope.row.end_date) }}
                    </template>
                </el-table-column>
                <el-table-column prop="response_context" label="反馈意见" />
                <el-table-column prop="responser.realname" label="审批人" />
                <el-table-column label="审批状态">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status == 1" type="primary">审核中</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="success">已批准</el-tag>
                        <el-tag v-else type="danger">已拒绝</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="处理">
                    <template #default="scope">
                        <el-button v-if="scope.row.status == 1" type="primary" :icon="EditPen"
                            @click="onShowDialog(scope.$index)" />
                        <el-button v-else disabeled type="default">已处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <template #footer>
                <OAPaginaton v-model="pagination.page" :total="pagination.total" :pagesize="1"></OAPaginaton>
            </template>
        </el-card>
    </OAMain>
    <OADialog v-model="dialogVisible" title="处理考勤" @submit="onSubmitAbsent">
        <el-form :model="absentForm" :rules="rules" ref="absentFormRef">
            <el-form-item label="审核操作" :label-width="formLabelWidth" prop="status">
                <el-radio-group v-model="absentForm.status">
                    <el-radio :value="2">同意</el-radio>
                    <el-radio :value="3">拒绝</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈意见" :label-width="formLabelWidth" prop="response_context">
                <el-input v-model="absentForm.response_context" autocomplete="off" type="textarea" />
            </el-form-item>
        </el-form>
    </OADialog>
</template>

<script setup name='subabsent'>
import OAMain from "@/components/OAMain.vue";
import OAPaginaton from "@/components/OAPaginaton.vue";
import OADialog from "@/components/OADialog.vue";
import { ref, reactive, onMounted } from "vue"
import absentHttp from '@/api/absentHttp';
import { ElMessage } from 'element-plus';
import timeFomatter from '@/utils/timeFomatter';
import { EditPen } from '@element-plus/icons-vue'

let pagination = reactive({
    total: 0,
    page: 1

})
let handleindex = null
let absentFormRef = ref()
let dialogVisible = ref(false)
let formLabelWidth = '100px'
let absentForm = reactive({
    status: 2,
    response_context: ''
})

let rules = reactive({
    status: [
        { required: true, message: '请选择审核结果！', trigger: 'change' }
    ],
    response_context: [
        { required: true, message: '请输入反馈意见！', trigger: 'blur' }
    ],
})

let absents = ref([])

const requestAbsents = async (page) => {
    try {
        let absent_data = await absentHttp.getSubAbsents(page)
        let total = await absent_data.count
        pagination.total = total
        absents.value = absent_data.results
    } catch (detail) {
        ElMessage.error(detail)
    }
}

const onShowDialog = (index) => {
    absentForm.status = 2
    absentForm.response_context = ''
    dialogVisible.value = true
    handleindex = index
}

const onSubmitAbsent = () => {
    absentFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            try {

                dialogVisible.value = false
                const absent = absents.value[handleindex]
                const data = await absentHttp.handleSubAbsent(absent.id, absentForm.status, absentForm.response_context)
                //使用splice方法实现对数据进行更新，删除序号为handleindex，的1个数据，使用data替换
                absents.value.splice(handleindex, 1, data)
                ElMessage.success('处理成功')
            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
}

onMounted(async () => {
    try {

        requestAbsents(1)
        // console.log(absent_data);

    } catch (detail) {
        ElMessage.error(detail)
    }

})
</script>

<style lang="scss" scoped></style>