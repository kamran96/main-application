import { ButtonTag } from '../../../../../components/ButtonTags'
import React, { FC } from 'react'
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext'



export const BanksImport:FC = () => {
    const {setBankImportConfig} = useGlobalContext();

  return (
    <ButtonTag 
        onClick={() => {
            setBankImportConfig(true, 'banks');
        }}
        className="mr-10"
        size='middle'
        title='import'
    />
   )
 }
