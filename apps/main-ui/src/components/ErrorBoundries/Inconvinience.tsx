import { Button, Card } from 'antd';
import styled from 'styled-components';
import { InconvinienceIllustration } from '../../assets/icons';
export const Inconvinience = () => {
  return (
    <Wrapper className="flex alignCenter justifyCenter">
      <div className="illustration flex alignCenter justifyCenter">
        <InconvinienceIllustration />
      </div>
      <div className="text textCenter">
        <h4 className="mt-15">Sorry For Inconvience</h4>
        <p>Something wen't wrong please try again later</p>
        <p className="mt-10">OR</p>
      </div>
      <div className="flex alignCenter justifyCenter">
        <Button type="primary" size="middle">
          Contact Us
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled(Card)`
  height: calc(100vh - 76px);
  flex-direction: column;

  .text {
    h4 {
      font-style: normal;
      font-weight: 500;
      font-size: 18.53px;
      line-height: 22px;
      /* identical to box height */

      letter-spacing: 0.04em;
      text-transform: capitalize;

      /* text label */

      color: #3e3e3c;
    }
    p {
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 19px;
      /* identical to box height */

      text-align: center;
      letter-spacing: 0.04em;

      color: rgba(62, 62, 60, 0.7);
    }
  }
`;
