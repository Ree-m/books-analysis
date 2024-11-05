"use client";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"
import { IoSparklesSharp } from "react-icons/io5";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
} from "@/components/ui/table"
import { z } from "zod"

export interface Book {
    id: string | undefined,
    title: string | undefined,
    author: string | undefined,
    coverArt: string | undefined,
    downloadLink: string | undefined,
    readOnlineLink: string | undefined,
    publishedDate: string | undefined,
    language: string | undefined,
    updatedDate: string | undefined
}

export default function BookDetails({ book }: { book: Book }) {
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isClient, setIsClient] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [hasError, setHasError] = useState<boolean>(false)
    const { toast } = useToast()
    const summarySchema = z.string()

    useEffect(() => {
        setIsClient(true)
        const summary = localStorage.getItem(`summary-${book.id}`);
        if (summary) {
            const parsedSummary = summarySchema.safeParse(summary)
            if (parsedSummary.success) {
                setSummary(parsedSummary.data);
            } else {
                console.log(`Summary validation error:${parsedSummary.error.message}`)
            }
        }
    }, []);

    useEffect(() => {
        if (hasError) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error,
                className: "bg-red-500 text-white",
                duration: 1000000
            });
        }
    }, [hasError, error, toast])

    async function fetchSummary() {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/text-analysis?id=${book.id}`)
            const data = await response.json()
            if (response.ok) {
                setSummary(data.summary);
                localStorage.setItem(`summary-${book.id}`, data.summary);
            }
            else {
                setHasError(true);
                setError(data.error)
            }
        } catch (error: unknown) {
            setHasError(true)
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex-shrink-0">
                <Image src={book.coverArt ? book.coverArt : "https://placehold.jp/30/808080/ffffff/200x300.png?text=placeholder"} className="rounded-lg h-[300px] w-auto" width={200} height={300} alt={`Cover art of ${book.title}`} />
                <div className="flex gap-2 pt-2">
                    <Link href={`https://www.gutenberg.org${book.downloadLink}`} className="text-primary dark:text-primary-dark underline hover:opacity-90">Download</Link>
                    <a target="_blank" href={`https://www.gutenberg.org${book.readOnlineLink}`} rel="noopener noreferrer" className="text-primary dark:text-primary-dark underline hover:opacity-90">Read Online</a>
                </div>
            </div>

            <div className="flex flex-col">
                <div>
                    <h2 className="text-text dark:text-text-dark text-4xl font-semibold">{book.title}</h2>
                    <p className="text-text dark:text-text-dark py-4" aria-live="polite">{summary && summary}</p>
                    <Button
                        onClick={fetchSummary}
                        disabled={isLoading}
                        aria-busy={isLoading}
                        aria-live="polite"
                        aria-label={isLoading ? "Generating summary" : "Generate summary"}
                        className="bg-primary dark:bg-primary-dark text-white flex items-center rounded-lg hover:opacity-90 py-2 px-4"
                    >
                        {isLoading ? (
                            <>
                                <span>Generating summary</span>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            <>
                                <span>Generate summary</span>
                                <IoSparklesSharp className="mr-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                </div>
                <div>
                    <h3 className="text-text dark:text-text-dark text-2xl pb-2 pt-10">About this Book</h3>
                    <Table className="bg-secondary dark:bg-secondary-dark text-text dark:text-text-dark border border-accent border-opacity-60 bg-opacity-30">
                        <TableBody>
                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Author
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.author ? book.author : "Unknown"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Title
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.title ? book.title?.replace(/ by .*$/, '') : "Unknown"}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Language
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.language ? book.language : "Unknown"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Book Number
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.id ? book.id : "Unknown"}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Release Date
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.publishedDate ? book.publishedDate : "Unknown"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border-r border-b border-accent dark:border-accent-dark border-opacity-60">
                                    Most Recently Updated
                                </TableHead>
                                <TableCell className="border-b border-accent dark:border-accent-dark border-opacity-60" colSpan={3}>{book.updatedDate ? book.updatedDate : "Unknown"}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Books are free to download!</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

                </div>

            </div>
        </div >

    )
}
