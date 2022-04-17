import React, {useState} from 'react';
import { Link } from 'react-router-dom';

/*
 * TODO: Make the SignUp page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */
function SignUpPage() {

    const [newUser, setNewUser] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [sUpError, setSUPError] = useState("")



    return (
        <div>
        <form onSubmit={(e) =>  {
            e.preventDefault()
            if (newPass !== confirmPass) {
                setSUPError("Passwords must match")
                
            } else {
                fetch("/create_account/" + newUser + "/" + newPass)
                    .then(response =>
                        response.json()
                    )
                    .then(data => {
                        setSUPError(data.message)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }}}>
            <label>Username: 
                <input type="text" value = {newUser} onChange ={(e) => setNewUser(e.target.value)}></input>
            </label>
            <label>Password: 
                <input type="text" value = {newPass} onChange = {(e) => setNewPass(e.target.value)}></input>
            </label>
            <label>Confirm Password: 
                <input type="text" value = {confirmPass} onChange ={(e) => setConfirmPass(e.target.value)}></input>
            </label>
            <label></label>
            <input type="submit" value="Create"></input>
        </form>
        <p>{sUpError}</p>
        <p> Already have an account? <Link to='/'>LOGIN</Link></p>
    </div>
    );
}

export default SignUpPage;