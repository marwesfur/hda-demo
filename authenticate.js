window.AUTH = (function() {
  var CLIENT_ID = 'assistant';
  var STORAGE_KEY = 'hda-cas-token';
  var STORAGE_KEY_HASH = 'hda-hash-saver';
  var CAS_LOGOUT_URL;
  var initialize = function(url) {
    var CAS_BASE_URL = url;
    var CAS_AUTHORIZE_URL = CAS_BASE_URL + '/oauth2.0/authorize';
    CAS_LOGOUT_URL = url + '/logout';

    var storedToken = sessionStorage.getItem(STORAGE_KEY);
    var newToken;
    var hashParameters = window.location.hash.slice(1).split('&');
    for (var i = 0; i < hashParameters.length; i++) {
      var parts = hashParameters[i].split('=');
      if (parts[0] === 'access_token') {
        newToken = parts[1];
        break;
      }
    }

    if (newToken) {
      sessionStorage.setItem(STORAGE_KEY, newToken);
      var newLocation = window.location.href.split('#')[0];
      var savedHash = sessionStorage.getItem(STORAGE_KEY_HASH);
      if (savedHash) {
        sessionStorage.removeItem(STORAGE_KEY_HASH);
        newLocation += '#' + savedHash;
      }
      window.location.replace(newLocation);
    } else if (!storedToken) {
      var hashSplit = window.location.href.split('#');
      var redirectUri = encodeURIComponent(hashSplit[0]);
      var hash = hashSplit.slice(1).join('#');
      if (hashSplit.length > 1) {
        sessionStorage.setItem(STORAGE_KEY_HASH, hash);
      }
      var url =
        CAS_AUTHORIZE_URL +
        '?response_type=token&client_id=' +
        CLIENT_ID +
        '&redirect_uri=' +
        redirectUri;
      window.location.replace(url);
    }
  };

  return {
    init: initialize,
    getAccessToken: function() {
      return sessionStorage.getItem(STORAGE_KEY);
    },
    logout: function() {
      sessionStorage.removeItem(STORAGE_KEY);
      //redirect to login page after logout
      var redirectUri = encodeURIComponent(window.location.href.split('#')[0]);
      window.location.replace(CAS_LOGOUT_URL + '?service=' + redirectUri);
    }
  };
})();
