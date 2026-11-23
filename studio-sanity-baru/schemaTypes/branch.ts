import {defineField, defineType} from 'sanity'

export const branch = defineType({
  name: 'branch',
  title: 'Cabang',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Cabang',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'address',
      title: 'Alamat (opsional)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isActive',
      title: 'Cabang Aktif',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'address'},
  },
})
