import React from 'react'

interface SortableProps {
  children: React.ReactNode
}

const Sortable: React.FC<SortableProps> = ({ children }) => {
  const sortNodesRecursively = (nodes) => {
    return nodes
      .map(({ text, children }) => ({
        text,
        children: children ? sortNodesRecursively(children) : undefined,
      }))
      .sort((a, b) => a.text.localeCompare(b.text))
  }

  const sortedChildren = React.Children.map(children, (child) => {
    return React.cloneElement(child as any, {
      nodes: sortNodesRecursively((child as any).props.nodes),
    })
  })

  return <>{sortedChildren}</>
}

export default Sortable
