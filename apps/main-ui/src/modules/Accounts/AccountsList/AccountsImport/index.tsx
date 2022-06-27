import { ButtonTag } from '../../../../components/ButtonTags'
import React, { FC } from 'react'
import { useGlobalContext } from '../../../../../src/hooks/globalContext/globalContext'



export const AccountsImport:FC = (props) => {
  const {setAccountsImportConfig} = useGlobalContext();
  return (
    <ButtonTag
        onClick={() => {
            setAccountsImportConfig(true, "accounts")
        }}
        className="mr-10"
        title="Import"
        size="middle" />
   )
 }
