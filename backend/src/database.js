import mongoose from 'mongoose'

async function connection() {
    try {
        const { connection } = await mongoose.connect(process.env.MONGODB_URI_LOCAL)
        console.log(`Database is connected on ${connection.host}-${connection.port}`)
    } catch (error) {
        console.log(error)
    }
}
export default connection
