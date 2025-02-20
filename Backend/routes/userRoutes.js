
import { changeandcheck, saveSet } from "../controllers/userController.js";

export function userRoutes(app){

    app.post("/saveset",saveSet);
    
    app.put("/changeandcheck",changeandcheck);

}