import {useState,useEffect}from 'react'

const Loader = () => {
    const [currentProgress,setCurrentProcess] = useState(0)
    useEffect(()=>{
        let loader = setInterval(()=>{
            setCurrentProcess((prevProgress)=>{
            let newProgress = prevProgress+Math.random()*40;
            if(newProgress>100) newProgress=100;
            if(newProgress ===100) clearInterval(loader)
                return newProgress;
        })
    },800)
    return () =>clearInterval(loader)
},[])
  return (
    <div className='h-1 bg-red-500 transition-all duration-200 absolute z-40 top-0'
    style={{width: `${currentProgress}%` }}>
      
    </div>
  )
}

export default Loader;
