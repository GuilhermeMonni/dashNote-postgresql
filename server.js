import fastify from 'fastify'
import { bancoDados } from './bancoDados.js'
import { tasks } from './tasks.js'
import dotenv from 'dotenv'
import fastifyJwt from '@fastify/jwt'
import bcrypt from 'bcrypt'

dotenv.config()

const server = fastify()
const banco = new bancoDados()
const task = new tasks()


server.register(fastifyJwt, { //add o plugin no server
    secret: process.env.JWT_SECRET
})

server.decorate('authenticate', async (request, reply) => {
    try{
        request.jwtVerify()
    } catch(err){
        reply.code(401).send({error: 'Não autorizado.'})
    }
})

//usuarios
server.post('/cadastrar', async (request, reply) => { //criar usuario
    const {username, password} = request.body

    const passHashed = await bcrypt.hash(password, 10)

    const reqBanco = await banco.createUser(username, passHashed)

    console.log(`Usuário criado com sucesso. Seja bem vindo, ${username}!`);
})

server.post('/login', async (request, reply) => { //login do user
    const {username, password} = request.body 
    const usernameLowercase = username.toLowerCase()

    const logUser = await banco.verUser(usernameLowercase) //verifica o user digitado

    const login = await banco.loginUser(usernameLowercase) //buscar infos do user digitado

    if(!logUser){
        return reply.code(401).send({ message: 'Usuário incorreto!' })
    }

    if(!password || !login.user_pass){
        return reply.code(400).send({message: 'Digite a senha.'})
    }

    const passDigited = await bcrypt.compare(password, login.user_pass) //verifica senha digitada com a criptografada

    if(!passDigited){
        return reply.code(401).send({ message: 'Usuário ou senha incorreto.' })
    }

    const token = server.jwt.sign({ id: login.user_id, username: login.user_username })

    reply.code(200).send({
        message: 'Login feito com sucesso',
        username: login.user_username,
        id: login.user_id,
        token
    }) 
})

server.post('/logout', { preHandler: [server.authenticate] }, (req, reply) => { //logout user
  reply.clearCookie('token', { path: '/' })
  reply.send({ message: 'Deslogado com sucesso' })
})


server.post('/delete', { preHandler: [server.authenticate] }, async (request, reply) => {
    //apagar usuário
    const {username, password, id} = request.body
    const login = await banco.loginUser(username)
    const passDigited = await bcrypt.compare(password, login.password) 

    if(!passDigited){
        return reply.code(401).send({ message: 'Senha incorreta!' })
    }

    banco.deleteUser(id)
})

//tarefas
server.post('/task', { preHandler: [server.authenticate] }, async (request, reply) => { //buscar tarefas do usuario
    const { username, id } = request.body
    let usernameFix = username.charAt(0). toUpperCase() + username.slice(1)

    if(!id){
        return reply.code(401).send({
            message: 'Usuário não autenticado.'
        })
    }

    const tasksArray = await task.lookTasks(id)

    if(!tasksArray){
        return reply.code(200).send({
            message: 'Nenhuma tarefa para este usuário.'
        })
    }

    return reply.code(200).send({
        message: `Seja bem-vindo, ${usernameFix}. Boa sorte em suas tarefas.`,
        tasksArray 
    })
})

server.post('/addTask', async(request, reply) => { //adicionar task
    const {idTask, id, task, taskDate, taskState} = request.body

    const userAddTask = await task.addTasks(idTask, id, task, taskDate, taskState)

   return reply.code(201).send({
        message: `Sua tarefa foi adicionada com sucesso.`
    }) 
})

//verificar se o user esta logado
server.get('/me', { preHandler: [server.authenticate] }, async (request, reply) => {
    return { userID: request.user.id}
})

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3000,
})