import { app } from "./controller/app"
import { userRouter } from "./controller/userRouter"
import { postRouter } from "./controller/postRouter"

app.use('/user', userRouter)
app.use('/post', postRouter)