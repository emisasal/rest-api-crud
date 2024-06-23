export const authorData = {
  author_id: 127,
  first_name: "Michael",
  last_name: "Langdon",
  bio: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
}

export const bookData = {
  book_id: 154,
  title: "What happened in 1971",
  description:
    "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
  author_id: 391,
  genre_id: 7,
  publisher_id: 12,
  price: "6.43",
  publish_date: "2001-06-25T07:01:44.000Z",
  isbn: "502074967-2",
  author: {
    author_id: 391,
    first_name: "Thain",
    last_name: "Beardwell",
    bio: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.",
  },
  genre: {
    genre_id: 7,
    name: "horror",
    description:
      "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
  },
  publisher: {
    publisher_id: 12,
    publisher_name: "Reynolds, Stoltenberg and Herzog",
    contact_name: null,
    phone_number: "282-975-8933",
  },
}

export const modelsListData = [
  "Book",
  "Author",
  "Genre",
  "Publisher",
  "Order",
  "OrderDetail",
  "Customer",
  "Review",
]

export const categoryListDoc = [
  "author_id",
  "first_name",
  "last_name",
  "bio",
  "Book",
]

export const customerData = {
  customer_id: 527,
  first_name: "Thor",
  last_name: "Aaronsohn",
  email: "taaronsohnem@e-recht24.de",
  created_at: "2005-02-11T06:27:24.000Z",
  updated_at: "2024-06-15T00:21:59.160Z",
}

export const genreData = {
  genre_id: 15,
  name: "art",
  description:
    "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
}

export const orderData = {
  order_id: 128,
  customer_id: 480,
  order_date: "2023-12-30T02:20:38.000Z",
  total_amount: "365.1",
}

export const publisherData = {
  publisher_id: 81,
  publisher_name: "Abshire-Farrell",
  contact_name: "Tildie Dorking",
  phone_number: "910-966-6762",
}

export const reviewData = {
  review_id: 191,
  book_id: 486,
  customer_id: 420,
  rating: 10,
  comment: "Sed ante. Vivamus tortor. Duis mattis egestas metus.",
  review_date: "2014-08-09T01:43:00.000Z",
}
