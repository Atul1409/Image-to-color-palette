from app import app
from flask import render_template, request, redirect, url_for, session, send_file
from PIL import Image
from io import BytesIO
from random import randint


@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


@app.route('/generate-palette', methods=['POST'])
def generate_palette():
	image = request.files['image']
	b64image = request.form.get('b64image')
	image = Image.open(image)
	image = image.convert('P', palette=Image.ADAPTIVE, colors = 16)
	image_palette = image.getpalette()
	image_colors = sorted(image.getcolors())[::-1]
	color_palette = []
	for i in range(16):
		dominant_color = image_palette[image_colors[i][1] * 3 : image_colors[i][1] * 3 + 3]
		color_palette.append('rgb({},{},{})'.format(dominant_color[0], dominant_color[1], dominant_color[2]))
	return render_template('palette.html',image = b64image, palette = color_palette)

