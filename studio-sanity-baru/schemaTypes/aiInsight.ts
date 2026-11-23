import {defineField, defineType} from 'sanity'

export const aiInsight = defineType({
  name: 'aiInsight',
  title: 'AI Insight',
  type: 'document',
  fields: [
    defineField({
      name: 'periodStart',
      title: 'Period Start',
      type: 'date',
    }),
    defineField({
      name: 'periodEnd',
      title: 'Period End',
      type: 'date',
    }),
    defineField({
      name: 'summaryText',
      title: 'Summary Text',
      type: 'text',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),
    defineField({
      name: 'recommendations',
      title: 'Recommendations',
      type: 'array',
      of: [
        defineField({
          name: 'recommendation',
          title: 'Recommendation',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
            }),
            defineField({
              name: 'detail',
              title: 'Detail',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
  ],
})
