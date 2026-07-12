function upsertMetaTag(selector, attributes) {
  let tag = document.head.querySelector(selector)

  if (!tag) {
    tag = document.createElement('meta')
    document.head.appendChild(tag)
  }

  Object.entries(attributes).forEach(([name, value]) => {
    tag.setAttribute(name, value)
  })
}

export function setPageMeta({ title, description, ogDescription = description }) {
  if (title) {
    document.title = title
  }

  if (description) {
    upsertMetaTag('meta[name="description"]', {
      name: 'description',
      content: description,
    })
  }

  if (ogDescription) {
    upsertMetaTag('meta[property="og:description"]', {
      property: 'og:description',
      content: ogDescription,
    })
  }
}
