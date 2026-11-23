import {defineField, defineType} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Kopi', 'Non-Kopi', 'Makanan', 'Snack', 'Lainnya'],
      },
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Optional SKU for a product without variants.',
    }),
    defineField({
      name: 'price',
      title: 'Price (IDR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Current Stock',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'variants',
      title: 'Variants (optional)',
      type: 'array',
      description: 'Add options such as size or roast. Leave empty for a single-SKU product.',
      of: [
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Variant Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Price Override (IDR)',
              type: 'number',
              description: 'Leave blank to use the product price.',
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'stock',
              title: 'Stock Override',
              type: 'number',
              description: 'Leave blank to share the product stock.',
              validation: (Rule) => Rule.min(0),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((variants) => {
          if (!Array.isArray(variants)) return true
          const skus = variants.map((variant) => String(variant?.sku || '').trim().toUpperCase()).filter(Boolean)
          return new Set(skus).size === skus.length || 'Each variant must have a unique SKU.'
        }),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Legacy Image URL (optional)',
      type: 'url',
      description: 'Kept for existing products; uploaded Product Image takes precedence.',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active in POS',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
