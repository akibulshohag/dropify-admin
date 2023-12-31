import AdminLogin from './login/AdminLogin'
import NotFound from './NotFound'
import ForgotPassword from './ForgotPassword'
import FirebaseRegister from './register/FirebaseRegister'

const sessionRoutes = [
    {
        path: '/session/signup',
        component: FirebaseRegister,
    },
    {
        path: '/session/signin',
        component: AdminLogin,
    },
    {
        path: '/session/forgot-password',
        component: ForgotPassword,
    },
    {
        path: '/session/404',
        component: NotFound,
    },
]

export default sessionRoutes
