"use client"
import BookCard from "@/components/BookCard"
import { useEffect, useState } from "react";
import { z } from "zod"
import { Books } from "@/components/SavedBooks";
import { Book } from "@/components/BookDetails";
import { bookSchema } from "@/lib/schemas/book";

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

export default function Page() {
    const [isClient, setIsClient] = useState<boolean>(false)
    const [books, setBooks] = useState<Books>({})
    const [error, setError] = useState<string | undefined>(undefined)
    const booksSchema = z.record(bookSchema)

    useEffect(() => {
        setIsClient(true)
        const savedBooks = localStorage.getItem('books')
        if (savedBooks) {
            const parsedSavedBooks = booksSchema.safeParse(JSON.parse(savedBooks))
            if (parsedSavedBooks.success) {
                setBooks(parsedSavedBooks.data)
            } else {
                setError(`Books validation error:${parsedSavedBooks.error.message}`)
            }
        }
    }, []);

    const displayedBooks = (Object.entries(books) as Entries<typeof books>)
        .map(([, value]) => value);

    if (!isClient) {
        return null;
    }

    if (error) {
        return <div className='text-red-500 flex justify-center items-center h-screen'>{error}</div>;
    }

    return (
        <div className="px-6 md:px-24">
            <div className="mb-10">
                <div className="flex justify-center pb-16">
                    <h2 className="text-3xl font-medium text-text dark:text-text-dark relative flex flex-col justify-end z-10 before:absolute before:content-[''] before:opacity-30 before:bg-accent before:dark:bg-accent-dark before:h-[13%] before:w-full before:transform before:-skew-x-12">
                        Recently Viewed
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                        displayedBooks.map((book: Book, index: number) => (
                            <div key={index} className="bg-secondary dark:bg-secondary-dark rounded-lg p-6 bg-opacity-50">
                                <BookCard book={book} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}