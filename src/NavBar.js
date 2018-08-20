/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { overwriteBlocks, clearBlocks, toggleEditor } from './action'
import { jumpCheckpoint, addCheckpoint } from './store/checkpointEnhancer'
import { loadFile, exportFile } from './utils'

import './NavBar.css'
import './icons/style.css'

const NavIcon = ({ enable = true, iconName, onClick, title }) => (
  <a href='#' role='button' onClick={enable ? onClick : undefined} title={title}>
    <i className={enable ? iconName : `${iconName} icon-disable`} />
  </a>
)

function togglePreview() {
  // TODO: get previewing status and set routing path
}

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
    dispatch(clearBlocks())
    dispatch(overwriteBlocks(obj))
  })
}

function onClearLayout(dispatch) {
  dispatch(overwriteBlocks({}))
}

const NavBar = ({ canUndo, canRedo, undo, redo, upload, download, clear, preview, openChartEditor, openMarkdownEditor, togglePreview }) => (
  <nav className='navbar'>
    <ul>
      <li><NavIcon iconName='icon-add-chart' title="Add Chart" onClick={openChartEditor} /></li>
      <li><NavIcon iconName='icon-add-markdown' title="Add Markdown" onClick={openMarkdownEditor} /></li>
    </ul>
    <ul>
      <li><NavIcon iconName={preview ? 'icon-preview-on' : 'icon-preview-off'} title="Toggle Preview" onClick={togglePreview} /></li>
      <li className='list-separator'><span>|</span></li>
      <li><NavIcon iconName='icon-undo' enable={canUndo} onClick={undo} title="Undo" /></li>
      <li><NavIcon iconName='icon-redo' enable={canRedo} onClick={redo} title="Redo" /></li>
      <li className='list-separator'><span>|</span></li>
      <li><NavIcon iconName='icon-clear' onClick={clear} title="Clear Layout" /></li>
      <li><NavIcon iconName='icon-download' onClick={download} title="Export Layout" /></li>
      <li><NavIcon iconName='icon-upload' onClick={onUploadBtnClick} title="Import Layout"/></li>
      <input type="file" id="upload-hidden-input"
        onChange={upload} accept="application/x-yaml"/>
    </ul>
  </nav>
)

export default connect(
  ({ checkpoint: { history, current }, blocks }) => ({
    canUndo: current > 0,
    canRedo: history.length - current !== 1,
    download: exportFile.bind(null, blocks),
    preview: true,
  }),
  dispatch => ({
    ...bindActionCreators({
      overwriteBlocks,
      clearBlocks,
      openChartEditor: toggleEditor.bind(null, 'chart'),
      openMarkdownEditor: toggleEditor.bind(null, 'markdown'),
      undo: jumpCheckpoint.bind(null, -1),
      redo: jumpCheckpoint.bind(null, 1),
    }, dispatch),
    upload: onFileUpload.bind(null, dispatch),
    clear: onClearLayout.bind(null, dispatch),
    togglePreview,
  }),
)(NavBar)
