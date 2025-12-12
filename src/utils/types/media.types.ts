import { ObjectType } from "./object.type"

export type MediaType = {
	images?: ObjectType
	videos?: ObjectType
	remarks?: string
}

export type InternalMediaType = {
	icons?: ObjectType
	images?: ObjectType
}
