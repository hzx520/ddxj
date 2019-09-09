import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import order from '@/pages/order'
// import order1 from '@/pages/order1'
import my from '@/pages/my'
// import me from '@/pages/me'
import myOrder from '@/pages/myOrder'
import feedback from '@/pages/feedback'
import feedbackDetail from '@/pages/feedbackDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    // {
    //   path: '/order1',
    //   name: 'order1',
    //   component: order1
    // },
    {
      path: '/my',
      name: 'my',
      component: my
    },
    // {
    //   path: '/me',
    //   name: 'me',
    //   component: me
    // },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: myOrder
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: feedback
    },
    {
      path: '/feedbackDetail',
      name: 'feedbackDetail',
      component: feedbackDetail
    }
  ]
})
