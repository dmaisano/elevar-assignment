import React from 'react'
import Tree from './Tree'

const Collapsible: React.FC<any> = ({ children }) => {
  const collapsibleTree = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Tree) {
      return React.cloneElement<any>(child, {
        enableCollapseMode: true,
      })
    }
    return child
  })

  return collapsibleTree
}

export default Collapsible
