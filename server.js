const express = require("express")
const io = require("socket.io")(3000, {
    cors: {
        origin: "*"
    }
})

const users = new Map()

function updateUserList(room) {
    const roomUsers = [...users.values()]
    .filter(users => users.room === room)
    .map(usernames => usernames.username)
    io.to(room).emit("userList", roomUsers)
}

io.on("connection", socket => {
    socket.on("joinRoom", (username, room)=>{
        socket.room = room
        socket.username = username
        socket.join(socket.room)

        users.set(socket.id, {username, room})
        updateUserList(room)
    })
    socket.on("sendMessage", (message)=>{
        socket.message = message
        socket.to(socket.room).emit("message",{
            username: socket.username,
            message: message,
        })
    })
    socket.on("disconnect", ()=>{
        const user = users.get(socket.id)
        if(user) {
            users.delete(socket.id)
            updateUserList(socket.room)
        }
    })
})

const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.set("view engine","ejs")

app.get("/", (req, res)=>{
    res.render("index")
})

app.get("/chat",(req,res)=>{
    res.render("chat")
})

app.listen(80)