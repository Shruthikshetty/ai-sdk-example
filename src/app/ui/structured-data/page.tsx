"use client";
import ErrorMessage from "@/components/error-message";
import Header from "@/components/header";
import PageLayout from "@/components/page-layout";
import Spinner from "@/components/spinner";
import SubmitForm from "@/components/submit-form";
import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/schemas/recipe.schema";

export default function StructuredDataPage() {
  // store the user entered dish
  const [dish, setDish] = useState("");

  // hook to get the structured data
  const { stop, error, submit, isLoading, object } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  console.log(object);

  // form submit handler
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    submit({
      dish,
    });
    // clear input
    setDish("");
  };

  return (
    <PageLayout>
      <div className="w-full flex-1 flex flex-col overflow-y-auto min-h-0 thin-scroll pr-2">
        <Header>Recipe Bot</Header>
        {/* recipe card */}
        {object ? (
          <div className="flex flex-col gap">
            <h1 className="text-xl font-bold  text-center">
              {object.recipe?.name}
            </h1>
            <h2 className="text-lg font-semibold mb-1">Ingredients</h2>
            <ul className="flex flex-row gap-1 flex-wrap">
              {object?.recipe?.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className="bg-gray-600 rounded-lg p-2 flex flex-col hover:bg-gray-700 transition-colors"
                >
                  <b>{ingredient?.name} </b>
                  {ingredient?.amount}
                </li>
              ))}
            </ul>
            <h2 className="text-lg font-semibold mt-2 mb-1">Steps</h2>
            <ol className="flex flex-col gap-2 bg-gray-600 rounded-lg p-2">
              {object?.recipe?.steps?.map((step, index) => (
                <li key={index}>
                  <b>{index + 1}.</b> {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
      {/* Loading */}
      {isLoading ? <Spinner /> : null}
      {/* Error */}
      {error ? <ErrorMessage error={error.message} /> : null}
      <SubmitForm
        prompt={dish}
        setPrompt={(e) => setDish(e.target.value)}
        stop={stop}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        placeholder="Enter dish name"
      />
    </PageLayout>
  );
}
