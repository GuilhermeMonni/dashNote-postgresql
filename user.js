import { sql } from "./banco.js";
import { randomUUID } from "node:crypto";

export class bancoDados {
  async createUser(username, passHashed) { 
    //criação do usuario
    const id = randomUUID(); //id
    const usernameLowercase = username.toLowerCase()

    await sql`insert into user_table (user_id, user_username, user_pass) VALUES (${id}, ${usernameLowercase}, ${passHashed})`
  }

  async verUser(username){ //verificar se existe o user
    const verUser = await sql`select user_username from user_table WHERE user_username = ${username}`

    if(verUser){
        console.log("Usuário encontrado.")
        return username
    }else{
        return console.error("Usuário não encontrado!")
    } 
  }

  async loginUser(username){
    const result = await sql`select * from user_table where user_username = ${username}`

    return result[0]
  }

  async deleteUser(id) { //deletar usuario
    const delUser = await sql`delete from user_table where user_id = ${id}`

    console.log('Usuário deletado com sucesso!');
  }
}
