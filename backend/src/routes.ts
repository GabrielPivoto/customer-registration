import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify"
import {CreateCustomerController} from './controller/CreateCustomerController'
import { ListCustomerController } from "./controller/ListCustomerController"
import { DeleteCustomerController } from "./controller/DeleteCustomerController"

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions){

    fastify.get("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new ListCustomerController().handle(request, reply)
    })

    fastify.post("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CreateCustomerController().handle(request,reply)
    })

    fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new DeleteCustomerController().handle(request, reply)
    })

}