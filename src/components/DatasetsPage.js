import React from 'react';
import DatasetItem from './DatasetItem';
import { Stack } from '@mui/material';

/*
 * page for datasets; can view, download, and see how many records there are for each dataset
 */
const dblink1='https://physionet.org/content/adfecgdb/1.0.0/'
const dllink1='https://physionet.org/static/published-projects/adfecgdb/abdominal-and-direct-fetal-ecg-database-1.0.0.zip'
const dblink2='https://physionet.org/content/aftdb/1.0.0/'
const dllink2='https://physionet.org/static/published-projects/aftdb/af-termination-challenge-database-1.0.0.zip'
const dblink3='https://physionet.org/content/aami-ec13/1.0.0/'
const dllink3='https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip'
const dblink4='https://physionet.org/content/apnea-ecg/1.0.0/'
const dllink4='https://physionet.org/static/published-projects/apnea-ecg/apnea-ecg-database-1.0.0.zip'
const dblink5='https://physionet.org/content/auditory-eeg/1.0.0/'
const dllink5='https://physionet.org/static/published-projects/auditory-eeg/auditory-evoked-potential-eeg-biometric-dataset-1.0.0.zip'

//
const dbKey1='adfecgdb'
const dbKey2='aftdb'
const dbKey3='aami-ec13'
const dbKey4='apnea-ecg'
const dbKey5='auditory-eeg'

function DatasetsPage() {
    function getRecordNum(inputCode){
        fetch("/dataset/" + inputCode) // use "http://127.0.0.1:5000/dataset/" + inputCode for local'
        .then(response => 
          response.json()
        )
        .then(data => {
          console.log(data.recordNum)
          return data.recordNum
        })
        .catch(error => {
          console.log(error)
        })
    }


    return (
        <Stack direction='column' alignItems="flex-start" justifyContent='flex-start' spacing={4}>
            <DatasetItem dbname='ABDOMINAL AND DIRECT FETAL ECG' dblink={dblink1} dllink={dllink1} recordnum={getRecordNum(dbKey1)}/>

            <DatasetItem dbname='AF TERMINATION CHALLENGE' dblink={dblink2} dllink={dllink2} recordnum={getRecordNum(dbKey2)}/>

            <DatasetItem dbname='ANSI/AAMI EC13 TEST WAVEFORMS' dblink={dblink3} dllink={dllink3} recordnum={getRecordNum(dbKey3)}/>

            <DatasetItem dbname='APNEA-ECG' dblink={dblink4} dllink={dllink4} recordnum={getRecordNum(dbKey4)}/>

            <DatasetItem dbname='AUDITORY EVOKED POTENTIAL EEG-BIOMETRIC' dblink={dblink5} dllink={dllink5} recordnum={getRecordNum(dbKey5)}/>
        </Stack>
    );
}

export default DatasetsPage;