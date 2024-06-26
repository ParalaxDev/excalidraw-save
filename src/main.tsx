import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Root } from './routes/root.tsx'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RootLayout } from './routes/RouteLayout.tsx'
import { SavePage } from './routes/save/SavePage.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<RootLayout/>}>
          <Route index element={<Root />}/>
          <Route path="/save/:id" element={<SavePage />}/>
        </Route>
      </Routes>
    </MemoryRouter>
  </React.StrictMode>,
)
