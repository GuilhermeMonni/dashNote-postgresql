import { sql } from './banco.js'

export class tasks{
    //tarefas dos usuarios
    async lookTasks(id){
       const table = await sql`select * from tasks where id = ${id}`

       return Array.from(table)
    }

    //criar tarefas
    async addTasks(id, username, addTask, state, date){
        const userAddTask = await sql`insert into tasks (id, username, task, state, date)
        values (${id}, ${username}, ${addTask}, ${state}, ${date})`

        return userAddTask
    }
}