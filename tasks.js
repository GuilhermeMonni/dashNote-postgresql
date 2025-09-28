import { sql } from './banco.js'

export class tasks{
    //tarefas dos usuarios
    async lookTasks(id){
       const table = await sql`select * from task where task_userid = ${id}`

       if(table.length == ''){
        return console.log('Nenhuma tarefa disponivel.')
       }

       return Array.from(table)
    }

    //criar tarefas
    async addTasks(idTask, id, task, taskDate, taskState){
        const userAddTask = await sql`insert into task (task_id, task_userID, task_task, task_date, task_state)
        values (${idTask}, ${id}, ${task}, ${taskDate}, ${taskState})`

        return userAddTask
    }

    //apagar tarefas
    async deleteTask(idTask){
        const userDeleteTask = await sql`delete * from task where task_id = ${idTask}`

        return console.log('Tarefa excluida com sucesso.')
    }
}