import { Express } from 'express'

export function separateFiles(files: Express.Multer.File[]) {
	if (!files || files.length === 0) {
		return {
			featuredImage: null,
			images: [],
			videos: []
		}
	}

	const separated = {
		featuredImage: null as Express.Multer.File,
		images: [] as Express.Multer.File[],
		videos: [] as Express.Multer.File[]
	}

	files.forEach(file => {
		if (file.fieldname === 'featuredImage') {
			separated.featuredImage = file
		} else if (file.fieldname === 'images') {
			separated.images.push(file)
		} else if (file.fieldname === 'videos') {
			separated.videos.push(file)
		}
	})

	return separated
}

