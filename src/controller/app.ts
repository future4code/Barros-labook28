import express from 'express'
import cors from 'cors'

export const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})