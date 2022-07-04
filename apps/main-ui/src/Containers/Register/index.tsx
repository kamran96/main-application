import { Row } from 'antd';
import { FC } from 'react';
import RegIllustration from '../../assets/registration.png';
import { RegisterForm } from './RegisterForm';
import { RegisterWrapper } from './styles';
import InvyceLog from '../../assets/invyceLogo.png';

export const Register: FC = () => {
  return (
    <RegisterWrapper>
      <Row className="w-100">
        <div className="register_grid">
          <div className="illustration">
            <div className="invyce_logo">
              <img src={InvyceLog} alt={'invyce logo'} />
            </div>
            <h2 className="slogan">
              A few click away
              <br />
              from creating your
              <br />
              own account
            </h2>
            <div className="illustration_image">
              <img src={RegIllustration} alt="illustration" />
            </div>
          </div>
          <div className="form">
            <RegisterForm />
          </div>
        </div>
      </Row>
    </RegisterWrapper>
  );
};
