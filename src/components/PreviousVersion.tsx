
import { type ExcalidrawSave } from '../utils/localstorage'
import { formatDistance } from 'date-fns'
import { Link } from "react-router-dom";
import { Thumbnail } from './Thumbnail';
import { useState, useEffect } from 'react';
import { getSaveFromLocalStorage } from '../utils/localstorage';

export const PreviousVersion = ({id} :{id: string | undefined}) => {

  const [save, setSave] = useState<ExcalidrawSave | null>(null)

  useEffect(() => {
    const main = async () => {

      const res = await getSaveFromLocalStorage(id ?? '')

      setSave(res)
      
    }

    main()

  }, [id])


  if (save === null) return (<h1>No save with that ID found</h1>)

  return (
    <div className="w-full border p-4 rounded-[1rem] flex justify-between flex-col">
      <div>
        <div className="flex justify-between items-center w-fill">
          <div>
            <h1 className='text-xl font-bold'>{save.name}</h1>
            <p className="text-xs text-neutral-600 mb-1">Last updated {formatDistance(new Date(save.updatedAt), new Date())}</p>
          </div>
          <div>
            <a className="text-neutral-400 hover:text-red-500 transition-all hover:cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <Thumbnail saveContents={save.content}/>
      </div>
      <div>
        <Link to={`/save/${save.id}`} className='flex w-full bg-black text-white h-8 rounded-[.5rem] flex justify-center items-center hover:cursor-pointer hover:bg-neutral-700 transition-all mt-1'>
          <div className="flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M14.78 14.78a.75.75 0 0 1-1.06 0L6.5 7.56v5.69a.75.75 0 0 1-1.5 0v-7.5A.75.75 0 0 1 5.75 5h7.5a.75.75 0 0 1 0 1.5H7.56l7.22 7.22a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
            </svg>
            <span className='pl-1 font-semibold text-sm'>Open</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
