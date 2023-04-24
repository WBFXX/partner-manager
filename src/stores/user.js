import { defineStore } from 'pinia'
import router, {setRoutes} from "@/router";

export const useUserStore = defineStore('manager', {
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
        },
        getMenus(){
            return this.managerInfo.menus || []
        },
        getAuths(){
            return this.managerInfo.auths.length ? this.managerInfo.auths.map(v => v.auth) : []
        }
    },
    actions: {
        setManagerInfo(managerInfo) {
            this.managerInfo = managerInfo

            //设置路由
            setRoutes(managerInfo.menus)//一定要在push之前添加路由，否则就会出现无路由访问

        },
        setUser(user) {
            this.managerInfo.user = JSON.parse(JSON.stringify(user)) //用JSON这个User，跟内存中的user分离，可以避免修改的同步
        },
            logout(){
                localStorage.removeItem('manager')
                router.push('/login')

            }
    },
    // pinia开启数据持久化
    // pinia是缓存到内存里的，没有缓存到浏览器，只有持久化才可以缓存到浏览器里
    persist: true
})
