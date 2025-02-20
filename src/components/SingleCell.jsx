import { useState } from "react"

export function SingleCell(props){

    const {userOne,setUserOne,e,index,isGameOn,userOneFiller,setUserOneFiller}=props.data;

    const [flag,setFlag]=useState(true);
    
    async function handleClick() {
      if(!isGameOn && flag){
        const a=[...userOne];
        a[index]=userOneFiller;
        setUserOneFiller((e)=>e+1);
        setUserOne([...a]);
        setFlag(false);
      }
    }

    return (<>
            <div onClick={handleClick} className="w-[100px] h-[100px] border border-black flex justify-center items-center text-5xl cursor-pointer">
                {e}
            </div>
        </>)
}