import React from 'react'
import marked from 'marked'
import './index.css'

const Markdown = ({ data, id }) => <div
  id={id}
  className="markdown"
  dangerouslySetInnerHTML={{ __html: marked(data) }}
/>;

export default Markdown;
