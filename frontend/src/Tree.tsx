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
    <div>
      <div>{text}</div>
      {children && children?.length > 0
        ? children?.map((childNodes) => <Tree nodes={[childNodes]} />)
        : null}
    </div>
  ))
}

export default Tree
