document.querySelector('.file-uploader form label[for=image]').onclick = ()=> {
	document.querySelector('.file-uploader form input[name=image]').click();
}

document.querySelector('.file-uploader form input[name=image]').onchange = function(e) {
	let selectedFile = e.target.files[0];
	let fileReader = new FileReader();

	fileReader.onload = function(e) {
		document.querySelector('.file-uploader .preview-area img').src = e.target.result;	
		document.querySelector('.file-uploader form input[name=b64image]').value = e.target.result;
	}
	fileReader.readAsDataURL(selectedFile);

}


document.querySelector('.file-uploader i.fa.fa-times').onclick = ()=> {
	document.querySelector('.file-uploader').style.display = 'none';
	document.querySelector('.file-uploader form input[name=image]').type = 'text';
	document.querySelector('.file-uploader form input[name=image]').type = 'image';
	document.querySelector('.file-uploader .preview-area img').src = '';	

}