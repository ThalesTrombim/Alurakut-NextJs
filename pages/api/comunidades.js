import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response){
    
    if(request.method === 'POST') {
        const TOKEN = 'be5874a18ccdb8e180cd76f7c2fe3a';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "1204949", 
            ...request.body,
        })
    
        console.log(registroCriado);

        response.json({
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}