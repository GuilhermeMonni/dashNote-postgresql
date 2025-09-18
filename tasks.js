import { sql } from './banco.js'

export class tasks{
    //tarefas dos usuarios
    async lookTasks(id){
       const table = await sql`select * from tasks where id = ${id}`

       return Array.from(table)
    }

    //criar tarefas
    async addTasks(id, idTask, addTask, state, date, username){
        const userAddTask = await sql`insert into tasks (id, id_task, task, state, date, username)
        values (${id}, ${idTask}, ${addTask}, ${state}, ${date}, ${username})`

        return userAddTask
    }

    //apagar tarefas
    async removeTask(){
        
    }
}