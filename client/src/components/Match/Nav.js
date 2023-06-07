import logo from "../../images/logo.jpg"

const Nav = ({ minimal, authToken, setShowModel, showModel, setSignup }) => {

    const handleClick = () => {
        setShowModel(true)
        setSignup(false)
    }

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={logo} alt="default"></img>
            </div>

            {!authToken && !minimal && (
                <button
                    className="nav-button"
                    onClick={handleClick}
                    disabled={showModel}
                >
                    Log in
                </button>
            )}

        </nav>
    )
}

export default Nav