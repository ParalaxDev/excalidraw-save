import { useEffect, useRef } from 'react'
import {injectExcalidrawIntoSite, type ExcalidrawSave } from '../utils/localstorage'
import { exportToSvg } from '@excalidraw/excalidraw'
import { formatDistance, format } from 'date-fns'

export const SaveElement = ({save} :{save: ExcalidrawSave}) => {

  const thumbnail = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const main = async () => {

      if (thumbnail.current == undefined) return 

      const svg = await exportToSvg({elements: save.content, files: null})

      svg.setAttribute('width', 'auto')
      svg.setAttribute('height', 'auto')
      thumbnail.current.appendChild(svg)

    }

    main()
  }, [thumbnail, save])

  return (
    <div className="w-full border p-4 rounded-lg">
      <h1 className='text-xl font-bold'>{save.name}</h1>


      <button className='w-full rounded-lg flex flex-col justify-between h-full' onClick={() => injectExcalidrawIntoSite(save.content)}>
        <div className='w-full' ref={thumbnail}/>
        <p className="text-xs text-neutral-600">Last updated {formatDistance(new Date(save.updatedAt), new Date())} | Created at: {format(new Date(save.createdAt), "HH:MM dd/MM/yy")}</p>

      </button>

    </div>
  )
}
