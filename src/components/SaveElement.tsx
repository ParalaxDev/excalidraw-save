import { useEffect, useRef } from 'react'
import {injectExcalidrawIntoSite, type ExcalidrawSave } from '../utils/localstorage'
import { exportToSvg } from '@excalidraw/excalidraw'

export const SaveElement = ({save} :{save: ExcalidrawSave}) => {

  const thumbnail = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const main = async () => {

      if (thumbnail.current == undefined) return 

      const svg = await exportToSvg({elements: save.content, files: null})
      thumbnail.current.appendChild(svg)

    }
    
    main()
  }, [thumbnail, save])
  return (
    <li>
      <h1>{save.name}</h1>

      <div ref={thumbnail}/>
    
      <button onClick={() => injectExcalidrawIntoSite(save.content)}>Load Save</button>
    </li>
  )
}
