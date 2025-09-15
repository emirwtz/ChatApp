import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const socket = io("http://localhost:3000")

const users = document.getElementById("users")
const params = new URLSearchParams(window.location.search)
const messages = document.getElementById("messages")
const input = document.getElementById("input")

socket.on("userList", (array)=>{
    users.innerText = ""
    array.forEach(i => {
        const div = document.createElement("div")
        div.classList = "user"
        div.innerText = i
        users.appendChild(div)
    })
})

document.getElementById("roomName").innerHTML = params.get("room")
socket.emit("joinRoom", params.get("username"), params.get("room"))

messages.scrollTop = messages.scrollHeight

document.body.onload = ()=>{
    input.focus()
}

function addText(username, text, position){
    const div = document.createElement("div")
    div.classList = `row ${position}`
    const p = document.createElement("p")
    const span = document.createElement("span")
    if (username == "") {
        span.innerText = text
    } else {
        span.innerText = `${username}: ${text}`
    }
    messages.appendChild(div)
    div.appendChild(p)
    p.appendChild(span)
}

input.addEventListener("keydown", function(event){
    if (event.key == "Enter") {
        socket.emit("sendMessage", input.value)
        addText("",input.value, "right")
        input.value = ""
    }
})

socket.on("message", (data)=>{
    addText(data.username, data.message, "left")
})
