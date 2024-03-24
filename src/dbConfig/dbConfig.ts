import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!)

    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log("DB Connection established")
    })

    connection.on('error', (err) => {
      console.log("Oops! Couldn't connect to DB, something went wrong")
      console.error(err)

      process.exit()
    })
  } catch (ex) {
    console.log("Oops! Something went wrong while connecting to the database")
    console.error(ex)
  }
}