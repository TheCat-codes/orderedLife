import { AppModels } from '../models/AppModels.js'
import { validateLogin } from '../validations/validationsLogin.js'

export class AppControllers {
  static login = async (req, res) => {
    const { username, password } = req.body
    const result = validateLogin(req.body)

    if(result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message)[0].message })
    }

    try {
      const tryLogin = await AppModels.login({ username, password })
      if(!tryLogin) return res.status(404).json({ message: 'Invalid credentials' })
      res.status(200).json({ message: 'Logged in', user: tryLogin })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

  static register = async (req, res) => {
    const { name, password, username, confirmPassword, age, email } = req.body
    if(password !== confirmPassword) return res.status(400).json({ message: 'Passwords doesnt match' })

    try {
      const registered = await AppModels.register({ name, password, username, email, age })
      if(!registered) return res.status(400).json({ message: 'Try Later' })
      if(registered.data === null) return res.status(400).json({ message: registered.message })
      return res.status(201).json({ messsage: registered.message })
    } catch (e) {
      return res.status(500).json({ message: e.message})
    }
  }

  static getTasks = async (req, res) => {
    const { username } = req.params
    if(!username) return res.status(400).json({ message: 'no data provided' })
    try {
      const tasks = await AppModels.getTasks({ username })
      if(!tasks) return res.status(404).json({ message: 'There arent tasks yet'})
      res.status(200).json({ tasks })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

  static deleteTask = async (req, res) => {
    const { id } = req.params
    if(!id) return res.status(400).json({ message: 'no data provided' })

    try {
      const dropped = await AppModels.deleteTasks({ id })
      if(!dropped) return res.status(400).json({ message: 'An error happened, try later' })
      res.status(200).json({ message: 'Deleted' })
    } catch (e) {
      return res.status(400).json({ message : e.message })
    }
  }

  static checkTask = async (req, res) => {
    const { id } = req.params
    if(!id) return res.status(400).json({ message: 'no data provided' })

    try {
      const checked = await AppModels.checkTask({ id })
      if(!checked) return res.status(400).json({ message: 'An error happened, try later' })
      res.status(200).json({ message: 'Checked' })
    } catch (e) {
      return res.status(400).json({ message : e.message })
    }
  }

  static uncheckTask = async (req, res) => {
    const { id } = req.params
    if(!id) return res.status(400).json({ message: 'no data provided' })

    try {
      const unchecked = await AppModels.uncheckTask({ id })
      if(!unchecked) return res.status(400).json({ message: 'An error happened, try later' })
      res.status(200).json({ message: 'Unchecked' })
    } catch (e) {
      return res.status(400).json({ message : e.message })
    }
  }

  static addTask = async (req, res) => {
    const { text, date, username } = req.body

    if(!text || !date || !username) return res.status(400).json({ message: 'enter the data'})

    try {
      const added = await AppModels.addTask({text, date, username})
      if(!added) return res.status(400).json({ message: 'An error happened, try later'})
      return res.status(200).json({ message: 'Task added' })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}