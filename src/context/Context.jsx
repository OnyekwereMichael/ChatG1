import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useState } from "react";
import { auth, db } from "../config/Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [UserData, setUserData] = useState(null)
    const [chatData, setchatData] = useState(null)
    const navigate = useNavigate()

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid)
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data()
            setUserData(userData)

            if (userData.name && userData.avatar) {
                navigate('/chat')
            } else {
                navigate('/profile')
            }

            if (auth.chatUser) {
                await updateDoc(userRef, {
                    lastSeen: Date.now(),
                });
            }

            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);


        } catch (error) {
            console.log(error);
            toast.error(error.code)
        }
    }
    

    // chatData ref 
  useEffect(() => {
   if(UserData) {
      const chatRef = doc(db, 'chat', UserData.id)
      const unSub = onSnapshot(chatRef, async (res) => {
       const chatItems = res.data()?.chatsData || [];

       const tempData = []

       for(const item of chatItems){
        const userRef = doc(db, 'users', item.Rid)
        const unsnap = await getDoc(userRef)
        const userData = unsnap.data()
        // tempData.push(...item, userData)
        // item is an object not an array, hence you cant use spread operator here

        // Merge item with userData
        const chatItem = {
            ...item,
            userData,
        };
        tempData.push(chatItem);
       }

       setchatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
      }) 

      return () => {
        unSub()
      }
   }
  }, [UserData])


    const value = {
        UserData, 
        setUserData,
        chatData,
        setchatData,
        loadUserData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;