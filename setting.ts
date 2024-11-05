import { z } from "zod"

const settings = z.object({
    groqApiKey: z.string().min(1,{message:"API key is required."})
})

export const parsedSettings = settings.parse({
    groqApiKey:  process.env["GROQ_API_KEY"]
})