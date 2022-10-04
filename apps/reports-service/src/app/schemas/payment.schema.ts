export const PaymentSchema = {
  rule: {
    properties: {
      paymentId: {
        type: 'number',
      },
      comment: {
        type: 'string',
      },
      reference: {
        type: 'string',
      },
      paymentType: {
        type: 'number',
      },
      paymentMode: {
        type: 'number',
      },
      amount: {
        type: 'number',
      },
      contactId: {
        type: 'string',
      },
      targetId: {
        type: 'number',
      },
      transactionId: {
        type: 'number',
      },
      // 1 for invoice 2 for bill
      type: {
        type: 'number',
      },
      entryType: {
        type: 'number',
      },
      dueDate: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      runningPayment: {
        type: 'boolean',
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
      invoice: {
        type: 'object',
      },
      contact: {
        type: 'object',
      },
    },
    required: [
      // 'paymentId',
      // 'comment',
      // 'reference',
      'paymentType',
      // 'paymentMode',
      'amount',
      // 'accountId',
      'targetId',
      'contactId',
      'transactionId',
      'type',
      'entryType',
      // 'dueDate',
      'date',
      // 'runningPayment',
      // 'organizationId',
      // 'status',
      // 'branchId',
      // 'createdById',
      'invoice',
    ],
  },

  message: 'Invalid data provided',
};
