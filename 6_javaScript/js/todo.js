const todoInput = document.getElementById("todoInput")
const addBtn = document.getElementById("addBtn")
const todoList = document.getElementById("todoList")
const remainingCount = document.getElementById("remainingCount")
const totalCount = document.getElementById("totalCount")

// 상태를 메모리에만 저장(새로고침하면 사라짐)
const todos = []

function render() {
    todoList.innerHTML = ""
    // [{text: "아침식사", done=false}, {text: "운동하기", done=false}, ...]
    todos.forEach((todo, index) => {
        const li = document.createElement("li") // <li></li>
        if (todo.done) li.classList.add("done") // <li class=done></li> 
        // div 클래스 left 생성
        const left = document.createElement("div") // <div></div>
        left.className = "left" // <div class="left"></div>
        // 체크박스 생성
        const checkbox = document.createElement("input") // <input></input>
        checkbox.type = "checkbox" // <input type="checkbox"></input>
        checkbox.checked = todo.done // <input type="checkbox" checked="false"></input>
        checkbox.addEventListener("change", () => {
            todo.done = checkbox.checked
            render()
        })
        // 삭제버튼 생성
        const delBtn = document.createElement("button")
        delBtn.type = "button"
        delBtn.className = "delete-btn"
        delBtn.textContent = "삭제"
        delBtn.addEventListener("click", () => {
            todos.splice(index, 1)
            render()
        })

        // 스판 태그 생성
        const text = document.createElement("span") // <span></span>
        text.className = "todo-text" // <span class="todo-text"></span>
        text.textContent = todo.text // <span class="todo-text">아침식사</span>

        left.appendChild(checkbox)
        left.appendChild(text)
        left.appendChild(delBtn)

        li.appendChild(left)
        todoList.appendChild(li)
    })

    updateCounts() 
}

function updateCounts(){
    const total = todos.length
    const remaining = todos.filter((t) => !t.done).length

    remainingCount.textContent = String(remaining)
    totalCount.textContent = String(total)
}

function addTodo() {
    const text = todoInput.value.trim()
    if(!text) return
    // 변수명이랑 키랑 이름이 같으면 키로 들어감
    // ex) text: text 이면  text만 써도 가능
    todos.push({ text, done: false})
    todoInput.value = ""
    todoInput.focus()
    // 화면 그리기
    render()
}

addBtn.addEventListener("click", addTodo)
todoInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") addTodo()
})


render()