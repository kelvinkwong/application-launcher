var util = {
    get_query_parameter: function(target, type = 'string') {
        const QueryParams = new URLSearchParams(window.location.search);
        _target = QueryParams.get(target);

        // console.log("Type: " + typeof(_target) + " target: " + _target);
        if (type == 'integer')
            _target = parseInt(_target, 10);
        else if (type == 'float')
            _target = parseFloat(_target);
        else if (type == 'string')
            _target = _target;
        else if (type == 'boolean')
            _target = _target == 'true';
        else if (type == 'base64')
            _target = util.base64Decode(_target)
        else if (type == 'base64url')
            _target = util.base64urlDecode(_target)
        return _target
        // console.log("Type: " + typeof(_target) + " target: " + _target);
    },

    base64Encode: function(string) {
        // https://base64.guru/learn/base64-characters
        return btoa(string);
    },

    base64Decode: function(encodedString) {
        // https://base64.guru/learn/base64-characters
        return atob(encodedString);
    },

    base64urlEncode: function(string){
        // https://base64.guru/standards/base64url
        return util.base64Encode(string).replaceAll('/', '_').replaceAll('+', '-').replaceAll('=','')
    },

    base64urlDecode: function(encodedString){
        // https://base64.guru/standards/base64url
        return util.base64Decode(encodedString.replaceAll('_', '/').replaceAll('-', '+'))
    },

    base64encodeURIComponent: function(string) {
        return btoa(encodeURIComponent(string));
    },

    base64decodeURIComponent: function(encodedString) {
        return decodeURIComponent(atob(encodedString));
    },

    lzstringEncode: function(string){
        return LZString144.compressToEncodedURIComponent(string);
    },

    lzstringDecode: function(encodedString){
        return LZString144.decompressFromEncodedURIComponent(encodedString);
    }
};
