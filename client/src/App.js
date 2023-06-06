import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/Onboarding'
import UserData from "./pages/UserData"
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import EditUser from './pages/EditUser'
import UserPost from "./pages/UserPost"
import PostDetails from "./components/PostDetails/PostDetails"

const App = () => {
  const [cookies, setCookie] = useCookies(['user'])

  const authToken = cookies.AuthToken

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
        {authToken && <Route path="/userdata" element={<UserData />} />}
        {authToken && <Route path="/edituser" element={<EditUser />} />}
        {authToken && <Route path="/post" element={<UserPost />} />}
        {authToken && <Route path="/post/search" exact element={<UserPost />} />}
        {authToken && <Route path="/post/:id" exact element={<PostDetails />} />}

      </Routes>
    </BrowserRouter>
  )
}

export default App