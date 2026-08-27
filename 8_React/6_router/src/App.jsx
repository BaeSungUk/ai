import React from 'react'
import Root from './pages/Root'
import Home from './pages/Home'
import Videos from './pages/Videos'
import NotFound from './pages/NotFound'
import VideoDetail from './pages/videoDetail'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <NotFound/>,
    children: [
      { index: true, element: <Home/> },
      { path: "videos", element: <Videos/> },
      { path: "videos/:videoId", element: <VideoDetail/> }
    ]
  },
  {
    path: "/videos",
    element: <Videos/>
  }
])


function App() {

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
