var udomdiff=function(e){"use strict";return e.default=(e,t,i,l,r)=>{const f=i.length;let n=t.length,s=f,o=0,c=0,u=null;for(;o<n||c<s;)if(n===o){const t=s<f?c?l(i[c-1],-0).nextSibling:l(i[s],0):r;for(;c<s;)e.insertBefore(l(i[c++],1),t)}else if(s===c)for(;o<n;)u&&u.has(t[o])||e.removeChild(l(t[o],-1)),o++;else if(t[o]===i[c])o++,c++;else if(t[n-1]===i[s-1])n--,s--;else if(t[o]===i[s-1]&&i[c]===t[n-1]){const r=l(t[--n],-1).nextSibling;e.insertBefore(l(i[c++],1),l(t[o++],-1).nextSibling),e.insertBefore(l(i[--s],1),r),t[n]=i[s]}else{if(!u){u=new Map;let e=c;for(;e<s;)u.set(i[e],e++)}if(u.has(t[o])){const r=u.get(t[o]);if(c<r&&r<s){let f=o,d=1;for(;++f<n&&f<s&&u.get(t[f])===r+d;)d++;if(d>r-c){const f=l(t[o],0);for(;c<r;)e.insertBefore(l(i[c++],1),f)}else e.replaceChild(l(i[c++],1),l(t[o++],-1))}else o++}else e.removeChild(l(t[o++],-1))}return i},Object.defineProperty(e,"__esModule",{value:!0}),e}({}).default;
