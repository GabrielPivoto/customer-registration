import { ListCustomerService } from "../service/ListCustomerService"
import {FastifyRequest, FastifyReply} from 'fastify'

class ListCustomerController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const customers = await new ListCustomerService().execute()
        reply.send(customers)
    }
}

export {ListCustomerController}