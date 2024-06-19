document.addEventListener('DOMContentLoaded', async () => {
    console.log("loaded script...")

    try {

        // Get the current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0]; 
        console.log(tab)

        if (tab.url != "https://excalidraw.com/") {

            const status = document.getElementById("excalidraw-status")
            status.textContent = "Not on excalidraw.com"
            return

        }

        const res = await chrome.scripting.executeScript(
            { target: {
                tabId: tab.id
            },

                func: () => {
                    return localStorage['excalidraw']
                } 
            }, 
        )

        const status = document.getElementById("excalidraw-status")
        status.textContent = "Found excalidraw content:"

        const tag = document.getElementById("excalidraw-tag")
        tag.textContent = JSON.stringify(JSON.parse(res[0].result), null, 4)


        console.log(res[0].result)

    } 
    catch(err) {
        console.error(err)
    }
});
