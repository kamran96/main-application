import { RouteConfigComponentProps, renderRoutes } from 'react-router-config';

export const BanksLayout = (props: RouteConfigComponentProps) => {
  return <>{renderRoutes(props.route?.routes)}</>;
};
