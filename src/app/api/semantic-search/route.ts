import { cosineSimilarity, embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

const movies = [
  {
    id: 1,
    title: "The Matrix",
    description:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    description:
      "A popular concierge and his junior lobby boy embark on a whimsical adventure to prove the concierge's innocence after he is framed for murder.",
  },
  {
    id: 3,
    title: "Hereditary",
    description:
      "After the family matriarch passes away, a grieving family is haunted by tragic and disturbing occurrences, unraveling dark secrets of their ancestry.",
  },
  {
    id: 4,
    title: "Spirited Away",
    description:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
  },
  {
    id: 5,
    title: "Mad Max: Fury Road",
    description:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search of her homeland with the aid of a group of female prisoners and a drifter named Max.",
  },
  {
    id: 6,
    title: "The Wolf of Wall Street",
    description:
      "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
  },
  {
    id: 7,
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
  },
  {
    id: 8,
    title: "Whiplash",
    description:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
  },
  {
    id: 9,
    title: "Parasite",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
  },
  {
    id: 10,
    title: "Spider-Man: Into the Spider-Verse",
    description:
      "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
  },
];
// its alway the right way to embed them once and store in db but for testing we will embed them every time

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query) {
    return Response.json({ error: "query is required" }, { status: 400 });
  }

  try {
    // embed our data
    const { embeddings: movieEmbeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: movies.map((m) => m.description),
      maxParallelCalls: 2,
    });

    // embed the user query
    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    // calculate similarity using cosine similarity ( this can be slow for really large datasets so its better to use vector database for such cases)
    const moviesWithSimilarity = movies.map((movie, index) => {
      const similarity = cosineSimilarity(
        queryEmbedding,
        movieEmbeddings[index],
      );

      return {
        ...movie,
        similarity,
      };
    });

    // sort the movies by similarity in descending order
    moviesWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    const thresHold = 0.4;
    const relevantResults = moviesWithSimilarity.filter(
      (movie) => movie.similarity >= thresHold,
    );

    const topResults = relevantResults.slice(0, 3);

    return Response.json({
      message: "embeddings generated",
      results: topResults,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { error: (error as any)?.messages ?? "Something went wrong" },
      { status: 500 },
    );
  }
}
