import * as cheerio from 'cheerio';
import SavedBooks from '@/components/SavedBooks';
import BookDetails from '@/components/BookDetails';
import { z } from "zod"

export const bookSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    publishedDate: z.string(),
    coverArt: z.string(),
    downloadLink: z.string(),
    readOnlineLink: z.string(),
    language: z.string(),
    updatedDate: z.string()
})

async function fetchBookData(id: string) {
    let metaText
    try {
        const response = await fetch(`https://www.gutenberg.org/ebooks/${id}`)
        if (!response.ok) {
            return { data: null, error: 'Book data not found' }
        }
        metaText = await response.text()

    } catch (error) {
        return { data: null, error: `Error:${error}` };
    }
    const $ = cheerio.load(metaText);
    const title = $("h1[itemprop='name']").text() || undefined;
    const author = $("a[itemprop='creator']").text() || undefined;
    const publishedDate = $("td[itemprop='datePublished']").text() || undefined;
    const coverArt = $("img.cover-art").attr("src") || undefined;
    const downloadLink = $("a[type='application/zip']").attr("href") || undefined;
    const readOnlineLink = $("a[type='text/html']").attr("href") || undefined;
    const language = $("tr[itemprop='inLanguage'] td").text() || undefined;
    const updatedDate = $("td[itemprop='dateModified']").text() || undefined;

    const bookData = {
        id,
        title: title,
        author: author,
        publishedDate: publishedDate,
        coverArt: coverArt,
        downloadLink: downloadLink,
        readOnlineLink: readOnlineLink,
        language: language,
        updatedDate: updatedDate
    }

    const validatedBookData = bookSchema.safeParse(bookData)

    if (!validatedBookData.success) {
        return { data: null, error: `Validation error:${validatedBookData.error.message}` };
    }
    return { data: validatedBookData.data, error: null }
}


export default async function BookPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const { data, error } = await fetchBookData(id)

    if (error) {
        return <div className='text-red-500 flex justify-center items-center h-screen'>{error}</div>;
    }

    if (data) {
        return (
            <div className='px-6 md:px-24'>
                <BookDetails book={data} />
                <SavedBooks book={data} />
            </div>
        )

    }

}