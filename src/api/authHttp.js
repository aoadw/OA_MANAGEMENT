import http from './http'


const login = (email, password) => {
    const path = 'auth/login/'
    return http.post(path, { email, password })
}
// api中的字段需要与后端中的一致
const updatepwd = (old_password, new_password, acc_password) => {
    const path = 'auth/updatepwd/'
    return http.post(path, { old_password, new_password, acc_password })
}

export default {
    login,
    updatepwd,
}