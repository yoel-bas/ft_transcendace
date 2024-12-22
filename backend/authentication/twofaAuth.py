import pyotp
import qrcode
import os
from urllib.parse import urljoin
from django.conf import settings
import random
import requests
import cloudinary
import cloudinary.uploader
import cloudinary.api
import cloudinary
import cloudinary.uploader
from .host_image import host_qrcode

def twofactorAuth(username):
    key = pyotp.random_base32()
    totp = pyotp.TOTP(key)
    url = totp.provisioning_uri(name=username, issuer_name='ft_transcendence')
    
    # QR code generation
    qrcode_dir = "/app/authentication/qrcodes"
    if not os.path.exists(qrcode_dir):
        os.makedirs(qrcode_dir)
    
    random_number = random.randint(0, 100000)
    num = random_number % 100
    qrcode_path = os.path.join(qrcode_dir, f'{username}_{num}.png')
    qrcode.make(url).save(qrcode_path)

    image_url = host_qrcode(qrcode_path)
    os.remove(qrcode_path)
    return key, image_url

