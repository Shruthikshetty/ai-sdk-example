**token** :- basic unit of text that the model processes

> https://platform.openai.com/tokenizer
> tokens determine how model can process at once
> it effect cost and every models have a max context window

**context window** :- max number of tokens model can process at once

> example gpt-4.1-nano can process 1 million tokens at once (roughly 2,500 - 3000 pages of text)

> if we exceed the token limit the model will not be able to process the request (we will have to delete the older messages)

> **Embedding** :- it is a way to represent text in a numerical format (vector) that the model can understand
> store the meaning of the text in the form of numbers

**Vector Database** :- it is a database that is designed to store and search for vectors

**RAG (Retrieval-Augmented Generation)** :- you can store your documents as embeddings , find the most relevant one for users questions and pass it to the model
