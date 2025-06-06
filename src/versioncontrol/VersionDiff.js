import React from 'react';
import { diffWords } from 'diff';

const VersionDiff = ({ oldVersion, newVersion, handleClose }) => {
    const diff = diffWords(oldVersion, newVersion);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ textAlign: 'center' }}>Version Diff Viewer</h2>
            <div 
                style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '10px',
                    marginBottom: '20px'
                }}
            >
                {diff.map((part, index) => (
                    <span
                        key={index}
                        style={{
                            backgroundColor: part.added ? '#d4fcd4' : part.removed ? '#fcd4d4' : 'transparent',
                            textDecoration: part.removed ? 'line-through' : 'none',
                            color: part.added ? 'green' : part.removed ? 'red' : 'black',
                        }}
                    >
                        {part.value}
                    </span>
                ))}
            </div>
            <button
                onClick={handleClose}
                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Close Diff
            </button>
        </div>
    );
};

export default VersionDiff;
