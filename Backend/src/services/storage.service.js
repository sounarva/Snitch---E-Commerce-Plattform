import { config } from "../config/config.js";
import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY
});

const uploadFile = async ({ fileBuffer, fileName, folder = "Snitch" }) => {
    try {
        const result = await client.files.upload({
            file: await ImageKit.toFile(fileBuffer),
            fileName,
            folder
        })
        return result
    } catch (error) {
        console.log(error)
    }
}

export default uploadFile