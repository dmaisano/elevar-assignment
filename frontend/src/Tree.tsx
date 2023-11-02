import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export type TreeNode = {
  text: string
  children?: TreeNode[]
}

export type TreeProps = {
  nodes: TreeNode[]
  depth?: number
  enableCollapseMode?: boolean
}

const Tree: React.FC<TreeProps> = ({ nodes, depth = 0, enableCollapseMode = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(enableCollapseMode)

  const toggleCollapse = () => {
    if (!enableCollapseMode) return
    setIsCollapsed(!isCollapsed)
  }

  return nodes.map(({ text, children }) => (
    <ul key={`tree-${uuidv4()}`}>
      <li
        style={{ cursor: enableCollapseMode ? 'pointer' : 'default' }}
        onClick={() => toggleCollapse()}
      >
        {text}
      </li>
      {!isCollapsed && children && children?.length > 0
        ? children?.map((childNodes) => (
            <Tree
              key={`tree-${uuidv4()}`}
              nodes={[childNodes]}
              depth={depth + 1}
              enableCollapseMode={enableCollapseMode}
            />
          ))
        : null}
    </ul>
  ))
}

export default Tree
