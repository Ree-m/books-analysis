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

