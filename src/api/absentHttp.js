import http from './http'

const getAbsentTypes = () => {
    const path = 'absent/types/'
    return http.get(path)
}
const getAbsentResponser = () => {
    const path = 'absent/responser/'
    return http.get(path)
}
const getAbsents = (page = 1) => {
    const path = 'absent/absent/?who=my&page=' + page
    return http.get(path)
}
const applyAbsents = (data) => {
    const path = 'absent/absent/'
    return http.post(path, data)
}
const getSubAbsents = (page = 1) => {
    const path = 'absent/absent/?who=sub&page=' + page
    return http.get(path)
}
const handleSubAbsent = (absent_id, status, response_context) => {
    const path = 'absent/absent/' + absent_id + '/';
    return http.put(path, { status, response_context });
}

export default {
    getAbsentResponser,
    getAbsentTypes,
    getAbsents,
    applyAbsents,
    getSubAbsents,
    handleSubAbsent
}