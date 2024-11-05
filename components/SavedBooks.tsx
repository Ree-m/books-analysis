"use client"
import { Book } from "./BookDetails"
import { useEffect, useState } from "react"
import Link from "next/link"
import BookCard from "./BookCard"
import { FaArrowRightLong } from "react-icons/fa6";
import { z } from "zod";
import { bookSchema } from "@/lib/schemas/book"

export interface Books {
    [key: string]: Book
}
type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];


export default function SavedBooks({ book }: { book?: Book }) {
    const [savedBooks, setSavedBooks] = useState<Books>({});
    const [isClient, setIsClient] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    const booksSchema = z.record(bookSchema)

    useEffect(() => {
        setIsClient(true)
        const booksFromLocalStorage = localStorage.getItem('books')
        if (booksFromLocalStorage) {
            const parsedSavedBooks = booksSchema.safeParse(JSON.parse(booksFromLocalStorage))
            if (parsedSavedBooks.success) {
                setSavedBooks(parsedSavedBooks.data);
            } else {
                setError(`Books validation error:${parsedSavedBooks.error.message}`)
            }
        }
    }, [])

    useEffect(() => {
        if (book) {
            setSavedBooks((prevBooks) => {
                const updatedBooks = { ...prevBooks, [book.id as string]: book };
                localStorage.setItem("books", JSON.stringify(updatedBooks));
                return updatedBooks;
            });
        }
    }, [book]);

    if (!isClient) return null;

    const filteredBooks = (Object.entries(savedBooks) as Entries<typeof savedBooks>)
        .filter(([, value]) => value.id !== book?.id)
        .map(([, value]) => value);

    if (error) {
        return <div className='text-red-500 flex justify-center items-center h-screen'>{error}</div>;
    }


    return filteredBooks.length > 0 ? (
        <div className="mb-10">
            <div className="flex justify-between pt-24 pb-16">
                <div className="flex-1 flex justify-center">
                    <h2 className="text-3xl font-medium text-text dark:text-text-dark relative flex flex-col justify-end z-10 before:absolute before:content-[''] before:opacity-30 before:bg-accent before:dark:bg-accent-dark before:h-[13%] before:w-full before:transform before:-skew-x-12">
                        Recently Viewed
                    </h2>
                </div>
                <Link href="/books/viewed" className="hidden border sm:border-primary dark:border-primary-dark text-primary dark:text-primary-dark sm:flex items-center rounded-lg md:px-4 px-2 md:py-2 py-1 gap-2 md:gap-3 group hover:opacity-90">
                    <span className="text-lg">See all</span>
                    <FaArrowRightLong className="h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    filteredBooks.slice(0, 8).map((book: Book) => (
                        <div key={book.id} className="bg-secondary dark:bg-secondary-dark rounded-lg p-6 bg-opacity-50">
                            <BookCard book={book} />
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-center pt-6">
                <Link href="/books/viewed" className="border border-primary dark:border-primary-dark text-primary dark:text-primary-dark flex sm:hidden items-center rounded-lg px-6 py-2 gap-5 group hover:opacity-90 w-fit">
                    <span className="text-lg">See all</span>
                    <FaArrowRightLong className="h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    ) : null;
}

