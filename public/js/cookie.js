;(function(root){
  const errMsg = (msg) => { throw new Error(String(msg)) };

  root.setCookie = (c_name, c_val, expireMinutes = 1) => {
    (!c_name || !c_val) && errMsg("param error!");
    const date = new Date();
    date.setTime(date.getTime() + Number(expireMinutes)*60*1000);
    root.document.cookie = c_name+"="+escape(c_val)+";expires="+date.toGMTString();
  };

  root.getCookie = (c_name) => {
    !c_name && errMsg("param error!");
    const patt = new RegExp(";?\\s*"+c_name+"=([^;]*)", "g");
    let res = patt.exec(root.document.cookie);
    return res?unescape(res[1]):null;
  };
})(window);