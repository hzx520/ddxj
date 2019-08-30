import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import order from '@/pages/order'
import my from '@/pages/my'
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
    {
      path: '/my',
      name: 'my',
      component: my
    },
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
