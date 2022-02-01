import { Button, Card } from 'antd';
import styled from 'styled-components';
import { NotFoundIllustration } from '../../assets/icons';
export const NotFound = () => {
  return (
    <Wrapper className="flex alignCenter justifyCenter">
      <div className="illustration flex alignCenter justifyCenter">
        <NotFoundIllustration />
      </div>
      <div className="text textCenter">
        <h4 className="mt-15">Page Not Found</h4>
        <p>The page you requested could not be found.</p>
      </div>
      <div className="flex alignCenter justifyCenter">
        <Button type="primary" size="middle">
          Try Again
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
      text-transform: capitalize;

      color: rgba(62, 62, 60, 0.7);
    }
  }
`;
