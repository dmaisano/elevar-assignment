import React from 'react'

interface TreeNode {
  text: string
  children?: TreeNode[]
}

interface TreeProps {
  nodes: TreeNode[]
}

const Tree: React.FC<TreeProps> = ({ nodes }) => {
  return nodes.map(({ text }) => <div>{text}</div>)
}

export default Tree
