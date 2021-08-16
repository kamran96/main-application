import React, {useState,
    useEffect} from "react";
import styled from "styled-components";
import {Button, Drawer} from "antd";
import GmailIcon from "../../assets/gmail.png";
import { addRightBar, removeRightBar } from "../../utils/helperFunctions";
import { useGlobalContext } from "../../hooks/globalContext/globalContext";
import { IThemeProps } from "../../hooks/useTheme/themeColors";

export const EmailSider = ()=>{
    const [visibility, setVisibility] = useState(false);


    useEffect(()=>{
        if(visibility){
            addRightBar();
        }else{
            removeRightBar();
        }
    },[visibility])

    useEffect(()=>{
       return ()=>{
           removeRightBar();
       }
    },[])



    return (
        <WrapperEmailSider>
         <div className="logo" onClick={()=> {
             setVisibility(!visibility)
         }} ><img className="img-responsive" src={GmailIcon} /></div>
        <div className={`emails_area ${visibility ? 'open_emails' : ''}`}>
            
        </div>
        </WrapperEmailSider>
    )
}

const WrapperEmailSider = styled.div`
.logo{
    background: #fafafa;
    width: 50px;
    height: 50px;
    padding: 9px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: 0.3s all ease-in-out;
    cursor: pointer;
    img{
        z-index: 1;
    }
    
    &:after{
        content: '';
        position: absolute;
        height: 0%;
        width: 0%;
        background: #efefef;
        border-radius: 50%;
        transition: 0.3s all ease-in-out;
    }

    &:hover{
        &:after{
            height: 100%;
            width: 100%;
        }
    }
}

.emails_area{
    width: 0;
    opacity: 0;
    visibility: hidden;
    transition: 0.4s all ease-in-out;
}

.open_emails{
    width: 370px !important;
    height: 100vh;
    background: ${(props: IThemeProps)=> props?.theme?.colors?.sidebarBg};
    opacity: 1;
    visibility: visible;
    position: absolute;
    top: 0;
    right: 0;
}


`