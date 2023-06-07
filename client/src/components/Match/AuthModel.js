import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"

const AuthModel = ({ setShowModel, isSignup }) => {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(["user"])

    let navigate = useNavigate()

    console.log(email, password, confirmPassword)

    const handleClick = () => {
        setShowModel(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isSignup && (password !== confirmPassword)) {
                setError("Passwords need to match")
            }
            else {
                console.log("posting", email, password)
                const response = await axios.post(`http://localhost:8000/${isSignup ? 'signup' : 'login'}`, { email, password })


                setCookie('AuthToken', response.data.token)
                setCookie('UserId', response.data.userId)

                const success = response.status === 201

                if (success && isSignup) navigate('/onboarding')
                if (success && !isSignup) navigate('/dashboard')

                window.location.reload()
            }

        } catch (error) {
            if (isSignup) alert("User Already Exists")
            else alert("Wrong Credentials")
            console.log(error)
        }
    }

    return (
        <div className="auth-model">
            <div className="close-icon" onClick={handleClick}>✖</div>
            <h2>{isSignup ? "CREATE ACCOUNT" : "LOG IN"}</h2>
            <p>By clicking this you are agreeing to out terms and conditions</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignup && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit" />
                <p>{error}</p>
            </form>
            <hr />
            <h2>GET THE APP</h2>
        </div>
    )
}

export default AuthModel