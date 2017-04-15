/////////////////////////////////////////////////////////////////
// Raytracer Viewer Extension
// By Philippe Leefsma, Autodesk Inc, April 2017
//
/////////////////////////////////////////////////////////////////
import ExtensionBase from 'Viewer.ExtensionBase'
import WidgetContainer from 'WidgetContainer'
import EventTool from 'Viewer.EventTool'
import Toolkit from 'Viewer.Toolkit'
import ReactDOM from 'react-dom'
import Switch from 'Switch'
import Label from 'Label'
import React from 'react'

// you can intersect the whole scene using viewer.impl.rayIntersect,
// or you can do it per model via model.rayIntersect,
// or per mesh via VBIntersector.rayCast.
// The first two approaches take advantage of the spatial index acceleration structure.

class RaytracerExtension extends ExtensionBase {

	/////////////////////////////////////////////////////////////////
	// Class constructor
  //
	/////////////////////////////////////////////////////////////////
	constructor (viewer, options) {

		super (viewer, options)

    this.renderTitle = this.renderTitle.bind(this)

    this.react = options.react
	}

	/////////////////////////////////////////////////////////
	// Load callback
  //
  /////////////////////////////////////////////////////////
	load () {

    this.viewerEvent([

      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      Autodesk.Viewing.GEOMETRY_LOADED_EVENT

    ]).then((args) => this.onModelLoaded(args))

    this.react.setState({


    }).then (() => {

      this.react.pushRenderExtension(this)
    })

    console.log('Viewing.Extension.Raytracer loaded')

		return true
	}

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  get className() {

    return 'ray-tracer'
  }

  /////////////////////////////////////////////////////////
	// Extension Id
  //
  /////////////////////////////////////////////////////////
	static get ExtensionId () {

		return 'Viewing.Extension.Raytracer'
	}

  /////////////////////////////////////////////////////////
	// Unload callback
  //
  /////////////////////////////////////////////////////////
	unload () {

    console.log('Viewing.Extension.Raytracer loaded')

		return true
	}

  /////////////////////////////////////////////////////////
  // Async viewer event
  //
  /////////////////////////////////////////////////////////
  viewerEvent (eventId) {

    const eventIdArray = Array.isArray(eventId)
      ? eventId : [eventId]

    const eventTasks = eventIdArray.map((id) => {
      return new Promise ((resolve) => {
        const handler = (args) => {
          this.viewer.removeEventListener (
            id, handler )
          resolve (args)
        }
        this.viewer.addEventListener (
          id, handler)
      })
    })

    return Promise.all(eventTasks)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onModelLoaded (args) {

    const instanceTree = args[0].model.getData().instanceTree

    const rootId = instanceTree.getRootId()

    console.log(rootId)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  async setDocking (docked) {

    const id = RaytracerExtension.ExtensionId

    if (docked) {

      await this.react.popRenderExtension(id)

      this.react.pushViewerPanel(this, {
        height: 250,
        width: 350
      })

    } else {

      this.react.popViewerPanel(id)

      this.react.pushRenderExtension(this)
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderTitle (docked) {

    const spanClass = docked
      ? 'fa fa-chain-broken'
      : 'fa fa-chain'

    return (
      <div className="title">
        <label>
          Ray Tracer
        </label>
        <div className="ray-tracer-controls">
          <button onClick={() => this.setDocking(docked)}
            title="Toggle docking mode">
            <span className={spanClass}/>
          </button>
        </div>
      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  renderContent () {

    return (
      <div className="content">

      </div>
    )
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render (opts = {showTitle: true}) {

    return (
      <WidgetContainer renderTitle={this.renderTitle}
        showTitle={opts.showTitle}
        className={this.className}>

        { this.renderContent () }

      </WidgetContainer>
    )
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension (
  RaytracerExtension.ExtensionId,
  RaytracerExtension)

export default 'Viewing.Extension.Raytracer'