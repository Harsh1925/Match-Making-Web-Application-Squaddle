import { useState } from "react"
import Nav from "../components/Match/Nav"
import { useCookies } from "react-cookie"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import 'react-multiple-select-dropdown-lite/dist/index.css'
import Select from 'react-select'

const OnBoarding = () => {

    let navigate = useNavigate()

    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        name: "",
        field: "",
        skill: [],
        work: "",
        url: "",
        phone_number: "",
        matches: []
    })

    const handleSubmit = async (e) => {
        console.log("clicked here")
        e.preventDefault()
        console.log(formData)
        try {
            const response = await axios.put("http://localhost:8000/user", { formData })
            const success = response.status === 200

            if (success) navigate("/userdata")
        } catch (err) {
            console.log(err)
        }
    }


    const handleChange = (e) => {
        console.log("e", e)
        const value = e.target.value
        const name = e.target.name

        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleChange2 = val => {

        setFormData((prevState) => ({ ...prevState, skill: val }))
    }

    const options = [
        { label: 'Html', value: 'Html' },
        { label: 'CSS', value: 'CSS' },
        { label: 'React', value: 'React' },
        { label: 'Node', value: 'Node' },
        { label: 'MongoDB', value: 'MongoDB' },
        { label: 'Express', value: 'Express' }
    ]


    return (
        <>
            <Nav minimal={true} setShowModel={() => { }} showModel={false} />

            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            required={true}
                            value={formData.name}
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
                                checked={formData.field === "frontend"}
                            />
                            <label htmlFor="frontend-identity">FrontEnd</label>
                            <input
                                id="backend-identity"
                                type="radio"
                                name="field"
                                value="backend"
                                onChange={handleChange}
                                checked={formData.field === "backend"}
                            />
                            <label htmlFor="backend-identity">BackEnd</label>
                            <input
                                id="fullstack-identity"
                                type="radio"
                                name="field"
                                value="fullstack"
                                onChange={handleChange}
                                checked={formData.field === "fullstack"}
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
                            value={formData.work}
                            onChange={handleChange}
                        />
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            id="phone_number"
                            type="text"
                            name="phone_number"
                            placeholder="Enter Phone Number"
                            required={true}
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                        <input className="submit-button" type="submit" />
                    </section>
                    <section>
                        <label htmlFor="about">Profile Photo</label>
                        <input
                            id="url"
                            type="url"
                            name="url"
                            required={true}
                            value={formData.url}
                            onChange={handleChange}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="pic preview" />}
                        </div>
                    </section>
                </form>
            </div >

        </>
    )
}

export default OnBoarding