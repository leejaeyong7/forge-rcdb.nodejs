import { TreeDelegate } from 'TreeView'
import RayTreeNode from './RayTreeNode'

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
export default class RayTreeDelegate extends TreeDelegate {

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  constructor (model) {

    super ()

    this.instanceTree = model.getData().instanceTree
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  buildNode (data) {

    const node = new RayTreeNode({
      name: this.instanceTree.getNodeName(data.id),
      group: this.getChildIds(data.id).length,
      instanceTree: this.instanceTree,
      parent: data.parent,
      type: data.type,
      id: data.id
    })

    node.on('checked', (node) => {

      this.emit('node.checked', node)
    })

    return node
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  createTreeNode (node, parentDomElement, options = {}) {

    const container = document.createElement('div')

    parentDomElement.appendChild(container)

    node.mount(container)
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  forEachChild (node, addChild) {

    node.addChild = addChild
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  getChildIds (nodeId) {

    const childIds = []

    this.instanceTree.enumNodeChildren(nodeId,
      (childId) => {

        childIds.push(childId)
      })

    return childIds
  }
}
