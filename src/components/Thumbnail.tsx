import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { useEffect, useRef } from 'react'
import { exportToSvg } from '@excalidraw/excalidraw'

export const Thumbnail = ({saveContents}: {saveContents: ExcalidrawElement[]}) => {

  const thumbnail = useRef<HTMLDivElement>(null)

  useEffect(() => {

    const main = async () => {

      if (thumbnail.current == undefined) return 

      const svg = await exportToSvg({elements: saveContents, files: null})

      svg.setAttribute('width', 'auto')
      svg.setAttribute('height', 'auto')
      thumbnail.current.appendChild(svg)

    }

    main()
  }, [thumbnail])

  return (
    <div ref={thumbnail} className="w-full"/>
  )
}
