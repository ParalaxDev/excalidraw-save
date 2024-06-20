type ExcalidrawReturnType = {
  res: string,
  status: 'success' | 'error'
}


export type ExcalidrawSave = {
  id: string,
  name: string,
  hash: string,
  version: number,
  previousVersions?: ExcalidrawSave[]
  createdAt: number,
  updatedAt: number,
  content: string
}

export const getExcalidrawFromLocalStorage = async (): Promise<ExcalidrawReturnType> => {

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
