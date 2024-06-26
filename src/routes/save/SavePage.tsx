import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ExcalidrawSave, injectExcalidrawIntoSite, getExcalidrawFromSite, getSaveFromLocalStorage, updateSaveToLocalStorage, setEditingId } from "../../utils/localstorage";
import { Thumbnail } from "../../components/Thumbnail";
import { PreviousVersion } from "../../components/PreviousVersion";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { nanoid } from "nanoid";
import { sha256 } from "js-sha256";
import { DeleteButton } from "../../components/DeleteButton";


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

  if (save === null) {
    setEditingId('')
    navigate('/')
    return
  }

  return (

    <>
      <div className="flex justify-between mb-4">
        <div>
        <a className="w-fit inline-block hover:cursor-pointer" onClick={() => {
          setEditingId('')
          navigate(`/?redirect=false`)
        }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </a>
        <input type="text" className='w-fit ml-4 text-4xl font-bold text-black' value={saveName} onChange={async (e) => {
          setSaveName(e.target.value)

          const oldSave = save
          oldSave.name = e.target.value

          setSave(oldSave)
          await updateSaveToLocalStorage(oldSave)
        }} />
        </div>
        <DeleteButton id={save.id}/>
      </div>
      <div className="border w-full p-4 rounded-[1rem]">
        <Thumbnail saveContents={save.content}/>
      </div> 
      <a className='flex w-full bg-black text-white h-8 rounded-[.5rem] justify-center items-center hover:cursor-pointer hover:bg-neutral-700 transition-all my-1' onClick={async () => {
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

      }}>
        <div className="flex justify-center items-center h-8"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
</svg><span className='pl-1 font-semibold text-sm'>
Update Save</span></div></a>
      <h2 className='text-xl my-4 font-bold text-neutral-500'>Previous Versions:</h2>

      {save.previousVersions.length > 0 ? <div className='grid grid-cols-2 gap-2'>{save.previousVersions.map((previousId: string) => (
        <PreviousVersion id={previousId}/>
      ))}</div> : <p className="w-full text-center">No previous versions found</p>}
    </>
  )  
}
