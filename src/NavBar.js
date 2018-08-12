/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { overwriteChart } from './action'
import { jumpCheckpoint } from './store/checkpointEnhancer'
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

  loadFile(file, obj => dispatch(overwriteChart(obj)))
}

const NavBar = ({ canUndo, canRedo, undo, redo, upload, download }) => (
  <nav className='navbar'>
    <ul>
      <li><NavIcon iconName='icon-undo' enable={canUndo} onClick={undo} /></li>
      <li><NavIcon iconName='icon-redo' enable={canRedo} onClick={redo} /></li>
      <li><NavIcon iconName='icon-download3' onClick={download} /></li>
      <li><NavIcon iconName='icon-upload3' onClick={onUploadBtnClick}/></li>
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
  }),
)(NavBar)
