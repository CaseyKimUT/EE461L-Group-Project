import React, {useState} from 'react';
import { Link, Navigate } from 'react-router-dom';

export let account_info = {
    "username": "",
    "projects": []
}

/*
 * TODO: Make the login page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */


function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage]= useState("")
    const [loggedIn, setLoggedIn] = useState(false)

    if (loggedIn) {
        return <Navigate to='/hwset' />
    }

    async function submitHandler(e) {
        e.preventDefault()

        try {
            const response = await fetch("/check_correct/" + username + "/" + password);
            const data = await response.json()
            if (data.message === "Incorrect username or password") {
                setMessage(data.message)
            } else {
                setLoggedIn(username)
                account_info["username"] = username
                account_info["projects"] = data.message
                console.log(account_info)
            }
        }catch(error){
            console.log(error)
        }

    }


    return (
        <div>
            <form onSubmit={(e) => {submitHandler(e)}
                }>
                <label>Username: 
                    <input type="text" value ={username} onChange = {(e) => setUsername(e.target.value)}></input>
                </label>
                <label>Password: 
                    <input type="text" value = {password} onChange = {(e) => setPassword(e.target.value)}></input>
                </label>
                
                <input type="submit" value="Login"></input>
            </form>
            <p>{message}</p>
            <p>Don't have an account? <Link to='/signup'>SIGNUP</Link>
            </p>

        </div>
    );
}

export default LoginPage; 