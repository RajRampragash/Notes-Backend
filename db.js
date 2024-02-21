import mongoose from "mongoose";


//const URL = "mongodb://mathewmass1509:mathew@ac-nd98hwn-shard-00-00.fqyyrjy.mongodb.net:27017,ac-nd98hwn-shard-00-01.fqyyrjy.mongodb.net:27017,ac-nd98hwn-shard-00-02.fqyyrjy.mongodb.net:27017/?ssl=true&replicaSet=atlas-yo1gvf-shard-0&authSource=admin&retryWrites=true&w=majority"

const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb://mathewmass1509:mathew@ac-nd98hwn-shard-00-00.fqyyrjy.mongodb.net:27017,ac-nd98hwn-shard-00-01.fqyyrjy.mongodb.net:27017,ac-nd98hwn-shard-00-02.fqyyrjy.mongodb.net:27017/?ssl=true&replicaSet=atlas-yo1gvf-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB connected `);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  export default connectDB;