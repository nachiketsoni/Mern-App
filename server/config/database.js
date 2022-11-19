const mongoose = require('mongoose');

exports.connectDB = async () => {
    try{
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host} on port ${conn.connection.port}`);
    }catch(err){
        console.log( 'MOngoDB Connection Error >>>' + err);
    }
    }

