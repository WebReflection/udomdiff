var udomdiff=function(e){"use strict";return e.default=(e,i,r,t,f)=>{const l=r.length;let n=i.length,s=l,o=0,a=0,c=null;for(;o<n||a<s;)if(i[o]===r[a])o++,a++;else if(n&&s&&i[n-1]===r[s-1])n--,s--;else if(n===o){const i=s<l?a?t(r[a-1],-0).nextSibling:t(r[s-a],0):f;for(;a<s;)e.insertBefore(t(r[a++],1),i)}else if(s===a)for(;o<n;)e.removeChild(t(i[o++],-1));else{if(n-o==1&&s-a==1){c&&c.has(i[o])?e.insertBefore(t(r[a],1),t(s<l?r[s]:f,0)):e.replaceChild(t(r[a],1),t(i[o],-1));break}if(i[o]===r[s-1]&&r[a]===i[n-1]){const f=t(i[--n],-1).nextSibling;e.insertBefore(t(r[a++],1),t(i[o++],-1).nextSibling),e.insertBefore(t(r[--s],1),f),i[n]=r[s]}else{if(!c){c=new Map;let e=a;for(;e<s;)c.set(r[e],e++)}if(c.has(i[o])){const f=c.get(i[o]);if(a<f&&f<s){let l=o,h=1;for(;++l<n&&l<s&&c.has(i[l])&&c.get(i[l])===f+h;)h++;if(h>f-a){const l=t(i[o],0);for(;a<f;)e.insertBefore(t(r[a++],1),l)}else e.replaceChild(t(r[a++],1),t(i[o++],-1))}else o++}else e.removeChild(t(i[o++],-1))}}return r},e}({}).default;
