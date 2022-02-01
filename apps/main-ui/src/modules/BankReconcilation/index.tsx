import { MicroFrontend } from '@invyce/micro-frontend';

const Ui = () => (
  <MicroFrontend name="bankReconcilation" host="http://localhost:4800" />
);
export const BankReconcilation = () => {
  return <Ui />;
};
