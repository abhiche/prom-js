function stripSensitiveData(url) {

  if (url.indexOf('?') > 0) {
    // queryParams
    url = (url.split('?')[0]).trim();
  }

  // Trim trailing slashes
  url = url.replace(/(\/)+$/, '');

  let resourceList = url.split('/');
  for (let i = 0; i < resourceList.length; i++) {
    let token = resourceList[i].trim();
    if (token) {
      // Replace the values with :id
      if (!/^[a-zA-Z\-]+$/.test(token)) {
        url = url.replace(token, ':id');
      }
    }
  }
  return url;
}

module.exports = {
  stripSensitiveData
}