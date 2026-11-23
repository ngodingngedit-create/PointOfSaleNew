import {defineField, defineType} from 'sanity'

export const cashier = defineType({
  name: 'cashier',
  title: 'Kasir / Staf POS',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Kasir / Staf',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'role',
      title: 'Peran Shift',
      type: 'string',
      options: {
        list: [
          {title: 'Kasir', value: 'cashier'},
          {title: 'Supervisor', value: 'supervisor'},
          {title: 'Manager / Owner', value: 'owner'},
        ],
        layout: 'radio',
      },
      initialValue: 'cashier',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'branch',
      title: 'Cabang',
      type: 'reference',
      to: [{type: 'branch'}],
      validation: (Rule) => Rule.required(),
      description: 'Hubungkan kasir dengan cabang tempat ia bertugas.',
    }),
    defineField({
      name: 'avatar',
      title: 'Inisial / Label Singkat',
      type: 'string',
    }),
    defineField({
      name: 'isActive',
      title: 'Status Aktif',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
  },
})
