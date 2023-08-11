import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useState } from "react"

export const useAuthorized = () => {
    let [isAuthorized, setIsAuthorized] = useState(false);
    onAuthStateChanged(auth, (user) => {
        if(user){
            setIsAuthorized(true);
        }
        else{
            setIsAuthorized(false);
        }
    })
    return {isAuthorized};
}