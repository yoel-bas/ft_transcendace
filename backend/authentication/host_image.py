import cloudinary
import cloudinary.uploader
import cloudinary.api
import cloudinary
import cloudinary.uploader

cloudinary.config( 
    cloud_name = "dpaaktpyi", 
    api_key = "578992178567154", 
    api_secret = "33SDSYNO7iJsWrNxH5rPCP178QE",
    secure=True
)

def host_qrcode(image_path):
    try:
        response = cloudinary.uploader.upload(image_path)
        image_url = response['secure_url']
        return image_url
    except Exception as e:
        print("Error uploading image to Cloudinary: ", str(e))
        return None