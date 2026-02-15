import ImageKit from "imagekit";
import env from "../../../env";

// configure image kit
export const uploadImage = async (image: string) => {
  const imagekit = new ImageKit({
    urlEndpoint: env.NEXT_PUBLIC_IMAGE_KIT_URL,
    publicKey: env.NEXT_PUBLIC_IMAGE_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
  });

  const response = await imagekit.upload({
    file: image,
    fileName: "generated_image.jpg",
    folder: "ai-sdk-example",
  });

  return response.url;
};
