import { renderRoutes, RouteConfigComponentProps } from "react-router-config";

export const VerificationLayout = (props: RouteConfigComponentProps) => {
  return renderRoutes(props?.route?.routes);
};
