import { NextRequest } from "next/server";
import * as cheerio from 'cheerio';
import {
    Document,
    Groq,
    HuggingFaceEmbedding,
    Settings,
    VectorStoreIndex
} from "llamaindex";
import { parsedSettings } from "@/setting";
Settings.llm = new Groq({
    apiKey: parsedSettings.groqApiKey,
});

Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "Xenova/all-mpnet-base-v2",
});


export async function GET(request: NextRequest) {

    const bookId = request.nextUrl.searchParams.get("id")

    if (!bookId) {
        return Response.json("Book Id is required")
    }
    const data = await fetch(`https://www.gutenberg.org/ebooks/${bookId}`)
    const metaText = await data.text()
    const $ = cheerio.load(metaText);
    const bookUrl = $("a[type = 'text/html']").parent().next().text()


    const bookContentResponse = await fetch(bookUrl);
    const bookContent = await bookContentResponse.text();
    const query = `
    You are an expert at summarizing book. Summarize the book in no more than 150  words, focusing on key elements that define the story. Provide an insight into the main plot and the overall theme of the story.
    End the summary with an a good conclusion. Keep the summary concise, without extra details or side plots.
`;

    try {
        const document = new Document({ text: bookContent, id_: `book-${bookId}` });
        const index = await VectorStoreIndex.fromDocuments([document]);
        const retriever = index.asRetriever();
        const queryEngine = index.asQueryEngine({
            retriever,
        });

        const response = await queryEngine.query({
            query: query,
        });

        return Response.json({ summary: response.message.content })

    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: `${error.message}` }, { status: 500 });
        } else {
            return Response.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}


