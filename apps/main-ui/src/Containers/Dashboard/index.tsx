import React, { SFC } from "react";
import { Heading } from "../../components/Heading";
import { DashboardWrapper } from "../../Layout/DashboardStyles";

interface IProps{
}

export const Dashboard:SFC<IProps>=({})=>{
    return(
        <DashboardWrapper><Heading type="container">Dashboard</Heading></DashboardWrapper>
    )
}