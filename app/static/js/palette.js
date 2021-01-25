let grid = document.querySelectorAll('.palette-data .palette .colors .color')

grid.forEach(el => {
	let color = el.getAttribute('data-color');
	el.style.background = color;
})

grid.forEach(el => {
	el.onclick = function() {
		GeneratePalette(this.getAttribute('data-color'))
	}
})

document.querySelectorAll('main.content .palette-data .color-data .data .values p i').forEach(el => {
	el.onclick = function() {
		navigator.clipboard.writeText(this.parentNode.querySelector('span').innerText).then(function() {
	    console.log('Async: Copying to clipboard was successful!');
	    // swal("Copied", el.querySelector('.details .hex').innerText + " copied to clipboard", "success");
	  }, function(err) {
	    console.error('Async: Could not copy text: ', err);
	  });
		}
})


document.querySelector('main.content .palette-data .palette .controls button.upload').onclick = ()=> {
	document.querySelector('.file-uploader').style.display = 'flex';
}

document.querySelector('main.content .palette-data .palette .controls button.export').onclick = ()=> {
	document.querySelector('.file-saver').style.display = 'flex';
}

document.querySelector('.file-saver i.fa.fa-times').onclick = ()=> {
	document.querySelector('.file-saver').style.display = 'none';
}

document.querySelectorAll('main.content .file-saver form span').forEach(el => {
	el.onclick = function() {
		document.querySelectorAll('main.content .file-saver form span').forEach(el => {
			if (el.classList.contains('selected')){
				el.classList.remove('selected')
			};
		});
		this.classList.add('selected');
	}
})

document.querySelector('main.content .file-saver form').onsubmit = (e)=> {
	e.preventDefault();
	let colorFormat = document.querySelector('main.content .file-saver form span.selected').innerText;
	let filename = document.querySelector('main.content .file-saver form input[name=filename]').value;
	let canvas = document.createElement('CANVAS');
	let ctx = canvas.getContext('2d');
	canvas.height = 400;
	canvas.width = 400;
	canvas.style.border = '1px solid #000';
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillRect(0, 0, canvas.height, canvas.width);
	let ml = 0;
	let mt = 0;
	for (let i = 0; i < grid.length; i++) {
		ctx.fillStyle = grid[i].getAttribute('data-color');
		ml += 100;
		ml = (i === 0 || i === 4 || i === 8 || i === 12) ? 0 : ml; 
		mt += (i === 4 || i === 8 || i === 12 ) ? 100 : 0;
		ctx.fillRect(ml, mt, 100, 100);
		rgb = grid[i].getAttribute('data-color').split("(")[1].split(")")[0].split(',')
		let r = parseInt(rgb[0]),
			g = parseInt(rgb[1]),
			b = parseInt(rgb[2]);
		ctx.fillStyle = 'rgb(0, 0, 0)';
		if (r < 100 && g < 100 && b < 100) {
			ctx.fillStyle = 'rgb(255, 255, 255)';
		}
		ctx.font = '17px Sans';
		if (colorFormat == 'HEX') {
			ctx.fillText(RGBtoHEX(grid[i].getAttribute('data-color')), ml, mt+50);
		} else if ( colorFormat == 'RGB' ) {
			ctx.fillText(grid[i].getAttribute('data-color'), ml, mt+50);
		} else if ( colorFormat == 'HSL' ) {
			ctx.fillText(RGBtoHSL(grid[i].getAttribute('data-color')), ml, mt+50);
		} else {
			let cmyk = RGBtoCMYK(grid[i].getAttribute('data-color'))
			cmyk = cmyk.split("(")[1].split(")")[0]
			ctx.fillText(cmyk, ml, mt+50);
		}
	}

	canvas.toBlob(function(blob) {
		saveAs(blob, `${filename}.png`);
	}, 'image/png');
}



const GeneratePalette = RGBstring => {
	let shades = document.querySelectorAll('main.content .palette-data .color-data .data .palette div.brightness .color');
	shades.forEach(el => {
		el.remove();
	})
	document.querySelector('main.content .palette-data .color-data .color').style.background = RGBstring;
 	document.querySelector('main.content .palette-data .color-data .data .values p.rgb span').innerText = RGBstring;
 	document.querySelector('main.content .palette-data .color-data .data .values p.hex span').innerText = RGBtoHEX(RGBstring);
 	let hsl = RGBtoHSL(RGBstring);
 	document.querySelector('main.content .palette-data .color-data .data .values p.hsl span').innerText = `hsl(${hsl[0]}, ${hsl[1]}, ${hsl[2]})`;
 	document.querySelector('main.content .palette-data .color-data .data .values p.cmyk span').innerText = RGBtoCMYK(RGBstring);
 	let factors = [4/16, 7/16, 10/16, 13/16, 16/16, 16/16, 13/16, 10/16, 7/16, 4/16]

 	for (let i = 0; i < factors.length; i++) {
 		let color = (i <= 4) ? lighten(RGBstring, factors[i]) : brighten(RGBstring, factors[i]);
 		color = HSLtoRGB(color);
 		let palette_item = document.createElement('DIV');
 		palette_item.className = 'color';
 		palette_item.style.background = color;
 		palette_item.setAttribute('data-color', color);
 		palette_item.onclick = function() {GeneratePalette(this.getAttribute('data-color'))}
 		document.querySelector('main.content .palette-data .color-data .data .palette div.brightness').appendChild(palette_item)
 	}	
}



const RGBtoHEX = rgb => {
	rgb = rgb.split("(")[1].split(")")[0].split(',')
	let hex = ('#' + (parseInt(rgb[0]) + 0x10000).toString(16).substr(-2)
					    + (parseInt(rgb[1])  + 0x10000).toString(16).substr(-2)
					    + (parseInt(rgb[2])  + 0x10000).toString(16).substr(-2)
					    ).toUpperCase();
	return hex
}

const RGBtoHSL = rgb => {
	rgb = rgb.split("(")[1].split(")")[0].split(',')
	let r = parseInt(rgb[0]),
		g = parseInt(rgb[1]),
		b = parseInt(rgb[2]);
	r /= 255;
  	g /= 255;
 	b /= 255;
 	let hsl = new Array();
  	let cmin = Math.min(r,g,b),
      	cmax = Math.max(r,g,b),
      	delta = cmax - cmin,
      	h = 0,
      	s = 0,
      	l = 0;

  	if (delta == 0)
    	h = 0;
  	else if (cmax == r)
    	h = ((g - b) / delta) % 6;
	else if (cmax == g)
		h = (b - r) / delta + 2;
	else
	    h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0)
	    h += 360;

	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	hsl.push(Math.round(h));
	hsl.push(Math.round(s));
	hsl.push(Math.round(l));

	return hsl;
}


const RGBtoCMYK = rgb => {
	rgb = rgb.split("(")[1].split(")")[0].split(',')
	let r = parseInt(rgb[0]) / 255,
		g = parseInt(rgb[1]) / 255,
		b = parseInt(rgb[2]) / 255;

    let c, m, y, k;
  	max = Math.max(r, g, b);
  	k = 1 - max;
  	if (k == 1) {
    	c = 0;
	    m = 0;
	    y = 0;
	  } else {
	    c = (1 - r - k) / (1 - k);
	    m = (1 - g - k) / (1 - k);
	    y = (1 - b - k) / (1 - k);
	}	
    return `cmyk(${Math.round(c * 100)}, ${Math.round(m * 100)}, ${Math.round(y * 100)}, ${Math.round(k * 100)})`;
}

const lighten = (rgb, factor) => {
    let hsl = RGBtoHSL(rgb);
	let h = hsl[0],
		s = hsl[1],
		l = hsl[2];
   l = Math.max(Math.min(l * factor, 100), 0);
   return [h,s,l];
}

const brighten = (rgb, factor) => {
    let hsl = RGBtoHSL(rgb);
	let h = hsl[0],
		s = hsl[1],
		l = hsl[2];
   l = 100 - Math.max(Math.min((100 - l) * factor, 100), 0);
   return [h,s,l];
}

const HSLtoRGB = hsl => {
	let h = hsl[0],
		s = hsl[1],
		l = hsl[2];
	s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    if (0 <= h && h < 60) {
	    r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
	    r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
	    r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
	    r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
	    r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
	    r = c; g = 0; b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return `rgb(${r}, ${g}, ${b})` ;
}