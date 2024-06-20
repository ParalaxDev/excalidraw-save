import { createEffect, createSignal } from "solid-js"

import { getExcalidrawFromLocalStorage } from "./utils/localstorage"

function App() {

  const [status, setStatus] = createSignal("Loading excalidraw content...")
  const [content, setContent] = createSignal("")

  createEffect(async () => {

    const {res, status} = await getExcalidrawFromLocalStorage()

    if (status == "error") setStatus(res)
    else {
      setStatus("Successfully loaded content")
      setContent(res)
    }
  })

  return (
    <>
      <h1>Excalidraw Save</h1>
      <p>{status()}</p>
      <code>{content()}</code>
    </>
  )
}

export default App
