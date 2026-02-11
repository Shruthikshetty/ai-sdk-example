"use client";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { pokemonSchema } from "@/schemas/pokemon.schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";
import { z } from "zod";

export default function StructuredArrayPage() {
  const [pokemon, setPokemon] = useState("");

  const { stop, submit, isLoading, error, object } = useObject({
    api: "/api/structured-array",
    schema: z.object({
      elements: z.array(pokemonSchema),
    }),
  });

  // function to handle submit
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    submit({ pokemon });
    //clear the input
    setPokemon("");
  };
  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Pokemon Bot</Header>
        {/* pokemon card */}
        <div className="flex flex-col gap-3">
          {object?.elements?.map((pokemon, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-600 rounded-xl p-2 gap-2"
            >
              <h1 className="text-xl font-bold">{pokemon?.name}</h1>
              <h2 className="text-lg font-semibold">Abilities</h2>
              <div className="flex flex-row gap-2">
                {pokemon?.abilities?.map((ability, index) => (
                  <p
                    key={index}
                    className="flex flex-row flex-wrap bg-gray-700 hover:opacity-80 p-2 rounded-xl "
                  >
                    {ability}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Loading */}
      {isLoading ? <Spinner /> : null}
      {/* Error */}
      {error ? <ErrorMessage error={error.message} /> : null}
      <SubmitForm
        prompt={pokemon}
        setPrompt={(e) => setPokemon(e.target.value)}
        stop={stop}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        placeholder="Enter pokemon types"
      />
    </PageLayout>
  );
}
