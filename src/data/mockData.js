export const MOCK_SHOWS = [
  { _id:"1",  title:"Inception",           type:"Movie",   genre:["Sci-Fi","Thriller"],          releaseYear:2010, description:"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", posterUrl:"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", rating:8.8 },
  { _id:"2",  title:"Breaking Bad",        type:"TV Show", genre:["Drama","Crime"],               releaseYear:2008, description:"A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine to secure his family's future.",     posterUrl:"https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",  rating:9.5 },
  { _id:"3",  title:"Interstellar",        type:"Movie",   genre:["Sci-Fi","Drama"],              releaseYear:2014, description:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",                                            posterUrl:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating:8.6 },
  { _id:"4",  title:"The Last of Us",      type:"TV Show", genre:["Drama","Action","Sci-Fi"],     releaseYear:2023, description:"After a global catastrophe, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",                           posterUrl:"https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", rating:8.8 },
  { _id:"5",  title:"Oppenheimer",         type:"Movie",   genre:["Drama","History"],             releaseYear:2023, description:"The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",                                      posterUrl:"https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", rating:8.9 },
  { _id:"6",  title:"Severance",           type:"TV Show", genre:["Thriller","Sci-Fi","Drama"],   releaseYear:2022, description:"Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",                         posterUrl:"https://image.tmdb.org/t/p/w500/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg", rating:8.7 },
  { _id:"7",  title:"Dune: Part Two",      type:"Movie",   genre:["Sci-Fi","Action"],             releaseYear:2024, description:"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",                        posterUrl:"https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", rating:8.5 },
  { _id:"8",  title:"Succession",          type:"TV Show", genre:["Drama","Comedy"],              releaseYear:2018, description:"The Roy family controls one of the biggest media conglomerates. Their brutal fight for power plays out in savage family dynamics.",               posterUrl:"https://image.tmdb.org/t/p/w500/e2X4vnDdan9Do0G7Ez0XT0J8qLx.jpg", rating:8.8 },
  { _id:"9",  title:"The Dark Knight",     type:"Movie",   genre:["Action","Crime","Drama"],      releaseYear:2008, description:"When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability.",           posterUrl:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating:9.0 },
  { _id:"10", title:"Shogun",              type:"TV Show", genre:["Drama","History","Action"],    releaseYear:2024, description:"In feudal Japan, a ship of European sailors arrives, setting off a conflict between rival lords that will reshape the nation.",                   posterUrl:"https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg", rating:8.9 },
  { _id:"11", title:"Parasite",            type:"Movie",   genre:["Drama","Thriller","Comedy"],   releaseYear:2019, description:"Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kim clan.",                  posterUrl:"https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", rating:8.5 },
  { _id:"12", title:"House of the Dragon", type:"TV Show", genre:["Drama","Fantasy","Action"],    releaseYear:2022, description:"The story of House Targaryen, set 200 years before the events of Game of Thrones.",                                                              posterUrl:"https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg", rating:8.4 },
];

export const MOCK_REVIEWS = {
  "1":[{ _id:"r1",username:"alex_w",rating:9,reviewText:"Mind-bending masterpiece. Nolan at his absolute best." },{ _id:"r2",username:"sarah_k",rating:8,reviewText:"Visually stunning. The concept is brilliant even if the ending is debatable." }],
  "2":[{ _id:"r3",username:"moviebuff99",rating:10,reviewText:"The best TV show ever made, no contest." },{ _id:"r4",username:"alex_w",rating:10,reviewText:"Walter White's arc is unmatched in television history." }],
  "4":[{ _id:"r5",username:"sarah_k",rating:9,reviewText:"Pedro Pascal carries this show effortlessly. Absolutely gripping." }],
  "9":[{ _id:"r6",username:"moviebuff99",rating:10,reviewText:"Heath Ledger's Joker alone makes this a 10/10." },{ _id:"r7",username:"cinema_lover",rating:9,reviewText:"Still the best superhero film ever made." }],
};

export const MOCK_WATCHLIST = [
  { _id:"w1", show:{ _id:"2",  title:"Breaking Bad",    type:"TV Show", releaseYear:2008, posterUrl:"https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",  totalEpisodes:62 }, status:"Watching",      progress:24 },
  { _id:"w2", show:{ _id:"4",  title:"The Last of Us",  type:"TV Show", releaseYear:2023, posterUrl:"https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",  totalEpisodes:9  }, status:"Plan to Watch", progress:0  },
  { _id:"w3", show:{ _id:"6",  title:"Severance",       type:"TV Show", releaseYear:2022, posterUrl:"https://image.tmdb.org/t/p/w500/mYLOqiStMxDK3fYZFirgrMt8z5d.jpg",  totalEpisodes:18 }, status:"Completed",     progress:18 },
  { _id:"w4", show:{ _id:"8",  title:"Succession",      type:"TV Show", releaseYear:2018, posterUrl:"https://image.tmdb.org/t/p/w500/e2X4vnDdan9Do0G7Ez0XT0J8qLx.jpg",  totalEpisodes:39 }, status:"Watching",      progress:12 },
  { _id:"w5", show:{ _id:"1",  title:"Inception",       type:"Movie",   releaseYear:2010, posterUrl:"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",  totalEpisodes:1  }, status:"Completed",     progress:1  },
  { _id:"w6", show:{ _id:"10", title:"Shogun",          type:"TV Show", releaseYear:2024, posterUrl:"https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg",  totalEpisodes:10 }, status:"Dropped",       progress:3  },
];

export const MOCK_USERS = [
  { _id:"u1", username:"alex_w",       role:"user",  createdAt:"2024-01-15" },
  { _id:"u2", username:"sarah_k",      role:"user",  createdAt:"2024-02-03" },
  { _id:"u3", username:"moviebuff99",  role:"user",  createdAt:"2024-02-20" },
  { _id:"u4", username:"cinema_lover", role:"user",  createdAt:"2024-03-10" },
  { _id:"u5", username:"admin",        role:"admin", createdAt:"2024-01-01" },
];

export const MOCK_ALL_REVIEWS = [
  { _id:"r1", username:"alex_w",       show:"Inception",       rating:9,  reviewText:"Mind-bending masterpiece.",              createdAt:"2024-03-01" },
  { _id:"r2", username:"sarah_k",      show:"Inception",       rating:8,  reviewText:"Visually stunning.",                      createdAt:"2024-03-02" },
  { _id:"r3", username:"moviebuff99",  show:"Breaking Bad",    rating:10, reviewText:"The best TV show ever made.",              createdAt:"2024-03-05" },
  { _id:"r4", username:"alex_w",       show:"Breaking Bad",    rating:10, reviewText:"Walter White's arc is unmatched.",         createdAt:"2024-03-06" },
  { _id:"r5", username:"sarah_k",      show:"The Last of Us",  rating:9,  reviewText:"Pedro Pascal carries this effortlessly.", createdAt:"2024-03-10" },
  { _id:"r6", username:"moviebuff99",  show:"The Dark Knight", rating:10, reviewText:"Heath Ledger alone makes this a 10/10.",  createdAt:"2024-03-12" },
];

export const GENRES = ["Action","Comedy","Crime","Drama","Fantasy","History","Sci-Fi","Thriller"];
