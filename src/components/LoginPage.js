import React, {useState} from 'react';
import { Link } from 'react-router-dom';


/*
 * TODO: Make the login page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */
function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError]= useState("")


    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                alert(username +" " + password)
                }}>
                <label>Username: 
                    <input type="text" value ={username} onChange = {(e) => setUsername(e.target.value)}></input>
                </label>
                <label>Password: 
                    <input type="text" value = {password} onChange = {(e) => setPassword(e.target.value)}></input>
                </label>
                <label></label>
                <input type="submit" value="Login"></input>
            </form>
        </div>
    );
}

export default LoginPage; 