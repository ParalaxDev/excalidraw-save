import { ExcalidrawSave } from './localstorage'


export const searchForValueInSave = <K extends keyof ExcalidrawSave>(data: ExcalidrawSave[], key: K, search: ExcalidrawSave[K]) => {

  return data.filter((val: ExcalidrawSave) => val[key] == search)

}


