import React from 'react'
import './App.css'
import Tree from './Tree'

function App() {
  const data = [
    {
      text: 'Folder 1',
      children: [
        {
          text: 'Sub Folder 1',
          children: [
            {
              text: 'Sub Sub Folder 1',
            },
          ],
        },
        {
          text: 'Sub Folder 2',
        },
      ],
    },
    {
      text: 'Folder 2',
      children: [],
    },
  ]

  return (
    <div className="app">
      <Tree nodes={data} />
    </div>
  )
}

export default App
