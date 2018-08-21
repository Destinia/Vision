import React from 'react'
import marked from 'marked'
import './index.css'

const Markdown = ({ data }) => <div
  className="markdown"
  dangerouslySetInnerHTML={{ __html: marked(data) }}
/>;

export default Markdown;
