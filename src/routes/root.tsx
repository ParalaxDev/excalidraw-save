import { useEffect, useState } from 'react'
import { ExcalidrawSave, getAllFromLocalStorage, getExcalidrawFromSite, saveToLocalStorage } from "../utils/localstorage"
import { SaveElement } from '../components/SaveElement'

export const Root = () => {

  const [_status, setStatus] = useState("Loading excalidraw content...")
  const [content, setContent] = useState("")
  const [saves, setSaves] = useState<ExcalidrawSave[]>([])


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
      
    }

    main()

  }, [])

   return (
    <div className="w-[48rem] h-[72rem] p-4 flex flex-col justify-between">
      <div>
      <h1 className='text-4xl mb-4 font-bold'>Excalidraw Save</h1>
      <div className='grid grid-cols-2 gap-2'>
        {saves.length > 0 ? saves.map((save) => {
            if (save.type == 'current') return <SaveElement save={save}/>
        }) : null}
      </div>
      </div>
      
      <div>
      <button onClick={async () => {
        saveToLocalStorage({name:'test', content: JSON.parse(content)})
        const allSaves = await getAllFromLocalStorage()

        setSaves(allSaves)

      }}>Save</button>
      <button onClick={() => chrome.storage.local.set({'local_saves': []})}>Reset</button>
      <p>build: {new Date().toTimeString()}</p>
      </div>
    </div>
  )

}

