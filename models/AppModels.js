import mysql from 'mysql2/promise'

const connection = mysql.createPool('mysql://root:FQMLqoSQqPxNJAXlsPzHhhHpnXmoRDXb@crossover.proxy.rlwy.net:35992/railway')

export class AppModels {
  static login = async ({ username, password }) => {
    if(!username || !password || password === '' || username === '') {
      return null
    }

    try {
      const [ tryLogin ] = await connection.query(`
        select 
          bin_to_uuid(user_id) id, name, username, password, email 
        from users 
          where username = ? and password = ?;
      `, [ username, password ])

      if(tryLogin.length === 0) return null
      return tryLogin
    } catch (e) {
      throw new Error('Server error')
    }
  }

  static register = async ({ name, email, username, password, age }) => {
    if(!name || !email || !username || !password || !age) return null

    try {
      const [verifyUser] = await connection.query(`select * from users where username = ?`,[username])
      if(verifyUser.length > 0) return { data: null, message: 'Username already exists' }

      const [verifyEmail] = await connection.query(`select * from users where email = ?`,[email])
      if(verifyEmail.length > 0) return { data: null, message: 'Email already exists' }

      if(verifyEmail.length === 0 && verifyUser.length === 0) {
        const [insertUser] = await connection.query(`
          insert into users (name, username, password, email, age) 
          values (?, ?, ?, ?, ?);
        `, [name, username, password, email, age])

        if(insertUser.affectedRows === 1) return { data: true, message: 'Registered succesfully' }
        return null
      }
    } catch (e) {
      throw new Error('Server error')
    }
  }

  static getTasks = async ({ username }) => {
    try {
      const [tasks] = await connection.query(`
        select * from tasks where user_task = ? order by limit_date asc;
      `, [username])

      if(tasks.length === 0) return null
      return tasks
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  static deleteTasks = async ({ id }) => {
    if(!id) return null

    try {
      const [dropped] = await connection.query(`
        delete from tasks where task_id = ?
      `, [id])

      if(dropped.affectedRows === 0) return null
      return true
    } catch (e) {
      throw new Error('Database Error')
    }
  }

  static checkTask = async ({ id }) => {
    if(!id) return null

    try {
      const [checked] = await connection.query(`
        update tasks
        set state = 'Completed'
        where task_id = ?
      `, [id])

      if(checked.affectedRows === 0) return null
      return true
    } catch (e) {
      throw new Error('Database Error')
    }
  }

   static uncheckTask = async ({ id }) => {
    if(!id) return null

    try {
      const [unchecked] = await connection.query(`
        update tasks
        set state = 'Incompleted'
        where task_id = ?
      `, [id])

      if(unchecked.affectedRows === 0) return null
      return true
    } catch (e) {
      throw new Error('Database Error')
    }
  }

  static addTask = async ({ text, date, username }) => {
    try {
      const [added] = await connection.query(`
        insert into tasks (text, user_task, state, limit_date)
        values (?, ?, 'Incompleted', ?)
      `, [text, username, date])

      if(added.affectedRows === 0) return null
      return true
    } catch (e) {
      throw new Error('Server Error')
    }
  }
}