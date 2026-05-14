const db = require('./database');

const books = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
    genre: "Fiction",
    mood: ["Reflective", "Uplifting"],
    rating: 4.5,
    year: 2020,
    review: "A beautiful exploration of the choices that go into a life well lived. Nora Seed finds herself in a library between life and death, with each book offering a different path her life could have taken. Matt Haig delivers a poignant reminder that every life has the potential for wonder.",
    quote: "\"Between life and death there is a library, and within that library, the shelves go on forever.\"",
    pages: 288,
    featured: true,
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1565909496i/35959740.jpg",
    genre: "Mythology",
    mood: ["Epic", "Empowering"],
    rating: 5,
    year: 2018,
    review: "Miller breathes astonishing life into the witch of Greek mythology. Circe is fierce, compassionate, and endlessly relatable despite being an immortal goddess. This is a masterclass in feminist reimagining of ancient tales that feels utterly modern.",
    quote: "\"I will not be made a fool of anymore. I have a witch's power now, and I am not afraid to use it.\"",
    pages: 400,
    featured: true,
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg",
    genre: "Sci-Fi",
    mood: ["Thrilling", "Heartwarming"],
    rating: 4.8,
    year: 2021,
    review: "Andy Weir has done it again. A lone astronaut wakes up millions of miles from Earth with no memory and a mission to save humanity. What follows is the most delightful buddy comedy set in space you'll ever read. Science has never been this fun.",
    quote: "\"I penetrated the outer hull of an alien vessel with a rock. I'm humanity's first interstellar explorer and I'm terrible at it.\"",
    pages: 496,
    featured: true,
  },
  {
    title: "Piranesi",
    author: "Susanna Clarke",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1609095173i/50202953.jpg",
    genre: "Fantasy",
    mood: ["Mysterious", "Dreamlike"],
    rating: 4.3,
    year: 2020,
    review: "An impossible house with infinite halls, a sky of clouds, and an ocean in its basement. Piranesi lives here, cataloging statues and tides. Clarke's prose is so luminous it feels like reading a dream. A short, strange, utterly captivating novel.",
    quote: "\"The Beauty of the House is immeasurable; its Kindness infinite.\"",
    pages: 272,
    featured: false,
  },
  {
    title: "The Song of Achilles",
    author: "Madeline Miller",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1331154660i/13623848.jpg",
    genre: "Mythology",
    mood: ["Romantic", "Tragic"],
    rating: 4.7,
    year: 2012,
    review: "If you thought you knew the story of Achilles, think again. Miller retells the Iliad through the eyes of Patroclus, and the result is a love story so tender it will break your heart. Every page drips with beauty and inevitable tragedy.",
    quote: "\"Name one hero who was happy. You can't.\"",
    pages: 416,
    featured: false,
  },
  {
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1603206535i/54120408.jpg",
    genre: "Sci-Fi",
    mood: ["Reflective", "Bittersweet"],
    rating: 4.0,
    year: 2021,
    review: "Ishiguro writes from the perspective of an artificial friend named Klara, and through her innocent eyes we see our own humanity reflected back at us. Quiet, profound, and deeply moving — a meditation on what it means to love and to be human.",
    quote: "\"There was something very special, but it wasn't inside Josie. It was inside those who loved her.\"",
    pages: 320,
    featured: false,
  },
  {
    title: "The House in the Cerulean Sea",
    author: "TJ Klune",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1569514209i/45047384.jpg",
    genre: "Fantasy",
    mood: ["Cozy", "Heartwarming"],
    rating: 4.6,
    year: 2020,
    review: "A warm hug in book form. Linus Baker is sent to evaluate an orphanage for magical children and discovers that family comes in the most unexpected shapes. Wholesome, witty, and deeply humane — the perfect rainy day read.",
    quote: "\"Don't you wish you were here?\"",
    pages: 398,
    featured: false,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg",
    genre: "Memoir",
    mood: ["Inspiring", "Intense"],
    rating: 4.5,
    year: 2018,
    review: "An astonishing true story of a woman who grew up in a survivalist family and never set foot in a classroom until age 17 — yet went on to earn a PhD from Cambridge. Raw, unflinching, and ultimately a testament to the transformative power of education.",
    quote: "\"You can love someone and still choose to say goodbye to them.\"",
    pages: 334,
    featured: false,
  },
  {
    title: "Mexican Gothic",
    author: "Silvia Moreno-Garcia",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1574692432i/53152636.jpg",
    genre: "Horror",
    mood: ["Creepy", "Atmospheric"],
    rating: 3.8,
    year: 2020,
    review: "Noemí Taboada is a glamorous socialite who travels to a decaying mansion in the Mexican countryside to rescue her newlywed cousin. What she discovers is far worse than she imagined. A gothic horror masterpiece that is as lush as it is terrifying.",
    quote: "\"The world is a dark, dark place, and we all have our monsters.\"",
    pages: 301,
    featured: false,
  },
  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1636978687i/58784475.jpg",
    genre: "Fiction",
    mood: ["Creative", "Bittersweet"],
    rating: 4.4,
    year: 2022,
    review: "A novel about the creative process, love, and the games we play. Sam and Sadie's decades-long partnership in game design is a masterful exploration of collaboration, identity, and what it means to create something that outlasts you. Simply brilliant.",
    quote: "\"To design a game is to imagine the person who will eventually play it.\"",
    pages: 416,
    featured: true,
  },
  {
    title: "Babel",
    author: "R.F. Kuang",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1677361825i/57945316.jpg",
    genre: "Fantasy",
    mood: ["Intellectual", "Epic"],
    rating: 4.6,
    year: 2022,
    review: "A dark academia fantasy set in 1830s Oxford where translation is magic — literally. Kuang weaves colonialism, language, and revolution into a story that is both intellectually dazzling and emotionally devastating. A triumph.",
    quote: "\"That's just what translation is, I think. That's all speaking is. Listening to the other and trying to see past your own biases to glimpse what they're trying to say.\"",
    pages: 560,
    featured: false,
  },
  {
    title: "Anxious People",
    author: "Fredrik Backman",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1588954224i/49127718.jpg",
    genre: "Fiction",
    mood: ["Funny", "Heartwarming"],
    rating: 4.2,
    year: 2020,
    review: "A failed bank robber takes a group of strangers hostage during an apartment viewing. What ensues is Backman at his finest — a hilarious, tender, and deeply compassionate look at the absurdity of being human. You'll laugh, then cry, then laugh again.",
    quote: "\"We don't always get to choose what we get to be afraid of.\"",
    pages: 352,
    featured: false,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    genre: "Sci-Fi",
    mood: ["Epic", "Intense"],
    rating: 4.8,
    year: 1965,
    review: "A masterpiece of science fiction that is as much about ecology, religion, and politics as it is about space travel. Arrakis is a brutal, beautiful world, and Paul Atreides' journey is the quintessential hero's epic.",
    quote: "\"I must not fear. Fear is the mind-killer.\"",
    pages: 896,
    featured: false,
  },
  {
    title: "The Secret History",
    author: "Donna Tartt",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1451554948i/29044.jpg",
    genre: "Fiction",
    mood: ["Atmospheric", "Intellectual"],
    rating: 4.6,
    year: 1992,
    review: "The blueprint for dark academia. A group of elite, eccentric classics students at a New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries—until they cross a line.",
    quote: "\"Beauty is rarely soft or consolatory. Quite the contrary. Genuine beauty is always quite awful.\"",
    pages: 559,
    featured: false,
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1383718290i/13079982.jpg",
    genre: "Sci-Fi",
    mood: ["Reflective", "Intense"],
    rating: 4.3,
    year: 1953,
    review: "A terrifyingly prophetic vision of a future where books are banned and 'firemen' burn any that are found. Bradbury's poetic prose serves as a stark warning against censorship and the loss of critical thought.",
    quote: "\"You don't have to burn books to destroy a culture. Just get people to stop reading them.\"",
    pages: 249,
    featured: false,
  },
  {
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1620324329i/50659467.jpg",
    genre: "Fantasy",
    mood: ["Romantic", "Epic"],
    rating: 4.1,
    year: 2015,
    review: "A captivating blend of Beauty and the Beast and faerie lore. Feyre's journey from a desperate hunter to a key player in the magical courts of Prythian is filled with danger, romance, and political intrigue.",
    quote: "\"Do not feel bad for one moment about doing what brings you joy.\"",
    pages: 419,
    featured: false,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
    genre: "Fiction",
    mood: ["Inspiring", "Reflective"],
    rating: 3.9,
    year: 1988,
    review: "A simple, fable-like story about an Andalusian shepherd boy who travels in search of a worldly treasure. It's a testament to the transformative power of our dreams and the importance of listening to our hearts.",
    quote: "\"And, when you want something, all the universe conspires in helping you to achieve it.\"",
    pages: 163,
    featured: false,
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1668168406i/35031085.jpg",
    genre: "Horror",
    mood: ["Creepy", "Tragic"],
    rating: 4.4,
    year: 1818,
    review: "More than just a monster story, this is a profound tragedy about creation, responsibility, and the deep, agonizing pain of loneliness. Shelley's prose is as gothic and atmospheric as the stormy nights she writes about.",
    quote: "\"Beware; for I am fearless, and therefore powerful.\"",
    pages: 260,
    featured: false,
  },
];

const currentlyReading = {
  id: 1,
  title: "Piranesi",
  author: "Susanna Clarke",
  cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1609095173i/50202953.jpg",
  progress: 45,
  thoughts: "An impossible house with infinite halls and an ocean in its basement. Clarke's prose is so luminous it feels like reading a dream. I am currently wandering the halls of the Third Northern Vestibule...",
};

// Seed function
db.serialize(() => {
  // Drop and recreate tables to ensure clean schema
  db.run("DROP TABLE IF EXISTS books");
  db.run("DROP TABLE IF EXISTS currently_reading");
  db.run("DROP TABLE IF EXISTS subscribers");
  db.run("DROP TABLE IF EXISTS curated_lists");

  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover TEXT,
    rating REAL DEFAULT 0,
    genre TEXT,
    mood TEXT,
    review TEXT,
    quote TEXT,
    pages INTEGER DEFAULT 0,
    year INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS currently_reading (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover TEXT,
    progress INTEGER DEFAULT 0,
    thoughts TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS curated_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    gradient TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed books
  const stmt = db.prepare(
    `INSERT INTO books (title, author, cover, rating, genre, mood, review, quote, pages, year, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  books.forEach(book => {
    stmt.run(
      book.title,
      book.author,
      book.cover,
      book.rating,
      book.genre,
      book.mood.join(','),
      book.review,
      book.quote,
      book.pages,
      book.year,
      book.featured ? 1 : 0
    );
  });

  stmt.finalize();

  // Seed curated lists
  const listStmt = db.prepare(
    `INSERT INTO curated_lists (title, description, icon, gradient)
     VALUES (?, ?, ?, ?)`
  );

  const curatedLists = [
    {
      title: "Books That Feel Like a Warm Hug",
      description: "For when the world is too much and you need fictional friends.",
      icon: "HeartHandshake",
      gradient: "linear-gradient(135deg, #C9A84C22, #D4956A22)",
    },
    {
      title: "Raining Outside? Read These.",
      description: "Atmospheric stories that pair perfectly with the sound of rain on glass.",
      icon: "CloudRain",
      gradient: "linear-gradient(135deg, #7A9CC422, #6B8CB322)",
    },
    {
      title: "Books That Broke My Brain (In a Good Way)",
      description: "Mind-bending stories that will change how you see the world.",
      icon: "Brain",
      gradient: "linear-gradient(135deg, #C47A7A22, #A8669A22)",
    },
    {
      title: "Under 300 Pages — No Excuses",
      description: "Short books with massive impact. Perfect for a weekend binge.",
      icon: "Zap",
      gradient: "linear-gradient(135deg, #E8A84922, #C9A84C22)",
    }
  ];

  curatedLists.forEach(list => {
    listStmt.run(list.title, list.description, list.icon, list.gradient);
  });

  listStmt.finalize();

  // Seed currently reading
  db.run(
    `INSERT INTO currently_reading (id, title, author, cover, progress, thoughts)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      currentlyReading.id,
      currentlyReading.title,
      currentlyReading.author,
      currentlyReading.cover,
      currentlyReading.progress,
      currentlyReading.thoughts,
    ]
  );

  console.log(`✅ Database seeded successfully with ${books.length} books!`);
  console.log(`✅ Currently reading: "${currentlyReading.title}"`);
});
