<template>
    <OAMain title="发布通知">
        <el-card style="width: 100%;">
            <el-form :model="informForm" :rules="rules" ref="infomrFormRef">
                <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
                    <el-input v-model="informForm.title" autocomplete="off" />
                </el-form-item>
                <el-form-item label="通知部门" :label-width="formLabelWidth" prop="department_ids">
                    <el-select v-model="informForm.department_ids" placeholder="请选择通知部门" multiple>
                        <el-option :value="0" label="所有部门" />
                        <el-option v-for="department in departments" :label="department.name" :value="department.id"
                            :key="department.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="通知内容" :label-width="formLabelWidth" prop="content">
                    <div class="editor-container">
                        <Toolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig"
                            :mode="mode" />
                        <Editor class="editor-content" v-model="informForm.content" :defaultConfig="editorConfig"
                            :mode="mode" @onCreated="handleCreated" />
                    </div>
                </el-form-item>
            </el-form>
            <div style="text-align: right; flex: 1;">
                <el-button @click="onSubmit" type="primary">提交</el-button>
            </div>
        </el-card>
    </OAMain>
</template>

<script setup name="inform_publish">
import OAMain from '@/components/OAMain.vue';
import { ref, reactive, onBeforeUnmount, shallowRef, onMounted } from "vue"
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import staffHttp from '@/api/staffHttp';
import { ElMessage, } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import informHttp from '@/api/informHttp';


const useStore = useAuthStore()
let formLabelWidth = "100px"
let mode = 'defailt'
let infomrFormRef = ref()
let departments = ref([])
let informForm = reactive({
    title: '',
    content: '',
    department_ids: []
})
let rules = reactive({
    title: [{
        required: true, message: '请输入标题！', trigger: 'blur'
    }],
    content: [{
        required: true, message: '请输入内容！', trigger: 'blur'
    }],
    department_ids: [{
        required: true, message: "请选择！", trigger: 'change'
    }]
})
/////////////////////富文本编辑器wangeditor配置/////////////////////
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            fieldName: 'image',

            server: import.meta.env.VITE_BASE_URL + '/image/upload/',
            //服务端地址
            maxFileSize: 0.5 * 1024 * 1024,
            // 最多可上传几个文件
            maxNumberOfFiles: 10,
            // 超时时间，默认为 10 秒
            timeout: 5 * 1000, // 5 秒
            headers: {
                Authorization: "JWT " + useStore.token
            },
            customInsert(res, insertFn) {
                if (res.errno == 0) {
                    // res 即服务端的返回结果
                    let data = res.data
                    let url = import.meta.env.VITE_BASE_URL + data.url
                    let alt = ""
                    let href = import.meta.env.VITE_BASE_URL + data.href
                    // 从 res 中找到 url alt href ，然后插入图片
                    insertFn(url, alt, href)
                } else {
                    ElMessage.error(res.detail)
                }

            },

            // 单个文件上传成功之后
            // onSuccess(file, res) {
            //     ElMessage.success(`${file.name} 上传成功!`)
            // },

            // 单个文件上传失败
            onFailed(file, res) {
                console.log(`${file.name} 上传失败`, res)
                ElMessage.error(`${file.name} 上传失败!`)
            },

            // 上传错误，或者触发 timeout 超时
            onError(file, err, res) {
                if (file.size > 0.5 * 1024 * 1024) {
                    ElMessage.error("图片大小不能超过0.5MB！")
                } else if (err && err.message) {
                    // 如果有明确的错误消息，显示错误消息
                    ElMessage.error(`上传失败: ${err.message}`)
                } else {
                    // 捕获格式错误或其他上传错误
                    ElMessage.error("图片格式错误或上传失败！")
                }
            },

        }
    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
/////////////////////富文本编辑器wangeditor配置/////////////////////

onMounted(async () => {
    try {
        let department_data = await staffHttp.getDepartments()
        departments.value = department_data.results
    } catch (detail) {
        ElMessage.error(detail)
    }
})

const onSubmit = () => {
    infomrFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            try {
                let data = await informHttp.publishInform(informForm)
                console.log(data);

            } catch (detail) {
                ElMessage.error(detail)
            }
        }
    })
}

</script>

<style lang="scss" scoped>
.editor-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    /* 使用视口高度的50%，使内容高度自适应 */
    height: 50vh;
}

.editor-toolbar {
    border-bottom: 1px solid #ccc;
}

.editor-content {
    flex-grow: 1;
    overflow-y: auto;
    /* 高度自适应 */
    height: 100%;
}
</style>
