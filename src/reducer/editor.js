const defaultEditorState = ''

export default (state = defaultEditorState, action) => {
  if (action.type === 'TOGGLE_EDITOR') {
    return action.editor
  }

  return state
}
