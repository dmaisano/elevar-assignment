import React from 'react'
import './App.css'
import Tree, { TreeNode } from './Tree'
import Sortable from './Sortable'

function App() {
  const data: TreeNode[] = [
    {
      text: 'Movies',
      children: [
        {
          text: 'Horror',
          children: [
            {
              text: 'Halloween',
            },
            {
              text: 'Alien',
            },
          ],
        },
        {
          text: 'Action',
          children: [
            {
              text: 'Stonecold',
            },
            {
              text: 'Commando',
            },
          ],
        },
      ],
    },
    {
      text: 'Books',
      children: [
        {
          text: 'Children of time',
        },
      ],
    },
  ]

  return (
    <div className="app">
      <Sortable>
        <Tree nodes={data} />
      </Sortable>
    </div>
  )
}

export default App
