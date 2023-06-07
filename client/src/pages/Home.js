import Nav from "../components/Match/Nav"
import React from "react"
import AuthModel from "../components/Match/AuthModel"
import { useCookies } from "react-cookie"

const Home = () => {

    const [showModel, setShowModel] = React.useState(false)
    const [isSignup, setSignup] = React.useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    const handleClick = () => {
        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModel(true)
        setSignup(true)
    }

    return (
        <div className="overlay">
            <Nav minimal={false} authToken={authToken} setShowModel={setShowModel} showModel={showModel} setSignup={setSignup} />
            <div className="home">
                <h1 className="primary-title" >Squaddle</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? "Signout" : "Create Account"}
                </button>

                {showModel && (
                    <AuthModel isSignup={isSignup} setShowModel={setShowModel} />
                )}

            </div>
        </div>
    )
}

export default Home