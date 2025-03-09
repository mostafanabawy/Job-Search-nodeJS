import "dotenv/config"
import express from 'express'
import { bootstrap } from "./src/app.controller.js"
const app = express()

await bootstrap(app, express)
