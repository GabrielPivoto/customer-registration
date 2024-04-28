import prismaClient from "../prisma";

interface DeleteCustomerProps{
    id: string
}

class DeleteCustomerService{
    async execute({id}: DeleteCustomerProps){

        if(!id)
            throw new Error("ID must be provided!")

        const findCustomer = await prismaClient.customer.findFirst({
            where:{
                id: id
            }
        })

        if(!findCustomer)
            throw new Error("Customer not registrated!")

        await prismaClient.customer.delete({
            where:{
                id: findCustomer.id
            }
        })

    }
}

export {DeleteCustomerService}