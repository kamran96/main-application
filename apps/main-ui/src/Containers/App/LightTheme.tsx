import  "antd/dist/antd.css";
import { FC, ReactElement } from "react";

interface IProps{
    children: ReactElement<any>;
};
export const LightThemeWrapper:FC<IProps> = ({children})=>{
    return(
        <>{children}</>
    )
}

