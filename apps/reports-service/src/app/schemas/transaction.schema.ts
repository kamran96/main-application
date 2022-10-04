export const TransactionSchema = {
  rule: {
    properties: {
      transactionId: {
        type: 'number',
      },
      accountId: {
        type: 'number',
      },
      amount: {
        type: 'number',
      },
      transactionType: {
        type: 'number',
      },
      organizationName: {
        type: 'string',
      },
      organizationId: {
        type: 'string',
      },
      status: {
        type: 'number',
      },
      branchId: {
        type: 'string',
      },
      createdById: {
        type: 'string',
      },
      transaction: {
        type: 'object',
      },
      account: {
        type: 'object',
      },
    },
    required: [
      'transactionId',
      'accountId',
      'transactionType',
      'amount',
      // 'organizationName',
      'organizationId',
      'branchId',
      // 'createdById',
      'transaction',
      'account',
    ],
  },

  message: 'Invalid data provided',
};
