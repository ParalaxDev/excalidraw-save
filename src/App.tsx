import { useEffect, useState, useRef } from 'react'
import { ExcalidrawSave, getAllFromLocalStorage, getExcalidrawFromSite, saveToLocalStorage } from "./utils/localstorage"
import { exportToSvg } from '@excalidraw/excalidraw'

function App() {

  const [status, setStatus] = useState("Loading excalidraw content...")
  const [content, setContent] = useState("")
  const [saves, setSaves] = useState<ExcalidrawSave[]>([])
  const ref = useRef<any>();


  useEffect(() => {
    const main = async () => {
      const {res, status} = await getExcalidrawFromSite()

      if (status == "error") setStatus(res)
      else {
        setStatus("Successfully loaded content")
        setContent(res)
        console.log(res)
      }

      const allSaves = await getAllFromLocalStorage()

      console.log(allSaves)

      setSaves(allSaves)
      
      const svg = await exportToSvg({elements: allSaves[0].content, files: null})
      console.log('svg', svg)
      console.log('json', allSaves[0].content)
      ref.current.appendChild(svg)
    }

    main()

  }, [])

   return (
    <>
      <h1>Excalidraw Save</h1>
      <p>{status}</p>
      <button onClick={async () => {
        saveToLocalStorage({name:'test', content: JSON.parse(content)})
        const allSaves = await getAllFromLocalStorage()

        setSaves(allSaves)

      }}>Save</button>
      <button onClick={() => chrome.storage.local.set({'local_saves': []})}>Reset</button>
      <ul>
        {saves.length > 0 ? saves.map((save) => {
          return <li>{save.id}</li>
        }) : <li>loading...</li>}
      </ul>
      <div ref={ref} />
      
    </>
  )

}

export default App
