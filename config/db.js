const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        console.log(`Database Connection Successfull`);
    } catch (err) {
        console.log(`Connection Failed with error : ${err}`)
        process.exit(1) //Process Exited With Failed Status Code
    }
}

module.exports = connectDB