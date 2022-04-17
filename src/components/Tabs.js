import React from 'react';
import { Link } from 'react-router-dom';

/*
 * component that has the tabs for the different pages for the website;
 * code largely based off of tutorial video provided in HW5 doc.
 */
function Tabs() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                    <Link to='/'>
                        LOGIN
                    </Link>
                    </li>
                    <li>
                    <Link to='/datasets'>
                        DATASETS
                    </Link>
                    </li>
                    <li>
                    <Link to='/joinProjects'>
                        JOIN EXISTING PROJECTS
                    </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Tabs;
