import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

class DatasetItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Stack direction='row' alignItems="flex-start" justifyContent='flex-start' spacing={2}>
                <Link to={this.props.dblink} target="_blank">
                    {this.props.dbname}
                </Link>

            </Stack>
        );
    }
}

export default DatasetItem;
