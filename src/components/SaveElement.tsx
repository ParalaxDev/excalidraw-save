import { type ExcalidrawSave } from '../utils/localstorage'
import { formatDistance } from 'date-fns'
import { Link } from "react-router-dom";
import { Thumbnail } from './Thumbnail';
import { DeleteButton } from './DeleteButton';

export const SaveElement = ({save} :{save: ExcalidrawSave}) => {

  return (
    <div className="w-full border p-4 rounded-[1rem] flex justify-between flex-col">
      <div>
        <div className="flex justify-between items-center w-fill">
          <div>
            <h1 className='text-xl font-bold'>{save.name}</h1>
            <p className="text-xs text-neutral-600">Last updated {formatDistance(new Date(save.updatedAt), new Date())}</p>
          </div>
          <div>
            <DeleteButton id={save.id}/>
          </div>
        </div>

        <Thumbnail saveContents={save.content}/>
      </div>
      <div>
        <Link to={`/save/${save.id}?reload=true`} className='w-full bg-black text-white h-8 rounded-[.5rem] flex justify-center items-center hover:cursor-pointer hover:bg-neutral-700 transition-all mt-1'>
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
