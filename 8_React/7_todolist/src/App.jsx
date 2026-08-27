import { useState } from "react"
import Herder from "./components/header/Header"
import "./App.css"
import TodoList from "./components/todolist/Todolist"
import { DarkModeProvider } from "./context/DarkmodeContext.jsx"

const filters = ['all', 'active', 'completed']


function App() {
  const [filter, serFilter] = useState(filters[0])
  return (
    <DarkModeProvider>
      <Herder filters={filters} filter={filter} onFilterChange={serFilter}/>
      <TodoList filter={filter}/>
    </DarkModeProvider>
  )
}

export default App
