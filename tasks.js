import { sql } from './banco.js'

export class tasks{
    //buscar user do user
    async searchId(username){

    }

    //tarefas dos usuarios
    async lookTasks(username){
       const table = await sql`select * from tasks where username = ${username}`

       return Array.from(table)
    }

    //criar tarefas
    async addTasks(idTask, addTask, state, date, username){
        const userAddTask = await sql`insert into tasks (id_task, task, state, date, username)
        values (${idTask}, ${addTask}, ${state}, ${date}, ${username})`

        return userAddTask
    }

    //apagar tarefas
    async removeTask(){
        
    }
}