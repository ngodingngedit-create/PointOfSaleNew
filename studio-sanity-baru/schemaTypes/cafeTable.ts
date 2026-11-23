import {defineField, defineType} from 'sanity'

export const cafeTable = defineType({
  name: 'cafeTable',
  title: 'Meja Kafe',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama / Nomor Meja',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(40),
    }),
    defineField({
      name: 'branch',
      title: 'Cabang',
      type: 'reference',
      to: [{type: 'branch'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Urutan',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Meja Aktif',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'branch.name'},
  },
})
