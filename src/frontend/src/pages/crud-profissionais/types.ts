import { z } from "zod";
import { profissionalSchema } from "./zodSchemas";

type Profissional = z.infer<typeof profissionalSchema>

export type {Profissional}