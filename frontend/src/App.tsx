import React from 'react'
import './App.css'
import Tree, { TreeNode } from './Tree'
import Sortable from './Sortable'
import Collapsible from './Collapsible'

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
      <div>
        <Collapsible>
          <Tree nodes={data} />
        </Collapsible>
        <Sortable>
          <Tree nodes={data} />
        </Sortable>
      </div>
    </div>
  )
}

export default App
