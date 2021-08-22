import { FC, ReactElement, useEffect } from "react";
import "antd/dist/antd.dark.css";

interface IProps{
    children: ReactElement<any>
}

export const DarkThemeWrapper:FC<IProps> = ({children})=>{
    
    

    
    // useEffect(()=>{
    //    let link = document.createElement('style');
    //    link.innerHTML = '@import url("antd/dist/antd.dark.css")'
    //    link.classList.add('dark_theme_link');
    //    document.head.appendChild(link);

        
    // },[])

    return (
        <>
        {children}
        </>
    )
}