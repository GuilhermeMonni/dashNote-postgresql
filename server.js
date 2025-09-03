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
    const {username, password, description} = request.body

    const passHashed = await bcrypt.hash(password, 10)

    const reqBanco = await banco.createUser(username, passHashed, description)

    console.log(`Usuário criado com sucesso. Seja bem vindo, ${username}!`);
})

server.post('/login', async (request, reply) => { //login do user
    const {username, password} = request.body 
    const usernameLowercase = username.toLowerCase()

    const logUser = await banco.verUser(usernameLowercase) //verifica o user digitado

    const login = await banco.loginUser(usernameLowercase) //buscar infos do user digitado

    if(!login){
        return reply.code(401).send({ message: 'Usuário incorreto!' })
    }

    if(!password || !login.password){
        return reply.code(400).send({message: 'Senha ausente.'})
    }

    const passDigited = await bcrypt.compare(password, login.password) //verifica senha digitada com a criptografada

    if(!passDigited){
        return reply.code(401).send({ message: 'Senha incorreta!' })
    }

    const token = server.jwt.sign({ id: login.id, username: login.username })

    reply.send({
        message: 'Login feito com sucesso',
        username: login.username,
        id: login.id,
        token
    }) 
})

server.post('/logout', { preHandler: [server.authenticate] }, (req, reply) => {
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
    const {username, id} = request.body
    let usernameFix = username.charAt(0). toUpperCase() + username.slice(1)

    const tasksArray = await task.lookTasks(id)

    return reply.code(200).send({
        message: `Seja bem-vindo, ${usernameFix}. Boa sorte em suas tarefas.`,
        tasksArray 
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