import http from "./http";

const getDepartments = () => {
    const path = 'staff/departments/'
    return http.get(path)
}

export default {
    getDepartments,

}