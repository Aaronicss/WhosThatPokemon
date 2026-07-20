const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: "https://whos-that-pokemon-murex.vercel.app/" }));

/* Generate 4 random integers and create an array */
app.get("/api/quiz", async (req, res) => {
  const pokemonFirstGen = 151;
  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < 4) {
    const num = Math.floor(Math.random() * pokemonFirstGen) + 1;
    uniqueNumbers.add(num);
  }
  const idArray = Array.from(uniqueNumbers);
  console.log("Generated IDs:", idArray);

  /* After creating the ID arrays, create a promise then fetch the data */

  const pokemonPromises = idArray.map((id) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
  );

  /* Wait for all the data to be fetched */

  const pokemonData = await Promise.all(pokemonPromises);

  console.log("First Pokemon Name:", pokemonData[0].name);

  const options = pokemonData.map((p) => {
    const cleanName = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    return { id: p.id, name: cleanName };
  });

  const correctPokemon = pokemonData[Math.floor(Math.random() * 4)];

  res.json({
    image: correctPokemon.sprites.other["official-artwork"].front_default,
    correctId: correctPokemon.id,
    options: options,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
