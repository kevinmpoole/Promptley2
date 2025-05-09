// server.js
const express = require("express")
const fs = require("fs")
const path = require("path")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())

const BASE_PATH = "/Users/kevinpoole/Documents/Python Scripts/Promptley2/universes"

// Save shotlists
app.post("/api/universe/:universe/shotlists", (req, res) => {
  const universe = req.params.universe
  const shotlists = req.body
  const filePath = path.join(BASE_PATH, universe, "shotlists", "shotlists.json")

  fs.writeFile(filePath, JSON.stringify(shotlists, null, 2), err => {
    if (err) return res.status(500).send("Error saving shotlists")
    res.send("Shotlists saved")
  })
})

// Load shotlists
app.get("/api/universe/:universe/shotlists", (req, res) => {
  const universe = req.params.universe
  const filePath = path.join(BASE_PATH, universe, "shotlists", "shotlists.json")

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error loading shotlists")
    res.json(JSON.parse(data))
  })
})

app.listen(8000, () => console.log("API server running on http://localhost:8000"))
