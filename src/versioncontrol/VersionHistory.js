import React, { useEffect, useState } from 'react';
import { Modal, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { CompareArrows, Timeline, FolderShared } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import VersionDiff from './VersionDiff';
import userAxios from '../apis/userApi';


function VersionHistory({ open, handleClose, versions, handleRevert, saveFileVersion, fileVersions, persona }) {
    const { group, project_name } = useParams();
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [previousVersion, setPreviousVersion] = useState(null);

    useEffect(() => {
        if (open) {
            setSelectedVersion(null);  // Reset on open
        }
    }, [open]);

    const handleViewDiff = (version) => {
        const index = versions.findIndex(v => v.id === version.id);
        if (index > 0) {
            setPreviousVersion(versions[index - 1]);  // Compare with previous version
        } else {
            setPreviousVersion({ content: '' });       // If it's the first version, compare with empty content
        }
        setSelectedVersion(version);
    };

    const saveFileShareToDb = (version) => {
        const searchResult = fileVersions.find((eachVersion) => eachVersion.id === version.id);
        if (searchResult) {
            return
        } else {
            userAxios.post(`/files`, version).then((response) => {
                saveFileVersion((prevSharedVersions) => [...prevSharedVersions, response.data]);
            });
        }
    }

    const handleFileShare = (version) => {
        if (persona.isTeacher) {
            return;
        }
        saveFileShareToDb(version);
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ 
                padding: '20px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                maxWidth: '600px', 
                margin: '100px auto', 
                display: 'flex', 
                flexDirection: 'column', 
                maxHeight: '80vh', 
                overflowY: 'auto' 
            }}>
                <Typography variant="h5" gutterBottom>Version History</Typography>
                <Typography variant="h6" gutterBottom>
                    Group: {group} | Project: {project_name}
                </Typography>
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {versions.map((version) => (
                        <ListItem key={version.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <ListItemText
                                    primary={`Version from ${new Date(version.timeStamp).toLocaleString()}`}
                                    secondary={`By: ${version.changesBy} | Comment: ${version.comment?.length > 10 ? version.comment.substring(0, 20) + '...' : version.comment || 'None'}`}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="contained" onClick={() => handleRevert(version)} startIcon={<Timeline />} sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>
                                    Revert
                                </Button>
                                <Button variant="contained" onClick={() => handleViewDiff(version)} startIcon={<CompareArrows />} sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }} >
                                    View Diff
                                </Button>
                                <Button variant="contained" onClick={() => handleFileShare(version)} startIcon={<FolderShared   />} sx={{ backgroundColor: 'blue', color: 'white', '&:hover': { backgroundColor: 'darkblue' } }} >
                                    Share File
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>

                {selectedVersion && (
                    <VersionDiff
                        oldVersion={previousVersion?.content || ''}
                        newVersion={selectedVersion.content}
                        handleClose={() => setSelectedVersion(null)}
                    />
                )}
            </div>
        </Modal>
    );
}

export default VersionHistory;