import installer from "@ffmpeg-installer/ffmpeg"
import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import { createWriteStream } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { removeFile } from "./utils.js"

const __dirName = dirname(fileURLToPath(import.meta.url))

class OggConverter {
	constructor() {
		ffmpeg.setFfmpegPath(installer.path)
	}

	toMP3(input, output) {
		try {
			const outputPath = resolve(dirname(input), `${output}.mp3`)
			return new Promise((resolve, rejects) => {
				ffmpeg(input)
					.inputOption("-t 30")
					.output(outputPath)
					.on("end", () => {
						removeFile(input)
						resolve(outputPath)
					})
					.on("error", (err) => rejects(err.message))
					.run()
			})
		} catch (e) {
			console.log("Error whole creating mp3", e.message)
		}
	}

	async create(url, fileName) {
		try {
			const oogPath = resolve(__dirName, "../voices", `${fileName}.ogg`)
			const response = await axios({
				method: "get",
				url,
				responseType: "stream",
			})
			return new Promise((resolve) => {
				const stream = createWriteStream(oogPath)
				response.data.pipe(stream)
				stream.on("finish", () => resolve(oogPath))
			})
		} catch (e) {
			console.log("Error whole creating ogg", e.message)
		}
	}
}

export const ogg = new OggConverter()
