import React from 'react'
import DropZone from 'react-dropzone'

const dropZoneStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  width: "100%",
  height: "100%"
};

const Upload = ({ onDrop }) => {
  let dropZoneRef
  return (
    <div className="upload" onDoubleClick={() => {dropZoneRef.open()}}>
      <DropZone
        ref={(node) => { dropZoneRef = node; }}
        onDrop={onDrop}
        disableClick
        style={dropZoneStyle}
      >
        <i className="icon-file-upload" style={{ fontSize: '4rem' }} />
        <span>Upload chart</span>
      </DropZone>
    </div>
    );
}

export default Upload
