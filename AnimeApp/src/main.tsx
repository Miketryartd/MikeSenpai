import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Home from './Pages/Home.tsx';
import Main from './Pages/Main.tsx';
import Detail from './Pages/Detail.tsx'
import Register from './Pages/Register.tsx';
import { Analytics } from '@vercel/analytics/react'
import Login from './Pages/Login.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
   <Analytics/>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/Home' element={<Home/>}></Route>
        <Route path='/Main' element={<Main/>}></Route>
        <Route path='/Mike-Senpai/:anime'></Route>
        <Route path='/Detail/:id/:finder' element={<Detail/>}></Route>
       

        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>

      </Routes>
   </BrowserRouter>
  </StrictMode>,
)
