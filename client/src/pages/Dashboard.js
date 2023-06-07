import TinderCard from 'react-tinder-card'
import React from 'react'
import { useEffect, useState } from 'react'
import ChatContainer from '../components/Match/ChatContainer'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import black from "../images/black_screen.jpg"
import UserInfo from '../components/Match/UserInfo'
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [fieldofUsers, setfieldofUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [value, setValue] = useState("");
    const [value2, setValue2] = useState("");
    const [filteron, setfilteron] = useState(false);
    const [secfilteron, setsecfilteron] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [infoModel, setInfoModel] = React.useState(false)
    let navigate = useNavigate()

    const userId = cookies.UserId

    const handleClick = () => {
        setInfoModel(true)
    }


    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId }
            })
            setUser(response.data)

        } catch (error) {
            console.log(error)
        }
    }
    const getfieldofUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/field-users', {
                params: { field: user?.field }
            })
            setfieldofUsers(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (user) {
            getfieldofUsers()
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()

        } catch (err) {
            console.log(err)
        }
    }

    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const fieldFilter = () => {
        setfilteron(true)
        setsecfilteron(false)
    }

    const skillFilter = () => {
        setfilteron(false)
        setsecfilteron(true)
    }

    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId)

    const filteredUsers = fieldofUsers?.filter(fieldofUser => !matchedUserIds.includes(fieldofUser.user_id))

    const filterByField = fieldofUsers?.filter(gotUser => gotUser.field?.includes(value) && !matchedUserIds?.includes(gotUser.user_id))

    const filterBySkill = fieldofUsers?.filter(gotUser => gotUser.skill.map((value) => (value.value)).includes(value2) && !matchedUserIds.includes(gotUser.user_id))

    const handleChange = (e) => {
        setValue(e.target.value);
        if (e.target.value === "All") {
            setfilteron(false)
            setsecfilteron(false)
        }
    };
    const handleChange2 = (e) => {
        setValue2(e.target.value);
        if (e.target.value === "All") {
            setfilteron(false)
            setsecfilteron(false)
        }
    };

    const handleEditChange = (e) => {
        console.log("clicked here")
        e.preventDefault()
        navigate("/edituser", { state: { user: user } })

    }
    const handlePost = (e) => {
        console.log("clicked here")
        e.preventDefault()
        navigate("/post", { state: { user: user } })

    }


    return (
        <>
            {user &&
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="swipe-container">
                        <div className="card-container">

                            {!filteron && !secfilteron && filteredUsers?.map((fieldofUsers) =>
                                <TinderCard
                                    className="swipe"
                                    key={fieldofUsers.user_id}
                                    preventSwipe={["up", "down"]}
                                    onSwipe={(dir) => swiped(dir, fieldofUsers.user_id)}
                                    onCardLeftScreen={() => outOfFrame(fieldofUsers.name)}>
                                    <div
                                        style={{ backgroundImage: "url(" + black + ")" }}
                                        className="card">

                                        <img className='img-user'
                                            src={fieldofUsers.url}
                                            alt="new"
                                        />
                                        <div><h3 className='info'>Name: {fieldofUsers.name}</h3></div>
                                        <div><h3 className='info'>field of interest: {fieldofUsers.field}</h3></div>
                                        <div><h3 className='info'>Work/Profession: {fieldofUsers.work}</h3></div>
                                        <div><h3 className='info'>Skills: {fieldofUsers.skill.map((value) => (value.value + " "))}</h3></div>
                                        <button className="primary-button" onClick={handleClick}>Show Info</button>

                                    </div>
                                    <div>
                                        {infoModel && (
                                            <UserInfo setInfoModel={setInfoModel} userData={fieldofUsers} />
                                        )}
                                    </div>
                                </TinderCard>
                            )}
                            {filteron && !secfilteron && filterByField?.map((fieldofUsers) =>
                                <TinderCard
                                    className="swipe"
                                    key={fieldofUsers.user_id}
                                    preventSwipe={["up", "down"]}
                                    onSwipe={(dir) => swiped(dir, fieldofUsers.user_id)}
                                    onCardLeftScreen={() => outOfFrame(fieldofUsers.name)}>
                                    <div
                                        style={{ backgroundImage: "url(" + black + ")" }}
                                        className="card">

                                        <img className='img-user'
                                            src={fieldofUsers.url}
                                            alt="new"
                                        />
                                        <div><h3 className='info'>Name: {fieldofUsers.name}</h3></div>
                                        <div><h3 className='info'>field of interest: {fieldofUsers.field}</h3></div>
                                        <div><h3 className='info'>Work/Profession: {fieldofUsers.work}</h3></div>
                                        <div><h3 className='info'>Skills: {fieldofUsers.skill.map((value) => (value.value + " "))}</h3></div>
                                        <button className="primary-button" onClick={handleClick}>Show Info</button>

                                    </div>
                                    <div>
                                        {infoModel && (
                                            <UserInfo setInfoModel={setInfoModel} userData={fieldofUsers} />
                                        )}
                                    </div>
                                </TinderCard>
                            )}
                            {!filteron && secfilteron && filterBySkill?.map((fieldofUsers) =>
                                <TinderCard
                                    className="swipe"
                                    key={fieldofUsers.user_id}
                                    preventSwipe={["up", "down"]}
                                    onSwipe={(dir) => swiped(dir, fieldofUsers.user_id)}
                                    onCardLeftScreen={() => outOfFrame(fieldofUsers.name)}>
                                    <div
                                        style={{ backgroundImage: "url(" + black + ")" }}
                                        className="card">

                                        <img className='img-user'
                                            src={fieldofUsers.url}
                                            alt="new"
                                        />
                                        <div><h3 className='info'>Name: {fieldofUsers.name}</h3></div>
                                        <div><h3 className='info'>field of interest: {fieldofUsers.field}</h3></div>
                                        <div><h3 className='info'>Work/Profession: {fieldofUsers.work}</h3></div>
                                        <div><h3 className='info'>Skills: {fieldofUsers.skill.map((value) => (value.value + " "))}</h3></div>
                                        <button className="primary-button" onClick={handleClick}>Show Info</button>

                                    </div>
                                    <div>
                                        {infoModel && (
                                            <UserInfo setInfoModel={setInfoModel} userData={fieldofUsers} />
                                        )}
                                    </div>
                                </TinderCard>
                            )}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='edituser-header'>
                            <button className="edituser-button" onClick={handleEditChange}><b>Edit Profile</b></button>
                            <button className='post-button' onClick={handlePost}><b>Posts</b></button>
                        </div>

                        <div className="filter" style={{ backgroundColor: "skyblue" }}>
                            <button className='headerbutton'
                                type="button"
                            >
                                Filter Users
                            </button>
                            <div className="user-filter">
                                <h3>Find User by Field of interest</h3>
                                <div>Select Field - <select value={value} onChange={handleChange}>
                                    <option value="All">All</option>
                                    <option value="frontend">frontend</option>
                                    <option value="backend">backend</option>
                                    <option value="fullstack">fullstack</option>
                                </select>
                                </div>
                                <p>{`You selected ${value}`}</p>
                                <button type="button" onClick={fieldFilter}>Confirm</button>
                            </div>
                            <div className="user-filter">
                                <h3>Find User by their Skills</h3>
                                <div>Select Field - <select value={value2} onChange={handleChange2}>
                                    <option defaultValue="">All</option>
                                    <option value="Html">Html</option>
                                    <option value="CSS">CSS</option>
                                    <option value="React">React</option>
                                    <option value="MongoDB">MongoDB</option>
                                    <option value="Express">Express</option>
                                </select>
                                </div>
                                <p>{`You selected ${value2}`}</p>
                                <button type="button" onClick={skillFilter}>Confirm</button>
                            </div>

                        </div>
                    </div>
                </div >}
        </>
    )
}
export default Dashboard