import { useEffect, useState } from 'react'
import { ExcalidrawSave, getAllFromLocalStorage, getEditingId, getExcalidrawFromSite, saveToLocalStorage, setEditingId } from "../utils/localstorage"
import { SaveElement } from '../components/SaveElement'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sha256 } from 'js-sha256'
import { searchForValueInSave } from '../utils/helpers'

export const Root = () => {

  const [_status, setStatus] = useState("Loading excalidraw content...")
  const [content, setContent] = useState("")
  const [saves, setSaves] = useState<ExcalidrawSave[]>([])
  const navigate = useNavigate()
  const [searchParams, _setSearchParams] = useSearchParams()


  useEffect(() => {
    const main = async () => {
      const lastEditing = await getEditingId()
      if (lastEditing !== '') {
        console.log('navigating to ', `/save/${lastEditing}`)
        navigate(`/save/${lastEditing}?reload=false`)
      } else setEditingId('')

      const {res, status} = await getExcalidrawFromSite()

      if (status == "error") setStatus(res)
      else {
        setStatus("Successfully loaded content")
        setContent(res)
        console.log(res)
      }

      const allSaves = await getAllFromLocalStorage()

      const hash = sha256(res)

      const searched = searchForValueInSave(allSaves, 'hash', hash)

      if (searched.length > 0 && searchParams.get('redirect') !== 'false') {

        console.log('navigating to ', `/save/${lastEditing}`)
        navigate(`/save/${searched[0].id}?reload=false`)

      }




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

