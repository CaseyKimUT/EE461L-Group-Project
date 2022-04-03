import React from 'react';
import { Link } from 'react-router-dom';

/*
 * TODO: Make the SignUp page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */
function SignUpPage() {
    return (
        <div>
        <form>
            <label>Username: 
                <input type="text"></input>
            </label>
            <label>Password: 
                <input type="text"></input>
            </label>
            <label>Confirm Password: 
                <input type="text"></input>
            </label>
            <input type="submit" value="Create"></input>
        </form>
    </div>
    );
}

export default SignUpPage;