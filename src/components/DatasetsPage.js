import React from 'react';
import { Link } from 'react-router-dom';
import DatasetItem from './DatasetItem';

/*
 * TODO: Make the login page and its necessary parts
 * this is only a placeholder and can be changed/replaced as necessary
 */
function DatasetsPage() {
    return (
        <div>
            <DatasetItem dbname='DATASET 1' dblink='dblink1'/>
        </div>
    );
}

export default DatasetsPage;