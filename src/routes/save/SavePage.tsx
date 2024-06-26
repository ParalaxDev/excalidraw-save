import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ExcalidrawSave, getExcalidrawFromSite, getSaveFromLocalStorage, updateSaveToLocalStorage } from "../../utils/localstorage";
import { Thumbnail } from "../../components/Thumbnail";
import { PreviousVersion } from "../../components/PreviousVersion";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { nanoid } from "nanoid";
import { sha256 } from "js-sha256";
export const SavePage = () => {

  const { id } = useParams();
  const [save, setSave] = useState<ExcalidrawSave | null>(null)

  useEffect(() => {
    const main = async () => {

      const res = await getSaveFromLocalStorage(id ?? '')

      setSave(res)

    }

    main()

  }, [id, save])

  if (save === null) return (<h1>No save with that ID found</h1>)

  return (

    <>
      <h1>{save?.name}</h1>
      <Thumbnail saveContents={save.content}/>
      <h2>Previous Versions:</h2>

      {save.previousVersions.length > 0 ? save.previousVersions.map((previousId: string) => (
        <PreviousVersion id={previousId}/>
      )) : <p>No previous versions found</p>}

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

      }}>Update Save</button>
    </>
  )  
}
