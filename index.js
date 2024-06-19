document.addEventListener('DOMContentLoaded', async () => {
    console.log("loaded script...")

    try {

        // Get the current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0]; 
        console.log(tab)

        if (tab.url != "https://excalidraw.com/") return

        chrome.scripting.executeScript(
            { target: {
                tabId: tab.id
            },

                func: () => {
                    return localStorage['excalidraw']
                } 
            }, 
            (res) => console.log(res[0].result),
        )

    } 
    catch(err) {
        console.error(err)
    }
});
