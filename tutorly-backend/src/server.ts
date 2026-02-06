import app from './app'
import config from './config/env'

const PORT = config.port || 8000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
