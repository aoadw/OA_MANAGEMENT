<script setup name="frame">
import { ref, computed, reactive } from 'vue';
import {
    Expand,
    Fold
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import authHttp from '@/api/authHttp';
import { ElMessage } from 'element-plus';
// import { ComponentSize, FormInstance, FormRules } from 'element-plus'

const userStore = useAuthStore()
const router = useRouter()


let isCollapse = ref(false)

let dialogVisible = ref(false)
const formLabelWidth = '100px'
const updatePwdForm = reactive({
    oldpwd: '',
    newpwd: '',
    accpwd: ''
})
let formTag = ref()
let rules = reactive({
    oldpwd: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需在6到20个字符内', trigger: 'blur' },
    ],
    newpwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需在6到20个字符内', trigger: 'blur' },
    ],
    accpwd: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需在6到20个字符内', trigger: 'blur' },
    ],
})

const onSubmit = () => {
    formTag.value.validate(async (valid, fields) => {
        if (valid) {
            try {
                await authHttp.updatepwd(updatePwdForm.oldpwd, updatePwdForm.newpwd, updatePwdForm.accpwd)
                ElMessage.success('修改成功')
                dialogVisible.value = false
            } catch (detail) {
                ElMessage.error(detail)
            }

        } else {
            ElMessage.info('密码格式非法')
        }

    })


}

const onControlResetPwdDialog = () => {
    updatePwdForm.oldpwd = ''
    updatePwdForm.newpwd = ''
    updatePwdForm.accpwd = ''
    dialogVisible.value = true;
}

let asideWidth = computed(() => {
    if (isCollapse.value) {
        return "64px"
    } else {
        return "250px"
    }
})

const onCollapseAside = () => {
    isCollapse.value = !isCollapse.value
}

const onExit = () => {
    userStore.clearUserInfo()
    router.push({ name: 'login' })
}


</script>

<template>
    <el-container class="container">
        <el-aside class="aside" :width="asideWidth">
            <router-link to="/" class="brand">OA<span v-show="!isCollapse">系统</span></router-link>
            <el-menu :router="true" active-text-color="#ffd04b" background-color="#343a40" class="el-menu-vertical-demo"
                default-active="2" text-color="#fff" :collapse="isCollapse" :collapse-transition="false">
                <el-menu-item index="1" :route="{ name: 'frame' }">
                    <el-icon>
                        <HomeFilled />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <Checked />
                        </el-icon>
                        <span>考勤管理</span>
                    </template>
                    <el-menu-item index="2-1" :route="{ name: 'myabsent' }">个人考勤</el-menu-item>
                    <el-menu-item index="2-2" :route="{ name: 'subabsent' }">员工考勤</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon>
                            <BellFilled />
                        </el-icon>
                        <span>通知管理</span>
                    </template>
                    <el-menu-item index="3-1" :route="{ name: 'inform_publish' }">发布通知</el-menu-item>
                    <el-menu-item index="3-2" :route="{ name: 'inform_list' }">通知列表</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>员工管理</span>
                    </template>
                    <el-menu-item index="4-1">item one</el-menu-item>
                    <el-menu-item index="4-2">item two</el-menu-item>
                </el-sub-menu>

            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <div class="left-header">
                    <el-button v-show="isCollapse" :icon="Expand" @click="onCollapseAside" />
                    <el-button v-show="!isCollapse" :icon="Fold" @click="onCollapseAside" />
                </div>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <el-avatar :size="30" icon="UserFilled" />
                        <span style="margin-left: 10px;">[{{ userStore.user.department.name }}]{{
                            userStore.user.realname
                        }}</span>
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item plain @click="onControlResetPwdDialog">修改密码</el-dropdown-item>
                            <el-dropdown-item divided @click="onExit">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>

            <el-main>
                <RouterView></RouterView>
            </el-main>
        </el-container>
    </el-container>
    <el-dialog v-model="dialogVisible" title="修改密码" width="500">
        <el-form :model="updatePwdForm" :rules='rules' ref="formTag">
            <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldpwd" show-password>
                <el-input v-model="updatePwdForm.oldpwd" autocomplete="off" type="password" />
            </el-form-item>
            <el-form-item label="新密码" :label-width="formLabelWidth" prop="newpwd" show-password>
                <el-input v-model="updatePwdForm.newpwd" autocomplete="off" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="accpwd" show-password>
                <el-input v-model="updatePwdForm.accpwd" autocomplete="off" type="password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">退出</el-button>
                <el-button type="primary" @click="onSubmit">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.container {
    height: 100vh;
    background-color: #f4f6f9;
}

.aside {
    background-color: #343a40;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22) !important;
}

.aside .brand {
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid #434a50;
    background-color: #232631;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.header {
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-dropdown-link {
    display: flex;
    align-items: center;
}

.el-menu {
    border-right: none;
}
</style>