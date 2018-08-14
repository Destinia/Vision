/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { overwriteChart } from './action'
import { jumpCheckpoint, addCheckpoint } from './store/checkpointEnhancer'
import { loadFile, exportFile } from './utils'

import './NavBar.css'
import './icons/style.css'

const NavIcon = ({ enable = true, iconName, onClick }) => (
  <a href='#' role='button' onClick={enable ? onClick : undefined}>
    <i className={enable ? iconName : `${iconName} icon-disable`} />
  </a>
)

function onUploadBtnClick() {
  const upload = document.getElementById('upload-hidden-input')
  if (upload) {
    upload.click()
    upload.value = ''
  }
}

function onFileUpload(dispatch, e) {
  const file = e.target.files.length === 0 ? undefined : e.target.files[0]
  if (!file) return

  loadFile(file, obj => {
    dispatch(addCheckpoint())
    dispatch(overwriteChart(obj))
  })
}

function onClearLayout(dispatch) {
  dispatch(overwriteChart({}))
}

const NavBar = ({ canUndo, canRedo, undo, redo, upload, download, clear }) => (
  <nav className='navbar'>
    <ul>
      <li><NavIcon iconName='icon-undo' enable={canUndo} onClick={undo} /></li>
      <li><NavIcon iconName='icon-redo' enable={canRedo} onClick={redo} /></li>
      <li className='list-separator'><span>|</span></li>
      <li><NavIcon iconName='icon-clear' onClick={clear} /></li>
      <li><NavIcon iconName='icon-download' onClick={download} /></li>
      <li><NavIcon iconName='icon-upload' onClick={onUploadBtnClick}/></li>
      <input type="file" id="upload-hidden-input"
        onChange={upload} accept="application/x-yaml"/>
    </ul>
  </nav>
)

export default connect(
  ({ checkpoint: { history, current }, charts }) => ({
    canUndo: current > 0,
    canRedo: history.length - current !== 1,
    download: exportFile.bind(null, charts),
  }),
  dispatch => ({
    ...bindActionCreators({
      overwriteChart,
      undo: jumpCheckpoint.bind(null, -1),
      redo: jumpCheckpoint.bind(null, 1),
    }, dispatch),
    upload: onFileUpload.bind(null, dispatch),
    clear: onClearLayout.bind(null, dispatch),
  }),
)(NavBar)
