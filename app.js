import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let artists = [
  {
    id: 0,
    name: "Lil Tjay",
    birthdate: "April 30, 2001",
    activeSince: "2017",
    genres: "rapper og synger",
    labels: "Columbia Records",
    website: "https://en.wikipedia.org/wiki/Lil_Tjay",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Lil_TJ_%28cropped%29.jpg/800px-Lil_TJ_%28cropped%29.jpg",
    shortDescription:
      "Tione Jayden Merritt, professionelt kendt som Lil Tjay, er en amerikansk rapper og sanger. Han blev fremtrædende i 2017 med sangen Resume, og derefter udgivelsen af ​​hans gennembrudssang Brothers, som fik ham til at skrive kontrakt med Columbia Records senere i løbet af året.",
  },

  {
    id: 1,
    name: "Polo G",
    birthdate: "June 1, 1996",
    activeSince: "2015",
    genres: "rapper og synger",
    labels: "Columbia Records",
    website: "https://en.wikipedia.org/wiki/Polo_G",
    image: "https://i.scdn.co/image/ab6761610000e5ebbedf3bdf589da06d1567196c",
    shortDescription:
      "Taurus Tremani Bartlett, kendt professionelt som Polo G, er en amerikansk rapper. Han blev fremtrædende med sine singler Finer Things og Pop Out. Hans debutalbum Die a Legend toppede som nummer seks på den amerikanske Billboard 200 og blev certificeret platin af RIAA. ",
  },

  {
    id: 2,
    name: "J Hus",
    birthdate: "May 26, 1996",
    activeSince: "2016",
    genres: "rap",
    labels: "BLack Butter Records",
    website: "https://en.wikipedia.org/wiki/J_Hus",
    image: "https://i.ytimg.com/vi/lFrN7y-kA7M/mqdefault.jpg",
    shortDescription:
      "Momodou Lamin Jallow, professionelt kendt som J Hus, er en britisk rapper og sanger, der er blevet krediteret for at være banebrydende i genren Afroswing. Han er i øjeblikket signet til Black Butter Records.",
  },

  {
    id: 3,
    name: "Burna Boy",
    birthdate: "July 2, 1991",
    activeSince: "2011",
    genres: "afrobeats",
    labels: "Warner Music Australia",
    website: "https://en.wikipedia.org/wiki/Burna_Boy",
    image: "https://pbs.twimg.com/media/EQVwBmpWsAAZNU1.jpg",
    shortDescription:
      "Damini Ebunoluwa Ogulu MFR, kendt professionelt som Burna Boy, er en nigeriansk sanger, sangskriver og pladeproducer. Han steg til stjernestatus i 2012 efter at have udgivet Like to Party, hovedsinglen fra hans debutstudiealbum L.I.F.E.",
  },

  {
    id: 4,
    name: "Lil Baby",
    birthdate: "December 3, 1994",
    activeSince: "2017",
    genres: "rap",
    labels: "Quality Control Music",
    website: "https://en.wikipedia.org/wiki/Lil_Baby",
    image: "https://i.scdn.co/image/ab6761610000e5eb6cad3eff5adc29e20f189a6c",
    shortDescription:
      "Dominique Armani Jones, professionelt kendt som Lil Baby, er en amerikansk rapper, sanger og sangskriver. Han steg til mainstream berømmelse i 2017 efter udgivelsen af ​​hans mixtape Perfect Timing. ",
  },

  {
    id: 5,
    name: "Mostack",
    birthdate: "August 31, 1994",
    activeSince: "2014",
    genres: "rap",
    labels: "Virgin EMI Records",
    website: "https://en.wikipedia.org/wiki/MoStack",
    image:
      "https://imgs.capitalxtra.com/images/56784?crop=16_9&width=660&relax=1&format=webp&signature=uB0atwe05qFk8oA_0bv0KoFcFi8=",
    shortDescription:
      "Montell Samuel Daley, professionelt kendt som MoStack, er en britisk rapper og sanger fra Hornsey i det nordlige London. Efter at have udgivet en række onlinesange og ikke-albumsingler mellem 2014 og 2016, udgav han sit debut-mixtape, High Street Kid den 2. juni 2017; som debuterede som nummer 16 på UK Albums Chart.",
  },
];

(async () => {
  try {
    const rawData = await fs.readFile("data.json");
    artists = JSON.parse(rawData);
    console.log("Artists data loaded successfully.");
  } catch (error) {
    console.error("Error loading artists data:", error);
  }
})();

app.get("/test", (req, res) => {
  res.send("Hello, world!");
});

app.get("/artists", (req, res) => {
  res.json(artists);
});

app.get("/artists/:id", (req, res) => {
  const id = parseInt(req.params.id); // Access the 'id' parameter from the URL
  const artist = artists.find((artist) => artist.id === id); // Find the todo by its 'id'
  res.json(artist); // Send the todo as a JSON response
});

app.post("/test", (req, res) => {
  res.send("Got a POST request");
});

app.post("/artists", (req, res) => {
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  artists.push(newArtist);
  res.json(artists);
  console.log(newArtist);
});

app.put("/test", (req, res) => {
  res.send("Got a PUT request at /test");
});

app.put("/artists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  res.json({ message: `Updated artist with id ${id}`, updatedData });
  console.log(id);
  console.log(updatedData);
});

app.delete("/test", (req, res) => {
  res.send("Got a DELETE request at /test");
});

app.delete("/artists/:id", (req, res) => {
  const artistIdToDelete = parseInt(req.params.id, 10); // Parse the ID from the URL parameter.
  // Find the index of the artist in the array with the matching ID.
  const artistIndexToDelete = artists.findIndex(
    (artist) => artist.id === artistIdToDelete
  );
  // Remove the artist from the array using splice.
  artists.splice(artistIndexToDelete, 1);
  // Respond with a success message or the updated artists array.
  res.json({ message: "Artist deleted successfully", artists });
});

//app.listen(port, () => {
//console.log("Server started on port 3000");
//console.log("http://localhost:3000/artists");
//});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log("http://localhost:3000/artists");
});
