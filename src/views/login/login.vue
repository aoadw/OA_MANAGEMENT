<template>
    <div class="dowebok">
        <div class="container-login100">
            <div class="wrap-login100">
                <div class="login100-pic js-tilt" data-tilt>
                    <img :src="login_img" alt="IMG" />
                </div>

                <div class="login100-form validate-form">
                    <span class="login100-form-title"> 员工登陆 </span>

                    <div class="wrap-input100 validate-input">
                        <input class="input100" type="text" name="email" placeholder="邮箱" v-model="form.email" />
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
                            <i class="iconfont icon-fa-envelope" aria-hidden="true"></i>
                        </span>
                    </div>

                    <div class="wrap-input100 validate-input">
                        <input class="input100" type="password" name="password" placeholder="密码"
                            v-model="form.password" />
                        <span class="focus-input100"></span>
                        <span class="symbol-input100">
                            <i class="iconfont icon-fa-lock" aria-hidden="true"></i>
                        </span>
                    </div>

                    <div class="container-login100-form-btn">
                        <button class="login100-form-btn" @click="onSubmit">
                            登陆
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup name='login'>
import login_img from "@/assets/image/login.png"
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import authHttp from '@/api/authHttp'
import { ElMessage } from "element-plus";


const authStore = useAuthStore()
const router = useRouter()

let form = reactive({
    email: '',
    password: ''
})

const onSubmit = async () => {
    let pwdRgx = /^[0-9a-zA-Z_-]{6,20}/
    let emailRgx = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9])+/
    console.log(form.email)
    console.log(form.password)
    if (!emailRgx.test(form.email)) {
        ElMessage('邮箱格式不正确')
        return;
    }
    if (!pwdRgx.test(form.password)) {
        ElMessage('密码格式不正确')
        return;
    }
    //axios 库实现Ajax请求
    //axios post请求格式，url,{数据}
    //方式一
    // axios.post('http://127.0.0.1:8000/auth/login/', {
    //     email: form.email,
    //     password: form.password     //数据和后端一致
    // }).then((res) => {              //如果验证成功，执行then中的代码
    //     let token = res.data.token
    //     let user = res.data.user
    //     authStore.setUserToken(user, token)
    //     router.push({ name: 'frame' })

    // }).catch((err) => {             //如果失败，执行catch中的代码
    //     let detail = err.response.data.detail
    //     alert(detail)
    // })

    //方式二 封装axios
    // authHttp.login(form.email, form.password).then((res) => {              //如果验证成功，执行then中的代码
    //     let token = res.data.token
    //     let user = res.data.user
    //     authStore.setUserToken(user, token)
    //     router.push({ name: 'frame' })

    // }).catch((err) => {             //如果失败，执行catch中的代码
    //     let detail = err.response.data.detail
    //     alert(detail)
    // })

    //方式三 异步调用
    try {
        let data = await authHttp.login(form.email, form.password)
        let token = data.token
        let user = data.user
        authStore.setUserToken(user, token)
        router.push({ name: 'frame' })

    } catch (detail) {
        ElMessage.error(detail)
    }
}
</script>

<style scoped src="@/assets/css/login.css"></style>
<style scoped src="@/assets/iconfont/iconfont.css"></style>