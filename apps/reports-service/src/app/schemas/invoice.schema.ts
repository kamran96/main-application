export const InvoiceSchema = {
  rule: {
    properties: {
      invoiceId: {
        type: 'number',
      },
      contactId: {
        type: 'string',
      },
      itemId: {
        type: 'string',
      },
      reference: {
        type: 'string',
      },
      invoiceNumber: {
        type: 'string',
      },
      issueDate: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      dueDate: {
        type: 'string',
      },
      quantity: {
        type: 'number',
      },
      unitPrice: {
        type: 'string',
      },
      itemDiscount: {
        type: 'string',
      },
      accountId: {
        type: 'number',
      },
      tax: {
        type: 'string',
      },
      total: {
        type: 'number',
      },
      costOfGoodAmount: {
        type: 'number',
      },
      // currency: {
      //   type: 'string',
      // },
      contact: {
        type: 'object',
      },
      item: {
        type: 'object',
      },
      organizationName: {
        type: 'string',
      },
      organizationId: {
        type: 'string',
      },
      branchId: {
        type: 'string',
      },
      createdById: {
        type: 'string',
      },
      user: {
        type: 'object',
      },
      payment: {
        type: 'object',
      },
      transactions: {
        type: 'array',
      },
    },
    required: [
      'invoiceId',
      'contactId',
      'itemId',
      'reference',
      'invoiceNumber',
      'issueDate',
      'description',
      'dueDate',
      'quantity',
      'unitPrice',
      'itemDiscount',
      'accountId',
      'tax',
      'total',
      'costOfGoodAmount',
      // 'currency',
      'contact',
      'item',
      'organizationName',
      'organizationId',
      'branchId',
      'createdById',
      'user',
      'payment',
      'transactions',
    ],
  },

  message: 'Invalid data provided',
};
