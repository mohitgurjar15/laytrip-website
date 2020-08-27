
export function validateImageFile(name: String) {

    let allowed_extensions = ['jpg','jpeg','png'];
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (allowed_extensions.lastIndexOf(ext.toLowerCase()) !== -1)
    {
      return true;
    }
    else {
        return false;
    }
}

export function fileSizeValidator(file) {

    var size = Math.floor(file.size/1000);
      if(size <= 2000){
        return true;
      }
      else{
        return false;
      }
  }
  