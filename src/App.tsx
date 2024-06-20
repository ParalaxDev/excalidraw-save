import { createEffect, createSignal } from "solid-js"

function App() {

  const [status, setStatus] = createSignal("Loading excalidraw content...")
  const [content, setContent] = createSignal("")

  createEffect(async () => {

    console.log("test")
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (tab.url != "https://excalidraw.com/") {
      setStatus("Not on excalidraw.com")
      return
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

    setContent(res[0].result)
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
