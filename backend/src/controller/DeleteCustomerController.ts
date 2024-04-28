import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteCustomerService } from "../service/DeleteCustomerService";

class DeleteCustomerController{
    async handle(request: FastifyRequest, reply: FastifyReply){
        const {id} = request.query as {id:string}
        await new DeleteCustomerService().execute({id})
    }
}

export {DeleteCustomerController}