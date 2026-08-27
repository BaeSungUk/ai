import React, { useState } from "react"
import Products from "./components/ProductHook"
// import Products from "./components/Products"

import './App.css'

function App() {

  const [showProducts, setShowProducts] = useState(true)

  return (
    <>
      <div>
        { showProducts && <Products /> }
        <button onClick={() => setShowProducts((show) => !show)}>
          제품보기
        </button>
      </div>
    </>
  )
}

export default App
