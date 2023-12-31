import {useEffect, useState} from 'react'
import 'SRC/App.css'

import Table from 'SRC/components/common/SortedTable/SortedTable.jsx'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CopyIcon from '@mui/icons-material/ContentCopy'
import CommandSelect from "SRC/components/DevComponents/CommandSelect.jsx";
import ContextSelect from "SRC/components/DevComponents/ContextSelect.jsx";
import Button from "@mui/material/Button";
import {uploadBytes, ref} from "firebase/storage";
import {storage} from "SRC/firebaseConfig.js";

const Dev = () => {
    const [chosenChildValues, setChosenChildValues] = useState('');
    const [commandState, setCommandState] = useState('rosrun')
    const [context, setContext] = useState('writing')
    const [command, setCommand] = useState('')
    const [canRun, setCanRun] = useState(false)

    useEffect(() => {
        updateCommandField()
    }, [chosenChildValues, commandState, context])

    const handleCopyClick = (string) => {
        navigator.clipboard.writeText(string).then(
            () => {
                //TODO animation on write success
            },
            () => {
                //write failed
            }
        )
    }

    const handleChange = (event) => {
        setCommand(event.target.value)
    }

    const handleRowSelect = (string) => {
        setChosenChildValues(string)
    }

    const onCommandChange = (string) => {
        setCommandState(string)
    }

    const onContextChange = (string) => {
        setContext(string)
    }

    const onRunClick = () => {
        fetch('http://localhost:3000/run-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({command}),
        })
            .then(response => {
                if (response.status !== 200) {
                    return response.json().then(r => {
                        throw new Error(r.error)
                    })
                }
                return response.json();
            })
            .then(data => {
                const content = atob(data.data)
                const file = new Blob([content], {type: 'application/octet-stream'})
                const storageRef = ref(storage, `commandOutputs/${data.file}`)

                uploadBytes(storageRef, file)
                    .then((snapshot) => {
                        alert(`The results stored in the file ${data.file} are: \n${content}\n\n This file has been uploaded.`)
                    })
                    .catch((error) => {
                        alert(`Error: ${error}`)
                    })
            })
            .catch((error) => {
                alert(error);
            });
    }

    const updateCommandField = () => {
        if (chosenChildValues.length !== 0) {
            setCommand(`${commandState} -c ${context} ${chosenChildValues}`)
            setCanRun(true)
        } else {
            setCanRun(false)
        }
    }

    return (
        <div className="App" style={{
            maxWidth: '1280px',
            margin: '50px auto',
        }}>
            <Table
                onRowSelect={handleRowSelect}
            />
            <div style={{
                width: '100%',
                textAlign: 'left',
            }}>
                <ContextSelect
                    value={context}
                    onChange={onContextChange}
                />
            </div>
            <div style={{
                width: '100%',
                textAlign: 'left',
            }}>
                <CommandSelect
                    commandState={commandState}
                    onCommandChange={onCommandChange}
                />
            </div>
            <Box
                sx={{
                    display: 'flex',
                    mb: 2
                }}
            >
                <TextField
                    id="outlined-basic"
                    label="Generated command"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    value={command}
                />
                <IconButton
                    type="button"
                    sx={{p: '10px'}}
                    aria-label="Copy"
                    onClick={() => handleCopyClick(command)}
                >
                    <CopyIcon/>
                </IconButton>
            </Box>
            <Box sx={{textAlign: 'left'}}>
                <Button
                    variant="contained"
                    onClick={onRunClick}
                    disabled={!canRun}
                >
                    Run
                </Button>
            </Box>
        </div>
    )
}

export default Dev
