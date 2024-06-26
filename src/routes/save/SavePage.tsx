import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ExcalidrawSave, injectExcalidrawIntoSite, getExcalidrawFromSite, getSaveFromLocalStorage, updateSaveToLocalStorage, setEditingId } from "../../utils/localstorage";
import { Thumbnail } from "../../components/Thumbnail";
import { PreviousVersion } from "../../components/PreviousVersion";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { nanoid } from "nanoid";
import { sha256 } from "js-sha256";


export const SavePage = () => {

  const { id } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [save, setSave] = useState<ExcalidrawSave | null>(null)
  const [saveName, setSaveName] = useState('')

  useEffect(() => {
    const main = async () => {

      const res = await getSaveFromLocalStorage(id ?? '')

      if (res === null) return

      setSave(res)
      setSaveName(res!.name)
      setEditingId(res.id)

      if (searchParams.get('reload') === 'true') await injectExcalidrawIntoSite(res.content)

    }

    main()

  }, [id])

  if (save === null) return (<h1>No save with that ID found</h1>)

  return (

    <>
      <button onClick={() => {
        setEditingId('')
        navigate(-1)
      }}>Back</button>
      <input type="text" className='text-4xl mb-4 font-bold text-black' value={saveName} onChange={async (e) => {
        setSaveName(e.target.value)

        const oldSave = save
        oldSave.name = e.target.value

        setSave(oldSave)
        await updateSaveToLocalStorage(oldSave)
      }} />
      <div className="border w-full p-4 rounded-[1rem]">
      <Thumbnail saveContents={save.content}/>
      </div>
      <h2 className='text-xl my-4 font-bold text-neutral-500'>Previous Versions:</h2>

      {save.previousVersions.length > 0 ? <div className='grid grid-cols-2 gap-2'>{save.previousVersions.map((previousId: string) => (
        <PreviousVersion id={previousId}/>
      ))}</div> : <p className="w-full text-center">No previous versions found</p>}

      <button onClick={async () => {
        const oldSave = save

        const newContent = await getExcalidrawFromSite()

        const content = JSON.parse(newContent.res) as ExcalidrawElement[]

        
        oldSave.type = 'old'

        const id = nanoid()
        const previousVersions = [...oldSave.previousVersions ?? []]
        previousVersions.push(oldSave.id)

        const newSave:ExcalidrawSave = {
          id,
          type: 'current',
          name: oldSave.name,
          version: oldSave.version++,
          createdAt: oldSave.createdAt,
          updatedAt: Date.now(),
          previousVersions,
          content,
          hash: sha256(JSON.stringify(content))
        }

        await updateSaveToLocalStorage(oldSave)
        await updateSaveToLocalStorage(newSave)

        setEditingId(newSave.id)

      }}>Update Save</button>
    </>
  )  
}
