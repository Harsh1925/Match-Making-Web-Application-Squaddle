import { useState } from "react"
import Nav from "../components/Match/Nav"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import 'react-multiple-select-dropdown-lite/dist/index.css'

const UserData = () => {

    let navigate = useNavigate()

    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const [inputList, setinputList] = useState([{ protitle: '', prodes: '' }]);
    const [userData, setUserData] = useState({
        user_id: cookies.UserId,
        university: "",
        githublink: "",
        linkedinlink: [],
        YOE: "",
        bio: "",
    })


    const handleChange = (e) => {
        console.log("e", e)
        const value = e.target.value
        const name = e.target.name

        setUserData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleinputchange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setinputList(list);

    }

    const handleremove = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setinputList(list);
    }

    const handleaddclick = () => {
        setinputList([...inputList, { protitle: '', prodes: '' }]);
    }

    const handleSubmit = async (e) => {
        console.log("clicked here")
        e.preventDefault()
        console.log(userData)
        console.log(inputList)
        try {
            const response = await axios.put("http://localhost:8000/userdata", {
                userData,
                inputList
            })
            const success = response.status === 200

            if (success) navigate("/dashboard")
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <>
            <Nav minimal={true} setShowModel={() => { }} showModel={false} />

            <div className="userdata">
                <h2>User Details</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="university">University</label>
                        <input
                            id="university"
                            type="text"
                            name="university"
                            placeholder="Enter University"
                            required={true}
                            value={userData.university}
                            onChange={handleChange}
                        />

                        <label htmlFor="githublink">Github </label>
                        <input
                            id="githublink"
                            type="text"
                            name="githublink"
                            placeholder="Enter Github Link"
                            required={true}
                            value={userData.githublink}
                            onChange={handleChange}
                        />
                        <label htmlFor="linkedinlink">LinkedIn </label>
                        <input
                            id="linkedinlink"
                            type="text"
                            name="linkedinlink"
                            placeholder="Enter LinkedIn Link"
                            required={true}
                            value={userData.linkedinlink}
                            onChange={handleChange}
                        />
                        <label htmlFor="YOE">Years of Experience</label>
                        <input
                            id="YOE"
                            type="number"
                            name="YOE"
                            placeholder="Years"
                            required={true}
                            value={userData.YOE}
                            onChange={handleChange}
                        />
                        <input className="submit-button" type="submit" />
                    </section>
                    <section>
                        <label htmlFor="bio">Short Bio</label>
                        <input
                            id="bio"
                            type="text"
                            name="bio"
                            required={true}
                            placeholder="Enter Bio"
                            value={userData.bio}
                            onChange={handleChange}
                        />
                        <div className="project">
                            {
                                inputList.map((x, i) => {
                                    return (
                                        <div className="pro-button">
                                            <div><div>
                                                <label >Project Title:         </label>
                                            </div>
                                                <input
                                                    type="text"
                                                    name="protitle"
                                                    placeholder="Enter Project Name"
                                                    onChange={e => handleinputchange(e, i)} />
                                            </div>
                                            <div className="project-dess"><div>
                                                <label >Project Description:       </label>
                                            </div>
                                                <input
                                                    type="text"
                                                    name="prodes"
                                                    placeholder="Enter Project Details"
                                                    onChange={e => handleinputchange(e, i)} />
                                            </div>

                                            {
                                                inputList.length !== 1 &&
                                                <button onClick={() => handleremove(i)}>Remove</button>
                                            }
                                            {inputList.length - 1 === i &&
                                                <button onClick={handleaddclick}>Add More</button>
                                            }
                                        </div>
                                    );
                                })}
                        </div>
                    </section>
                </form>
            </div >

        </>
    )
}

export default UserData