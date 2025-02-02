import { useEffect } from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';

const Success = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    useEffect(()=>{
        const token = searchParams.get("token") || ""
        if(token){
            localStorage.setItem("token",token)
            navigate("/")
        }else{
            console.log("Not authorized")
        }
    },[searchParams])
  return (
    <div>
       Token will be:{searchParams.get("token")};      
    </div>
  )
}


export default Success;
