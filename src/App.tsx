import { createEffect, createSignal, For } from "solid-js"

import { ExcalidrawSave, getAllFromLocalStorage, getExcalidrawFromSite, saveToLocalStorage } from "./utils/localstorage"

function App() {

  const [_status, setStatus] = createSignal("Loading excalidraw content...")
  const [content, setContent] = createSignal("")
  const [saves, setSaves] = createSignal<ExcalidrawSave[]>()

  createEffect(async () => {

    const {res, status} = await getExcalidrawFromSite()

    if (status == "error") setStatus(res)
    else {
      setStatus("Successfully loaded content")
      setContent(res)
    }

    const allSaves = await getAllFromLocalStorage()

    setSaves(allSaves)
  })

  return (
    <>
      <h1>Excalidraw Save</h1>
      <button onClick={() => saveToLocalStorage({name:'test', content: JSON.parse(content())})}>Save</button>
      <button onClick={() => chrome.storage.local.set({'local_saves': []})}>Reset</button>
      <ul>
      <For each={saves()}>{(save: ExcalidrawSave) => 
        <li>{save.id}</li>
      }</For></ul>
    </>
  )
}

export default App
