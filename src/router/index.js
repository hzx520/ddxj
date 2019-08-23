import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home'
import Order from '@/pages/order'
import My from '@/pages/my'
import MyOrder from '@/pages/myOrder'
import Feedback from '@/pages/feedback'
import FeedbackDetail from '@/pages/feedbackDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/my',
      name: 'my',
      component: My
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: MyOrder
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback
    },
    {
      path: '/feedbackDetail',
      name: 'feedbackDetail',
      component: FeedbackDetail
    }
  ]
})
