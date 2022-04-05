import React from 'react';
import { Link } from 'react-router-dom';

/*
 * TODO: Make the login page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */
function LoginPage() {
    return (
        <div>
            <form>
                <label>Username: 
                    <input type="text"></input>
                </label>
                <label>Password: 
                    <input type="text"></input>
                </label>
                <input type="submit" value="Login"></input>
            </form>
        </div>
    );
}

export default LoginPage; 