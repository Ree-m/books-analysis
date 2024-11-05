import { Book } from "./BookDetails"
import Link from "next/link"
import Image from "next/image"

export default function BookCard({ book }: { book: Book }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center">
                <Image src={book.coverArt ? book.coverArt : "https://placehold.jp/30/808080/ffffff/200x300.png?text=placeholder"} className="rounded-lg h-[300px] w-auto" width={200} height={300} alt={`Cover art of ${book.title ? book.title : "Unknown"}`} />
            </div>
            <span className="text-sm text-primary dark:text-primary-dark pt-4">Published on {book.publishedDate ? book.publishedDate : "Unknown"}</span>
            <div className="flex flex-col flex-grow justify-between">
                <h4 className="text-text dark:text-text-dark text-xl py-3">{book.title ? book.title : " Unknown"}</h4>
                <Link href={book.id ? `/books/${book.id}` : "#"}
                    className="py-2 px-4 text-sm rounded-lg bg-primary dark:bg-primary-dark text-white w-fit hover:opacity-90">
                    <span>Details</span>
                </Link>

            </div>
        </div>
    )
}
