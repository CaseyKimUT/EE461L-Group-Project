import React from 'react';
import { Stack } from '@mui/material';

class DatasetItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recordnum: 0
        }
    }

    componentWillMount() {
        fetch("http://127.0.0.1:5000/dataset/" + this.props.dskey) // use "http://127.0.0.1:5000/dataset/" + inputCode for local'
        .then(response => 
          response.json()
        )
        .then(data => {
          console.log(data.recordNum)
          this.setState({
            recordnum: data.recordNum
          })
        })
        .catch(error => {
          console.log(error)
        })
    }

    render() {
        return(
            <Stack direction='column' alignItems="flex-start" justifyContent='flex-start' spacing={2}>
                <Stack direction='row' alignItems="flex-start" justifyContent='flex-start' spacing={3}>
                    <a target="_blank" href={this.props.dslink}>
                        {this.props.dsname}
                    </a>

                    <a target="_blank" href={this.props.dllink}>
                        DOWNLOAD
                    </a>
                </Stack>

                <div>
                    {"Number of Records: " + this.state.recordnum}
                </div>

            </Stack>
        );
    }
}

export default DatasetItem;
