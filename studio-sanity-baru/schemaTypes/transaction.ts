import {defineField, defineType} from 'sanity'

export const transaction = defineType({
  name: 'transaction',
  title: 'Transaction',
  type: 'document',
  fields: [
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: ['cash', 'qris'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'createdAt',
      title: 'Transaction Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Ordered Items',
      type: 'array',
      of: [
        defineField({
          name: 'orderedItem',
          title: 'Ordered Item',
          type: 'object',
          fields: [
            defineField({
              name: 'productId',
              title: 'Product ID',
              type: 'string',
            }),
            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
            }),
            defineField({
              name: 'qty',
              title: 'Quantity',
              type: 'number',
            }),
            defineField({
              name: 'priceAtSale',
              title: 'Price at Sale',
              type: 'number',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'createdAt',
      subtitle: 'paymentMethod',
    },
  },
})
