import styled from 'styled-components';
import { IThemeProps } from '../../hooks/useTheme/themeColors';

export const AddOrganizationWrapper = styled.div`
  .custom_topbar {
    height: 46px;
    display: flex;
    align-items: center;
  }
  .add_organizations_action {
    padding: 19px 0;
    margin-bottom: 1rem;
  }

  .cardWrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .AddOrganizationCard {
  }
`;

export const AddNewOrganizationWrapper = styled.div`
  width: 290px;
  height: 244px;
  background: ${(props: IThemeProps) => props.theme.colors.organizationCard};
  border: 1px dashed #a5d4ff;
  box-shadow: 0px 2px 16px rgba(211, 235, 255, 0.3);
  border-radius: 8px;
  margin: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  h3 {
    font-weight: 500;
    font-size: 1.2rem;
    padding: 0.5rem 0;
  }

  p {
    color: #505660;
    font-size: 12px;
    font-weight: 400;
  }
`;
