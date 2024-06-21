import { nanoid } from "nanoid"
import { sha256 } from "js-sha256"

type ReturnType = {
  res: string,
  status: 'success' | 'error'
}


export type ExcalidrawSave = {
  id: string,
  type: 'old' | 'current',
  name: string,
  hash: string,
  version: number,
  previousVersions?: string[]
  createdAt: number,
  updatedAt: number,
  content: Record<string, any>
}

export const getExcalidrawFromSite = async (): Promise<ReturnType> => {

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (tab.url != "https://excalidraw.com/") {
    return {
      res: "not on https://excalidraw.com/",
      status: 'error'
    }
  }

  const res = await chrome.scripting.executeScript(
    { target: {
      tabId: tab.id ?? 0
    },

      func: () => {
        return localStorage['excalidraw']
      } 
    }, 
  )

  return {
    res: res[0].result,
    status: 'success'
  }

}


export const saveToLocalStorage = async ({name, content}: {name: string, content: Record<string, any>}): Promise<ReturnType> => {
  const id = nanoid()

  const oldSaves = await chrome.storage.local.get('local_saves')
  

  const saveObject: ExcalidrawSave = {
    id,
    type: 'current',
    name,
    hash: sha256(JSON.stringify(content)),
    version: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content
  }

  oldSaves.local_saves.push(saveObject)

  await chrome.storage.local.set({'local_saves': oldSaves.local_saves})

  return {
    res: '',
    status: 'success'
  }

}

export const getAllFromLocalStorage = async () => {

  const oldSaves = await chrome.storage.local.get('local_saves')

  return oldSaves.local_saves
}
