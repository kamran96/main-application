import React, { ReactElement, FC } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { ButtonHTMLType } from 'antd/es/button/button';

interface IProps
  extends React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLElement>
  > {
  children?: ReactElement<any> | string;
  htmlType?: ButtonHTMLType;
}

export const DropdowanButton: FC<IProps> = ({ children, htmlType }) => {
  return <Button htmlType={htmlType}>{children}</Button>;
};
