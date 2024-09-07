import axios from "axios";
import { useAuthStore } from "@/stores/auth";

class Http {
    constructor() {
        this.instance = axios.create({
            //使用环境变量，根据不同环境适应不同的url
            baseURL: import.meta.env.VITE_BASE_URL,
            timeout: 6000,  //超时时间，单位毫秒
        });
        //获取登录后的JWT
        this.instance.interceptors.request.use((config) => {
            const useStore = useAuthStore()
            const token = useStore.token
            if (token) {
                config.headers.Authorization = "JWT " + token
            }
            return config
        })

    }
    post(path, data) {
        // await：网络请求发送出去后，线程会挂起这个等待
        // 等网络数据到达后，线程又会回到当前位置开始往后执行
        // 如果在某个函数中使用了await，那么这个函数就必须要定义成async
        // axios底层也是用的Promise对象，在响应的状态码不是200时，就会调用reject
        // 调用reject的结果是，外层的函数会抛出异常
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.post(path, data)
                // 如果走到下面代码，说明上面await函数没有抛出异常，就肯定说明返回的状态码是200
                resolve(result.data)
            } catch (err) {
                // 走到catch中，就说明状态码肯定不是200
                try {
                    let detail = err.response.data.detail;
                    reject(detail)
                } catch {
                    reject('服务器错误！')
                }

            }
        })
    }
    get(path, params) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.get(path, { params })
                resolve(result.data)

            } catch (err) {
                try {
                    let detail = err.response.data.detail;
                    reject(detail)
                } catch {
                    reject('服务器错误！')
                }

            }
        })
    }
    put(path, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.put(path, data)
                resolve(result.data)

            } catch (err) {
                try {
                    let detail = err.response.data.detail;
                    reject(detail)
                } catch {
                    reject('服务器错误！')
                }

            }
        })
    }
    delete(path) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.instance.delete(path)
                resolve(result)

            } catch (err) {
                try {
                    let detail = err.response.data.detail;
                    reject(detail)
                } catch {
                    reject('服务器错误！')
                }

            }
        })
    }
}

export default new Http()