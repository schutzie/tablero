import * as z from "zod";
import { MetadataSchema } from "../helpers/metadata";
import { Position } from "../helpers/enums";
import { PersonSchema } from "./person";

const PlayerSchema = z
  .object({
    id: z.string(),
    personId: z.string().optional(),
    firstName: z.string(), // Matthew
    lastName: z.string(), // Schutz
    preferredFirstName: z.string().optional(), // Matt
    teamId: z.string().optional(),

    preferredJerseyNumber: z.string(),
    positions: z.array(z.enum(Position)),
    height: z.number().positive().optional(), // in cm
    weight: z.number().positive().optional(), // in kg
    dateOfBirth: z.date().optional(),
    photoUri: z.string().optional(),

    // Contact & Location
    email: z.email().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().default("USA"),
    language: z.string().default("EN"),
    parentGuardians: z.array(PersonSchema).optional(),

    //   skillLevel: z.nativeEnum(SkillLevel).default(SkillLevel.INTERMEDIATE),
    dominantHand: z.enum(["left", "right", "ambidextrous"]).optional(),
  })
  .transform((data) => ({
    ...data,
    firstLastName: `${data.firstName} ${data.lastName}`, // Matthew Schutz
    lastFirstName: `${data.lastName}, ${data.firstName}`, // Schutz, Matthew
    preferredFirstLastName: `${data.preferredFirstName ? data.preferredFirstName : data.firstName} ${data.lastName}`, // Matt Schutz
    preferredLastFirstName: `${data.firstName}, (${data.preferredFirstName ? data.preferredFirstName : data.firstName}`, // Schutz, Matthew
    firstLastInitialName: `${data.preferredFirstName ? data.preferredFirstName : data.firstName}. ${data.lastName.substring(0, 1)}`, // Matt S.
    lastFirstInitialName: `${data.lastName} ${(data.preferredFirstName ? data.preferredFirstName : data.firstName).substring(0, 1)}.`, // Schutz M.
  }));

export type Player = z.infer<typeof PlayerSchema>;
export type PlayerPartial = Partial<Player>;
