import React from 'react';
import DatasetItem from './DatasetItem';
import { Stack } from '@mui/material';
import NavBar from './NavBar';

/*
 * page for datasets; can view, download, and see how many records there are for each dataset
 */

//links for downloading and viewing datasets
const dslink1='https://physionet.org/content/adfecgdb/1.0.0/'
const dllink1='https://physionet.org/static/published-projects/adfecgdb/abdominal-and-direct-fetal-ecg-database-1.0.0.zip'
const dslink2='https://physionet.org/content/aftdb/1.0.0/'
const dllink2='https://physionet.org/static/published-projects/aftdb/af-termination-challenge-database-1.0.0.zip'
const dslink3='https://physionet.org/content/aami-ec13/1.0.0/'
const dllink3='https://physionet.org/static/published-projects/aami-ec13/ansiaami-ec13-test-waveforms-1.0.0.zip'
const dslink4='https://physionet.org/content/apnea-ecg/1.0.0/'
const dllink4='https://physionet.org/static/published-projects/apnea-ecg/apnea-ecg-database-1.0.0.zip'
const dslink5='https://physionet.org/content/auditory-eeg/1.0.0/'
const dllink5='https://physionet.org/static/published-projects/auditory-eeg/auditory-evoked-potential-eeg-biometric-dataset-1.0.0.zip'

//keys to get the respective dataset with
const dsKey1='adfecgdb'
const dsKey2='aftdb'
const dsKey3='aami-ec13'
const dsKey4='apnea-ecg'
const dsKey5='auditory-eeg'

function DatasetsPage() {
    return (
        <div>
            <NavBar/>

            <Stack direction='column' alignItems="flex-start" justifyContent='flex-start' spacing={4}>
                <DatasetItem dsname='ABDOMINAL AND DIRECT FETAL ECG' dslink={dslink1} dllink={dllink1} dskey={dsKey1}/>

                <DatasetItem dsname='AF TERMINATION CHALLENGE' dslink={dslink2} dllink={dllink2} dskey={dsKey2}/>

                <DatasetItem dsname='ANSI/AAMI EC13 TEST WAVEFORMS' dslink={dslink3} dllink={dllink3} dskey={dsKey3}/>

                <DatasetItem dsname='APNEA-ECG' dslink={dslink4} dllink={dllink4} dskey={dsKey4}/>

                <DatasetItem dsname='AUDITORY EVOKED POTENTIAL EEG-BIOMETRIC' dslink={dslink5} dllink={dllink5} dskey={dsKey5}/>
            </Stack>
        </div>
    );
}

export default DatasetsPage;