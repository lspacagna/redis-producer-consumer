import { createClient } from 'redis';

async function createRedisClient(){
    // Connect
    const client = createClient({
        url: 'redis://localhost:12000'
    })

    // Create error listener
    client.on('error', err => console.error('Redis Client Error', err))

    await client.connect()
    return client    
}

async function createList(client){
    // Check client is ready, if not end process. 
    if (!client.isReady){
        console.error('Redis client not ready')
        process.exit()
    }

    console.log('Creating 100 items in list...')
    for (let step = 0; step < 100; step++) {
        await client.lPush('step2', (step + 1).toString())
    }
}

async function readList(client){
    const list = []

    console.log('Reading 100 items in list...')
    for (let step = 0; step < 100; step++) {
        list.push(await client.lPop('step2'))
    }

    console.log(list)
}

async function main(){
    const client = await createRedisClient()
    // await createList(client)
    await readList(client)

    console.log('Closing connection.')
    await client.quit();
}

main()

