// Packs a draw result into a URL fragment. The fragment never reaches any server.
// The XOR is only there so a receiver's name can't be read by glancing at the link.
(function (g) {
  var KEY = "ho-ho-ho-drawsanta";
  function xor(bytes) {
    var out = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ KEY.charCodeAt(i % KEY.length);
    return out;
  }
  function toB64Url(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function fromB64Url(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    var s = atob(str), out = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  g.SantaCodec = {
    encode: function (obj) {
      return toB64Url(xor(new TextEncoder().encode(JSON.stringify(obj))));
    },
    decode: function (str) {
      try { return JSON.parse(new TextDecoder().decode(xor(fromB64Url(str)))); }
      catch (e) { return null; }
    }
  };
})(window);
