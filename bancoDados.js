import { sql } from "./banco.js";
import { randomUUID } from "node:crypto";

export class bancoDados {
  async createUser(username, passHashed, descr) { //PROXIMA ATT: nao permitir user com espaco
    //criação do usuario
    const id = randomUUID(); //id
    const usernameLowercase = username.toLowerCase()

    await sql`insert into users (id, username, password, description) VALUES (${id}, ${usernameLowercase}, ${passHashed}, ${descr})`
  }

  async verUser(username){ //verificar se existe o user
    const verUser = await sql`select username from users WHERE username = ${username}`

    if(verUser){
        console.log("Usuário encontrado.")
        return username
    }else{
        return console.error("Usuário não encontrado!")
    } 
  }

  async loginUser(username){
    const result = await sql`select * from users where username = ${username}`

    return result[0]
  }

  async deleteUser(id) { //deletar usuario
    const delUser = await sql`delete from users where id = ${id}`

    console.log('Usuário deletado com sucesso!');
  }
}
