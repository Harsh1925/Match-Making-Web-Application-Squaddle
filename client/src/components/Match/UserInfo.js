import { useEffect, useState } from "react"

const UserInfo = ({ setInfoModel, userData }) => {

    const handleClick = () => {
        setInfoModel(false)
    }


    let data = Array.from(userData.project);

    const list = (project) => {

        return (project.map((project) =>

            <div>
                <h4>Project Title: {project.protitle} </h4>
                <h4>Project Des: {project.prodes}</h4>
            </div>)

        )
    }

    console.log("linkk", userData)

    return (
        <div className="userInfo-model">
            <div className="close-icon" onClick={handleClick}>✖</div>
            <h2><u>User Information</u></h2>
            <div className="userInfo-content">

                <div><h4>University: {userData.university}</h4></div>
                <div><h4>Github Link: <a href={userData.githublink}>Link</a></h4></div>
                <div><h4>LinkedIn Link: <a href={userData.linkedinlink}>Link</a></h4></div>
                <div><h4>Year of Experience: {userData.YOE}</h4></div>
                <div><h4>Bio: {userData.bio}</h4></div>
                <div><h4>{list(data)}</h4></div>
            </div>

        </div>
    )
}

export default UserInfo