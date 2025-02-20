import { useEffect, useState } from 'react'
import './App.css'
import { SingleCell } from './components/SingleCell';
import { SingleCellTwo } from './components/SingleCellTwo';
import io from "socket.io-client"

function App() {
  const [gameId,setGameId]=useState(null);
  const [userOne,setUserOne]=useState([0,0,0,0,0,0,0,0,0]);
  const [userTwo,setUserTwo]=useState([0,0,0,0,0,0,0,0,0]);
  const[userOneFiller,setUserOneFiller]=useState(1);
  const[userTwoFiller,setUserTwoFiller]=useState(1);
  const[userNumber,setUserNumber]=useState(1);
  const [lock,setLock]=useState(true);
  const [rolled,setRolled]=useState(null);
  const [isGameOn,setIsGameOn]=useState(false);
  const [turn, setTurn]=useState(true);

  useEffect(() => {
    connectToSocket();
  }, [gameId]);
  function connectToSocket(){
    
    if(gameId){
      const newSocket= io("https://el-lotteria-backend.onrender.com");
      
      newSocket.on("connect",()=>{});

      newSocket.on("disconnect",()=>{});

      newSocket.emit("join_room",gameId);

      newSocket.on("receive_message",(data)=>{setLock(true);alert(data);});
    }
  }

  function handleRoll() {
    if(isGameOn){
      setLock(true);
      const value=Math.floor(Math.random() * 9) + 1;
      setRolled(value);
      if(turn){
        const a=[...userOne];
          const b=a.findIndex((e)=>e==value);
          if(b==-1){
          setTurn(e=>!e);
          setUserNumber(2);
          setLock(false);
          return
          }
          a[b]="X"
          setUserOne([...a]);
          handleDataChangesandVictory(a);
          setTurn(e=>!e);
          setUserNumber(2);
      }
      else{
        const a=[...userTwo];
          const b=a.findIndex((e)=>e==value);
          if(b==-1){
            setTurn(e=>!e);
            setUserNumber(1);
            setLock(false);
            return
            }
          a[b]="X"
          
          setUserTwo([...a]);
          handleDataChangesandVictory(a);
          setTurn(e=>!e);
          setUserNumber(1);
      }
    }
  }
  function startGame(){
    if(userOneFiller==10&&userTwoFiller==10){
      saveUserData();
      setIsGameOn(true);
    }
  }
  function handleReset(){
    window.location.reload(false);
  }

  async function saveUserData() {
    try {
      const response=await fetch("https://el-lotteria-backend.onrender.com/saveset",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            "userOne":userOne,
            "userTwo":userTwo
        })
    });
    const result=await response.json()
    setGameId(result._id);
    setLock(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDataChangesandVictory(a) {
    try {

      const response=await fetch("https://el-lotteria-backend.onrender.com/changeandcheck",{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify({
            "_id":gameId,
            "array":a,
            "userNum":userNumber
        })
    });
    const result=await response.json()
      if(result.victory==true){
        alert(`${result.victor} Won`);
        setLock(true);
      }
      else{
        setLock(false);
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
    <h1 className='main-title'>El-Lotteria Game</h1>
      <div className='styling '>

        <div className='flex flex-col gap-5'>
          <div className='w-[300px] h-[300px] flex flex-wrap'>
            {userOne.map((e,index)=><SingleCell key={index} data={{userOne,setUserOne,e,index,isGameOn,userOneFiller,setUserOneFiller}}></SingleCell>)}
          </div>
          <div className='w-[300px] h-[300px] flex flex-wrap'>
            {userTwo.map((e,index)=><SingleCellTwo key={index} data={{userTwo,setUserTwo,e,index,isGameOn,userTwoFiller,setUserTwoFiller}}></SingleCellTwo>)}
          </div>
        </div>


        <div className=' flex flex-col gap-10 text-center'>
        {
          !isGameOn ? <div onClick={startGame} className='border border-black cursor-pointer  p-2 text-2xl font-bold rounded-2xl '>Start</div> : 
          <>
          <div > 
          <button disabled={lock} onClick={()=>{handleRoll()}} className='border border-black cursor-pointer  p-2 text-2xl font-bold rounded-2xl '>{`User ${userNumber}: Roll`}</button>
          {lock? <div>Wait...</div> : null}
          </div>
        
           <div className='text-2xl '> Last Rolled :  {rolled}</div></>
        }

        <div onClick={handleReset} className='border border-black cursor-pointer  p-2 text-2xl font-bold rounded-2xl '>RESET</div>

        </div>
      </div>
    </>
  )
}

export default App;
