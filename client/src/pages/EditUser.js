import { useState } from "react"
import Nav from "../components/Match/Nav"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Select from 'react-select'

const EditUser = () => {

    let navigate = useNavigate()
    const Gotuser = useLocation();
    const user = Gotuser.state.user
    console.log("gotUser", user)

    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const [inputList, setinputList] = useState(user.project);

    const [editUser, seteditUser] = useState({
        user_id: cookies.UserId,
        name: user.name,
        field: user.field,
        skill: user.skill,
        work: user.work,
        url: user.url,
        phone_number: user.number,
        matches: user.matches,
        university: user.university,
        githublink: user.githublink,
        linkedinlink: user.linkedinlink,
        YOE: user.YOE,
        bio: user.bio,
    })

    const options = [
        { label: 'Html', value: 'Html' },
        { label: 'CSS', value: 'CSS' },
        { label: 'React', value: 'React' },
        { label: 'Node', value: 'Node' },
        { label: 'MongoDB', value: 'MongoDB' },
        { label: 'Express', value: 'Express' }
    ]


    const handleChange = (e) => {
        console.log("e", e)
        const value = e.target.value
        const name = e.target.name

        seteditUser((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleChange2 = val => {

        seteditUser((prevState) => ({ ...prevState, skill: val }))
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
        console.log("Edited", editUser)
        console.log(inputList)
        try {
            const response = await axios.put("http://localhost:8000/edituser", {
                editUser,
                inputList
            })
            const success = response.status === 200

            if (success) navigate("/dashboard")
        } catch (err) {
            console.log(err)
        }
    }

    const handleExit = (e) => {
        e.preventDefault()
        navigate("/dashboard")
    }
    console.log("input", inputList)

    return (
        <>
            <Nav minimal={true} setShowModel={() => { }} showModel={false} />

            <div className="editUser">
                <h2>Edit Profile</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            required={true}
                            value={editUser.name}
                            onChange={handleChange}
                        />


                        <label>Field</label>
                        <div className="multiple-input-container">
                            <input
                                id="frontend-identity"
                                type="radio"
                                name="field"
                                value="frontend"
                                onChange={handleChange}
                                checked={editUser.field === "frontend"}
                            />
                            <label htmlFor="frontend-identity">FrontEnd</label>
                            <input
                                id="backend-identity"
                                type="radio"
                                name="field"
                                value="backend"
                                onChange={handleChange}
                                checked={editUser.field === "backend"}
                            />
                            <label htmlFor="backend-identity">BackEnd</label>
                            <input
                                id="fullstack-identity"
                                type="radio"
                                name="field"
                                value="fullstack"
                                onChange={handleChange}
                                checked={editUser.field === "fullstack"}
                            />
                            <label htmlFor="fullstack-identity">FullStack</label>
                        </div>

                        <div className="skill">Skill</div>

                        <div className="multi">

                            <Select
                                isMulti
                                name="colors"
                                options={options}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleChange2}
                            />
                        </div>

                        <label htmlFor="work">Work / Profession</label>
                        <input
                            id="work"
                            type="text"
                            name="work"
                            placeholder="Enter Profession"
                            required={true}
                            value={editUser.work}
                            onChange={handleChange}
                        />
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            id="phone_number"
                            type="text"
                            name="phone_number"
                            placeholder="Enter Phone Number"
                            required={true}
                            value={editUser.phone_number}
                            onChange={handleChange}
                        />
                    </section>
                    <section>
                        <label htmlFor="about">Profile Photo</label>
                        <input
                            id="url"
                            type="url"
                            name="url"
                            required={true}
                            value={editUser.url}
                            onChange={handleChange}
                        />
                        <div className="photo-container">
                            {editUser.url && <img src={editUser.url} alt="pic preview" />}
                        </div>
                    </section>
                    <section>
                        <label htmlFor="university">University</label>
                        <input
                            id="university"
                            type="text"
                            name="university"
                            placeholder="Enter University"
                            required={true}
                            value={editUser.university}
                            onChange={handleChange}
                        />

                        <label htmlFor="githublink">Github </label>
                        <input
                            id="githublink"
                            type="text"
                            name="githublink"
                            placeholder="Enter Github Link"
                            required={true}
                            value={editUser.githublink}
                            onChange={handleChange}
                        />
                        <label htmlFor="linkedinlink">LinkedIn </label>
                        <input
                            id="linkedinlink"
                            type="text"
                            name="linkedinlink"
                            placeholder="Enter LinkedIn Link"
                            required={true}
                            value={editUser.linkedinlink}
                            onChange={handleChange}
                        />
                        <label htmlFor="YOE">Years of Experience</label>
                        <input
                            id="YOE"
                            type="number"
                            name="YOE"
                            placeholder="Years"
                            required={true}
                            value={editUser.YOE}
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
                            value={editUser.bio}
                            onChange={handleChange}
                        />
                        <div className="project">
                            {
                                inputList.map((x, i) => {
                                    return (
                                        <div>
                                            <div>
                                                <label >Project Title</label>
                                                <input
                                                    type="text"
                                                    name="protitle"
                                                    value={inputList[i].protitle}
                                                    placeholder="Enter Project Name"
                                                    onChange={e => handleinputchange(e, i)} />
                                            </div>
                                            <div>
                                                <label >Project Description</label>
                                                <input
                                                    type="text"
                                                    name="prodes"
                                                    value={inputList[i].prodes}
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
                <button className="back-button" onClick={handleExit}>Go Back!</button>
            </div >

        </>
    )
}

export default EditUser