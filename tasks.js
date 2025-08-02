import { sql } from './banco.js'

export class tasks{
    //tarefas dos usuarios
    async lookTasks(id){
       const tasks = await sql`select * from tasks where id = ${id}`

       return console.log(table)
    }
}