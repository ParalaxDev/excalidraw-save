import { nanoid } from "nanoid"
import { sha256 } from "js-sha256"
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

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
  previousVersions: string[]
  createdAt: number,
  updatedAt: number,
  content: ExcalidrawElement[]
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

export const injectExcalidrawIntoSite = async (_content: ExcalidrawElement[], _tabId = -1) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];

  if (tab.url != "https://excalidraw.com/") {
    return {
      res: "not on https://excalidraw.com/",
      status: 'error'
    }
  }

  const json = JSON.stringify(_content)


  const res = await chrome.scripting.executeScript({
    target: {
      tabId: tab.id ?? 0
    },
    args: [json],

    func: (items) => {

      localStorage['excalidraw'] = items
      return localStorage['excalidraw']
      // try {
      //   localStorage.setItem('excalidraw', JSON.stringify(content))
      // } catch {
      //   console.error('error when injecting')
      // }
    } 
  })

  chrome.tabs.reload(tab.id ?? 0)

  return {
    res: res[0].result,
    status: 'success'
  }

}

export const getCurrentTabUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  
  return tabs[0].url
}

export const saveToLocalStorage = async ({name, content}: {name: string, content: ExcalidrawElement[]}): Promise<ReturnType> => {
  const id = nanoid()

  const oldSaves = await chrome.storage.local.get('local_saves')
  

  const saveObject: ExcalidrawSave = {
    id,
    type: 'current',
    name,
    hash: sha256(JSON.stringify(content)),
    previousVersions: [],
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

export const updateSaveToLocalStorage = async (save: ExcalidrawSave) => {

  const oldSaves = await chrome.storage.local.get('local_saves')

  const filtered = oldSaves.local_saves.filter((oldsave:ExcalidrawSave) => oldsave.id != save.id)
  console.log(filtered)
  filtered.push(save)

  await chrome.storage.local.set({'local_saves': filtered})


  console.log('saving', save)

  
}

export const getAllFromLocalStorage = async () => {

  const oldSaves = await chrome.storage.local.get('local_saves')

  return oldSaves.local_saves
}

type LocalStorageReturn = {
  local_saves: ExcalidrawSave[]
}

export const getSaveFromLocalStorage = async (id: string): Promise<ExcalidrawSave | null> => {

  const saves = await chrome.storage.local.get('local_saves') as LocalStorageReturn
  const selected = saves.local_saves.filter((save: ExcalidrawSave) =>  save.id == id)

  if (selected.length <= 0) return null

  return selected[0]
}


export const setEditingId = async (id: string) => {
  chrome.storage.local.set({'editing': id})
}

export const getEditingId = async () => {
  const res = await chrome.storage.local.get('editing')
  return res.editing
}
