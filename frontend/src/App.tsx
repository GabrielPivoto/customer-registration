import {FiTrash} from 'react-icons/fi'
import { api } from './services/api'
import {useEffect, useState, useRef, FormEvent} from 'react'
import mqtt from 'mqtt'

interface CustomerProps{
  id: string,
  name: string,
  email:string
  status:boolean,
  created_at:string
}

export default function App(){

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])
  
  async function loadCustomers(){
    const response = await api.get("/customer")
    setCustomers(response.data)
  }

  async function handleSubmit(event:FormEvent){
    event.preventDefault()
    if(!nameRef.current?.value || !emailRef.current?.value) return
    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    })
    setCustomers(allCustomers => [...allCustomers, response.data])
    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleMqttSubmit(event:FormEvent){
    event.preventDefault()

    const client = mqtt.connect('mqtt://localhost:1883')

    // client.on('connect', () => {
    //   console.log('Connected to MQTT broker')
    // })

    // client.on('error', (err) => {
    //   console.error('MQTT connection error:', err)
    // })

    // client.subscribe('customers');

    if (!nameRef.current?.value || !emailRef.current?.value) return

    const customerData = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    }

    // Publish to MQTT broker
    client.publish('customers', "teste", (err) => {
      if (err) {
        console.error('Failed to publish message:', err)
      } else {
        console.log('Message published successfully')
      }
    })

    // Simulate the response from MQTT by adding the customer locally
    const newCustomer = { id: Date.now().toString(), ...customerData, status: true, created_at: new Date().toISOString() }
    setCustomers(allCustomers => [...allCustomers, newCustomer])
    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleDelete(id: string){
    try{
      await api.delete("/customer", {
        params:{
          id:id
        }
      })
      const allCustomer = customers.filter((customer) => customer.id !== id)
      setCustomers(allCustomer)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl ">
        <h1 className="text-4xl font-medium text-white">Customers</h1>
        <form className="flex flex-col my-6" onSubmit={handleMqttSubmit}>

          <label className="font-medium text-white">Name:</label>
          <input 
            type="text"
            placeholder="Type your name..." 
            className="w-full mb-5 p-2 rounded"
            ref={nameRef}
          />

          <label className="font-medium text-white">E-mail:</label>
          <input 
            type="e-mail"
            placeholder="Type your e-mail..." 
            className="w-full mb-5 p-2 rounded"
            ref={emailRef}
          />


          <input 
            type="submit"
            value="Send"
            className="cursor-pointer w-full p-2 bg-green-500 rounded font-medium" 
          />

        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            <article
                key={customer.id}
                className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200"
              >
              <p><span className="font-medium">Name:</span> {customer.name}</p>
              <p><span className="font-medium">E-mail:</span> {customer.email}</p>
              <p><span className="font-medium">Status:</span> {customer.status ? "ACTIVE":"INACTIVE"}</p>

              <button className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2"
              onClick={() => handleDelete(customer.id)}>
                <FiTrash size={18} color="#FFF"/>
              </button>
            </article>
          ))}
        </section>
        
      </main>
    </div>
  )
}