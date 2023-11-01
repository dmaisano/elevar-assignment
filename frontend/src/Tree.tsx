import React from 'react'

interface TreeNode {
  text: string
  children?: TreeNode[]
}

interface TreeProps {
  nodes: TreeNode[]
}

const Tree: React.FC<TreeProps> = ({ nodes }) => {
  return nodes.map(({ text, children }) => (
    <ul>
      <li>{text}</li>
      {children && children?.length > 0
        ? children?.map((childNodes) => <Tree nodes={[childNodes]} />)
        : null}
    </ul>
  ))
}

export default Tree
