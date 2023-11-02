import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export type TreeNode = {
  text: string
  children?: TreeNode[]
}

interface TreeProps {
  nodes: TreeNode[]
  depth?: number
}

const Tree: React.FC<TreeProps> = ({ nodes, depth = 0 }) => {
  return nodes.map(({ text, children }) => (
    <ul key={`${depth}-${text}`}>
      <li>{text}</li>
      {children && children?.length > 0
        ? children?.map((childNodes) => (
            <Tree key={`tree-${uuidv4()}`} nodes={[childNodes]} depth={depth + 1} />
          ))
        : null}
    </ul>
  ))
}

export default Tree
