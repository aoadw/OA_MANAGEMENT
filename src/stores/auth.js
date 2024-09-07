import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


const USER_KEY = 'OA_USER_KEY'
const TOKEN_KEY = "OA_TOKEN_KEY"

export const useAuthStore = defineStore('auth', () => {
    let _user = ref({})
    let _token = ref("")
    function setUserToken(user, token) {
        //保存到对象上（内存中）
        _user.value = user
        _token.value = token

        //保存到浏览器localStorge中（硬盘上）
        localStorage.setItem(USER_KEY, JSON.stringify(user))//将对象转化为json格式数据
        localStorage.setItem(TOKEN_KEY, token)
    }
    let user = computed(() => {
        //如果user是一个空对象，则从本地读取
        if (Object.keys(_user.value) == 0) {
            let user_str = localStorage.getItem(USER_KEY)
            if (user_str) {
                _user.value = JSON.parse(user_str)
            }
        }
        return _user.value

    })
    let token = computed(() => {
        if (!_token.value) {
            let token_str = localStorage.getItem(TOKEN_KEY)
            _token.value = token_str
        }
        return _token.value

    })

    let is_login = computed(() => {
        if (Object.keys(user.value).length > 0 && token.value) {
            return true
        }
        return false
    })

    function clearUserInfo() {
        _user.value = {}
        _token.value = ''
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
    }

    return { setUserToken, user, token, is_login, clearUserInfo }
})
