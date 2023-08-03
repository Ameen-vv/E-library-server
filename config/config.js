import mongoose from 'mongoose'

const connection = () => {
    mongoose.connect(process.env.DB_LINK).then(()=>{
        console.log('db connected')
    })
}

export default connection