import fastify from 'fastify'
import { bancoDados } from './bancoDados.js'
import dotenv from 'dotenv'
import fastifyJwt from '@fastify/jwt'
import bcrypt from 'bcrypt'

dotenv.config()

const server = fastify()
const banco = new bancoDados()

server.register(fastifyJwt, { //add o plugin no server
    secret: process.env.JWT_SECRET
})

server.decorate('authenticate', async (request, reply) => {
    try{ //add a funcao authenticate para proteger rotas
        await request.jwtVerify()
    } catch(error){
        reply.code(401).send({ message: 'Token inválido ou ausente' })
    }
})

server.post('/cadastrar', async () => { //criar usuario
    const username = "cadastro teste"
    const pass = "123"
    const descr = "dev"

    const passHashed = await bcrypt.hash(pass, 10)

    const reqBanco = await banco.createUser(username, passHashed, descr)

    console.log(`Usuário criado com sucesso. Seja bem vindo, ${username}!`);
})

server.post('/login', async (request, reply) => { //login do user
    const {username, pass} = request.body
    const usernameLowercase = username.toLowerCase()

    const logUser = await banco.verUser(usernameLowercase) //verifica o user digitado

    const login = await banco.loginUser(usernameLowercase) //buscar infos do user digitado
    if(!login){
        return reply.code(401).send({ message: 'Usuário incorreto!' })
    }

    const passDigited = await bcrypt.compare(pass, login.password) //verifica senha digitada com a criptografada
    if(!passDigited){
        return reply.code(401).send({ message: 'Senha incorreta!' })
    }

    const token = server.jwt.sign({ id: login.id, username: login.username })

    reply.send({token})
})

//server.delete()

server.listen({
    host: '0.0.0.0',
    port: 3333,
})