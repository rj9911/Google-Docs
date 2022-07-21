import mongoose from "mongoose";

const Connection = async (URL) => {
    
    try{
       await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true});
       console.log('DataBase Connected Successfully');
    } catch(error) {
        console.log('Error while connecting with the database', error);
    }

}

export default Connection;