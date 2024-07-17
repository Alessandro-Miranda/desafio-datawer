import { z } from "zod";

const profissionalSchema = z.object({
    id: z.number(),
    nome: z.string(),
    email: z.string(),
    telefone: z.string(),
    especialidade: z.string(),
    isNew: z.optional(z.boolean()),
})

export {profissionalSchema}