import { sql } from './banco.js'

export class tasks{
    //tarefas dos usuarios
    async lookTasks(id){
       const table = await sql`select * from task where task_userid = ${id}`

       return Array.from(table)
    }

    //criar tarefas
    async addTasks(task_id, task_userid, task_task, task_date, task_state){
        const userAddTask = await sql`insert into task (task_id, task_userid, task_task, task_date, task_state)
        values (${task_id}, ${task_userid}, ${task_task}, ${task_date}, ${task_state})` //add task

       const table = await sql`select * from task where task_userid = ${task_userid}` //lookTask

        return Array.from(table)
    }

    //apagar tarefas
    async deleteTask(task_id){
        const userDeleteTask = await sql`delete from task where task_id = ${task_id}`

        return console.log('Tarefa excluida com sucesso.')
    }

    //editar task
    async editTask(task_id, task_task){
        const userEditTask = await sql`update task set task_task = ${task_task} where task_id = ${task_id}`

        console.log('Tarefa atualizada com sucesso.')

        return userEditTask.task_task
    }
}