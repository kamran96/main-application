import React, { FC } from 'react';
import { LoginForm } from './Form';
import { Wrapper } from './styles';
import InvyceLog from '../../assets/invyceLogo.png';
import LoginIllustration from '../../assets/login.png';

export const Login: FC = () => {
  return (
    <Wrapper>
      <div className="illustration">
        <div className="invyce_logo">
          <img src={InvyceLog} alt={'invyce logo'} />
        </div>
        <h2 className="slogan">
          Say good bye to
          <br />
          paper receipts, Login
          <br />
          to Invyce software
        </h2>
        <div className="illustration_image">
          <img src={LoginIllustration} alt="illustration" />
        </div>
      </div>
      <div className="form">
        <LoginForm />
      </div>
    </Wrapper>
  );
};
