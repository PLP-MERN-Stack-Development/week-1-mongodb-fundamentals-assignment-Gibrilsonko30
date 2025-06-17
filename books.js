// task 2.1 inserting documents into the collection created in task1

db.books.insertMany([
    {
        title: "JavaScrip for Developers", author: "Dedan", 
        genere: "PRogramming language", published_year: 2024, 
        price: 150, in_stock: true, pages: 312, publisher: "PLP_publishing_board" 
    }, 

    {
        title: "Java for Software Engineers", author: "Dr Bamfa Ceesay", genere: "Programming Languages", 
        published_year: 2019, price: 200, in_stock:  false, pages: 871, 
        publisher: "Gambia Printing and Publish company ltd"
    }, 

    {
        title: "The people of the clave", author: "Moses Mendy", genere: "Fiction", 
        published_year: 2010, price: 500, in_stock: true, pages:179,
         publisher: "Gambia Printing and Publish company ltd"
    }, 

    {
        title: "Mathematcis for Engineers", author: "Dr amadou Keita", genere: "Mathmatcis", 
        published_year: 2024, price: 1000, in_stock: true, pages: 979, 
        publisher: "Gambia Printing and Publish company ltd"
    },

    {
        title: "Linear Algebra for AI Engineers", author: "Prof Dr Victor Ekong", 
        genere: "Computer Technology", published_year: 2017, price: 300, 
        in_stock: true, pages:1081, publisher: "Advanced computing MAchines"
    }, 

    {
        title: "Research Methodology in IT", author: "Dr Mbemba Hydara", genere:"Reseacrh", 
        published_year: 2022, price: 200, in_stock: false, pages: 510, 
        publisher: "Gambia Printing and Publish company ltd"
    }, 

    {
        title: "Cloud computing for Data engineers", author: "Dr Adedoyin ajayi", 
        genere: "Computer Technology", published_year: 2023, price: 500, in_stock: false, 
        pages: 675, publisher: "Gambia Printing and Publish company ltd"
    }, 

    {
        title: "Brighter Grammar for Beginners", author: "Mr Yankuba Tamba", 
        genere: "English", published_year: 2019, price: 450, pages: 175, 
        in_stock: false, publisher: "Gambia Printing and Publish company ltd"
    }, 

    {
        title: "Evolutionary theories", author: "Charles Darwin", genere: "Natural Science",
        published_year: 1972, price: 1000, pages: 1210, in_stock: false, 
        publisher: "Advanced Computing MAcines Publications"
    }, 

    {
        title: "Quantum Mechanics", author: "Mr Dawda Coidea", genere: "Natural Science", 
        published_year: 2009,  price: 900,  pages: 450, in_stock: true, 
        publisher: "Gambia Printing and Publish company ltd"
    }


])


// task 2.2  finding the books with specific genre
db.books.find({genere: "Computer Technology"})

// task 2.3 finding the books oublished after a certain year
db.books.find({published_year: {$gt: 2020}})

// task 2.3  finding a book by specific author
db.books.find ({
    $or:[
    {author: "Dr Bamfa Ceesay"},
    {author: "Dr Mbemba Hydara"}
    ]
})

// task2.4 update the price for a specific book
db.books.updateOne({title: "Research Methodology in IT"},  {$set:{price: 1500}})

// task2.5 deleting a document from the collection
db.books.deleteOne({title: "Brighter Grammar"})

// task 3

// task3.1a - In-stock & published after 2010
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } }
)

// 3.2 Projection (title, author, price)
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)

// #3.3 Sorting by price
db.books.find().sort({ price: 1 })   
db.books.find().sort({ price: -1 })  

// 3.4 Pagination (5 per page)
db.books.find().skip(0).limit(5)
db.books.find().skip(5).limit(5) 

//  Task 4: Aggregation Pipelines
// 4.1 Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }
])

// 4.2 Author with most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

// 4.3 Count books by decade
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [
            { $floor: { $divide: ["$published_year", 10] } },
            10
          ]}},
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
])

//Task 5: Indexing & Performance
db.books.createIndex({ title: 1 })

// 5.2 Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })

//5.3 Comparing performance (explain)
db.books.find({ author: "X", published_year: 2023 })
  .explain("executionStats")

// Then with hint:
db.books.find({ author: "X", published_year: 2023 })
  .hint({ author: 1, published_year: 1 })
  .explain("executionStats")

