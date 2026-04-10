import app from "./src/app.js";
import { connectToDB } from "./src/config/db.js";

connectToDB()
    .then(() => {
        app.listen(3000, () => {
            console.log(`Server is running on port 3000 🏃‍♀️`);
        })
    })
    .catch((error) => {
        console.log("Failed to connect to database 😭", error);
    })