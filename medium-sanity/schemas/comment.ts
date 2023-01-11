import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'name',
      type: 'string',
    }),
    defineField({
      name: 'approved',
      title: 'approved',
      type: 'boolean',
      description: "comments won't show on the site without approval",
    }),
    defineField({
      name: 'email',
      title: 'email',
      type: 'string',
    }),
    defineField({
      name: 'comment',
      title: 'comment',
      type: 'text',
    }),
    defineField({
      name: 'post',
      type: 'reference',
      to: {type: 'post'},
    }),
  ],
})
