import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

class DatasetItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Stack direction='column' alignItems="flex-start" justifyContent='flex-start' spacing={2}>
                <Stack direction='row' alignItems="flex-start" justifyContent='flex-start' spacing={3}>
                    <a target="_blank" href={this.props.dblink}>
                        {this.props.dbname}
                    </a>

                    <a target="_blank" href={this.props.dllink}>
                        DOWNLOAD
                    </a>
                </Stack>

                <div>
                    {"Number of Records: " + this.props.recordnum}
                </div>

            </Stack>
        );
    }
}

export default DatasetItem;
