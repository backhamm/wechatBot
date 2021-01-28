import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'Verification'
    },
    {
      path: '/Verification',
      name: 'Verification',
      component: require('@/components/Verification/Verification').default
    },
    {
      path: '/TipsPage',
      name: 'TipsPage',
      component: require('@/components/TipsPage/TipsPage').default
    },
    {
      path: '/Login',
      name: 'Login',
      component: require('@/components/Login/Login').default
    },
    {
      path: '/Directory',
      name: 'Directory',
      component: require('@/components/Directory/Directory').default
    },
    {
      path: '/ProgressBar',
      name: 'ProgressBar',
      component: require('@/components/ProgressBar/ProgressBar').default
    },
    {
      path: '/SendInfo',
      name: 'SendInfo',
      component: require('@/components/SendInfo/SendInfo').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
