const { Client } = require('pg');
const dotenv =require("dotenv");
dotenv.config();

const connectionString=process.env.CONNECTION_STRING;

const client = new Client({
        connectionString: connectionString,
        ssl: {
          rejectUnauthorized: false,
        }
      });

const Connection=() => {
  client.connect()
  .then(() => console.log('Connected to Neon PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));
}

module.exports={
   Connection,
   client,
}
