import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        managerInfo: {}   // {  user: {}, token: '' }
    })  ,
    getters: {
        getUserId() {
            return this.managerInfo.user ? this.managerInfo.user.id : 0
        },
        getUser() {
            return this.managerInfo.user || {}
        },
        getBearerToken() {
            return this.managerInfo.token ? 'Bearer ' + this.managerInfo.token : ''
        },
        getToken() {
            return this.managerInfo.token || ""
        }
    },
    actions: {
        setManagerInfo(managerInfo) {
            this.managerInfo = managerInfo
        },
        setUser(user) {
            this.managerInfo.user = JSON.parse(JSON.stringify(user)) //用JSON这个User，跟内存中的user分离，可以避免修改的同步
        }
    },
    // pinia开启数据持久化
    // pinia是缓存到内存里的，没有缓存到浏览器，只有持久化才可以缓存到浏览器里
    persist: true
})
