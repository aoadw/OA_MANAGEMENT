<template>
    <OAMain title="个人考勤">
        <el-card style="text-align: right ">
            <el-button type="primary" @click="onShowDialog">
                <el-icon>
                    <Plus />
                </el-icon>
                发起考勤
            </el-button>
        </el-card>
        <el-card>
            <el-table :data="absents" style="width: 100%">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="absent_type.name" label="类型" />
                <el-table-column prop="reason_text" label="原因" />
                <el-table-column label="创建时间">
                    <template #default="scope">
                        {{ timeFomatter.stringFromDateTime(scope.row.created_time) }}
                    </template>
                </el-table-column>
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
                <el-table-column prop="responser" label="审批人">
                    {{ responser_str }}
                </el-table-column>
                <el-table-column label="审批状态">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status == 1" type="primary">审核中</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="success">已批准</el-tag>
                        <el-tag v-else type="danger">已拒绝</el-tag>
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
    <OADialog v-model="dialogFormVisible" title="发起请假" @submit="onSubmitAbsent">
        <el-form :model="absentForm" :rules="rules" ref="absentFormRef">
            <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
                <el-input v-model="absentForm.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="请假类型" :label-width="formLabelWidth" prop="absent_types">
                <el-select v-model="absentForm.absent_type_id" placeholder="请选择请假类型">
                    <el-option v-for="types in absent_types" :label="types.name" :value="types.id" :key="types.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="请假时间" :label-width="formLabelWidth" prop="absent_date">
                <el-date-picker v-model="absentForm.absent_date" type="daterange" range-separator="到"
                    start-placeholder="起始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="审批领导" :label-width="formLabelWidth">
                <el-input :value="responser_str" readonly disabled autocomplete="off" />
            </el-form-item>
            <el-form-item label="请假理由" :label-width="formLabelWidth" prop="reason_text">
                <el-input type="textarea" v-model="absentForm.reason_text" autocomplete="off" />
            </el-form-item>
        </el-form>
    </OADialog>

</template>

<script setup name='myabsent'>
import OAMain from "@/components/OAMain.vue";
import OAPaginaton from "@/components/OAPaginaton.vue";
import OADialog from "@/components/OADialog.vue";
import { ref, reactive, computed, onMounted, watch } from "vue"
import absentHttp from '@/api/absentHttp';
import { ElMessage } from 'element-plus';
import timeFomatter from '@/utils/timeFomatter';

let pagination = reactive({
    total: 0,
    page: 1

})
let absents = ref([])
let dialogFormVisible = ref(false)
let formLabelWidth = '100px'
let absentFormRef = ref()
let responser = reactive({
    email: '',
    realname: ''
})
let absent_types = ref([])

const responser_str = computed(() => {
    if (responser.email) {
        return '[' + responser.email + ']' + responser.realname
    } else {
        return "无"
    }
})

// 监听reactive中的一条数据，使用匿名函数
watch(() => pagination.page, (newvalue, oldvalue) => {
    requestAbsents(newvalue)
})

const absentForm = reactive({
    title: '',
    absent_type_id: null,
    absent_date: [],
    reason_text: ''
})
let rules = reactive({
    title: [
        { required: true, message: '请输入标题！', trigger: 'blur' }
    ],
    absent_type_id: [
        { required: true, message: '请选择请假类型！', trigger: 'change' }
    ],
    absent_date: [
        { required: true, message: '请选择请假时间！', trigger: 'blur' }
    ],
    reason_text: [
        { required: true, message: '请输入请假理由！', trigger: 'blur' }
    ]
})


const requestAbsents = async (page) => {
    try {
        let absent_data = await absentHttp.getAbsents(page)
        let total = await absent_data.count
        pagination.total = total
        absents.value = absent_data.results
    } catch (detail) {
        ElMessage.error(detail)
    }
}

const onShowDialog = () => {
    absentForm.title = ""
    absentForm.absent_type_id = null
    absentForm.absent_date = []
    absentForm.reason_text = ""
    dialogFormVisible.value = true;
}

const onSubmitAbsent = () => {
    absentFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            let data = {
                title: absentForm.title,
                absent_type_id: absentForm.absent_type_id,
                start_date: absentForm.absent_date[0],
                end_date: absentForm.absent_date[1],
                reason_text: absentForm.reason_text
            }
            // console.log(data);
            try {
                let absent = await absentHttp.applyAbsents(data)
                dialogFormVisible.value = false;
                // console.log(absent);
                absents.value.unshift(absent) // 实时更新表格
                // 发起考勤成功后，做一个提示
                ElMessage.success('请假发起成功！');
            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
}

onMounted(async () => {
    try {
        // 1. 获取请假类型
        let absent_types_data = await absentHttp.getAbsentTypes()
        absent_types.value = absent_types_data

        // 2. 获取审批者
        let responser_data = await absentHttp.getAbsentResponser()
        Object.assign(responser, responser_data)

        //3. 获取考勤列表
        requestAbsents(1)
        // console.log(absent_data);

    } catch (detail) {
        ElMessage.error(detail)
    }
})
</script>

<style lang="scss" scoped></style>