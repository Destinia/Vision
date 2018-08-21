export const addBlock = ({ key, layout, block} ) => ({
  type: 'ADD_BLOCK',
  key,
  layout,
  block,
})

export const removeBlock = key => ({
  type: 'REMOVE_BLOCK',
  key,
})

export const updateBlockLayouts = layouts => ({
  type: 'UPDATE_BLOCK_LAYOUT',
  layouts,
})

export const updateBlockStatic = (key, locked) => ({
  type: 'UPDATE_BLOCK_STATIC',
  key,
  static: locked,
})

export const updateBlockSchema = (key, schema) => ({
  type: 'UPDATE_BLOCK_SCHEMA',
  key,
  schema,
})

export const overwriteBlocks = blocks => ({
  type: 'OVERWRITE_BLOCKS',
  blocks,
})

export const clearBlocks = () => ({
  type: 'CLEAR_BLOCKS',
})

export const toggleEditor = editor => ({
  type: 'TOGGLE_EDITOR',
  editor,
})
