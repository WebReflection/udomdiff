var udomdiff=function(e){"use strict";return e.default=function(e,r,i,f,l){for(var n=i.length,t=r.length,s=n,a=0,o=0,v=null;a<t||o<s;)if(r[a]===i[o])a++,o++;else if(t&&s&&r[t-1]===i[s-1])t--,s--;else if(t===a)for(var h=s<n?o?f(i[o-1],-0).nextSibling:f(i[s-o],0):l;o<s;)e.insertBefore(f(i[o++],1),h);else if(s===o)for(;a<t;)e.removeChild(f(r[a++],-1));else{if(t-a==1&&s-o==1){v&&v.has(r[a])?e.insertBefore(f(i[o],1),f(s<n?i[s]:l,0)):e.replaceChild(f(i[o],1),f(r[a],-1));break}if(r[a]===i[s-1]&&i[o]===r[t-1]){var u=f(r[--t],-1).nextSibling;e.insertBefore(f(i[o++],1),f(r[a++],-1).nextSibling),e.insertBefore(f(i[--s],1),u),r[t]=i[s]}else{if(!v){v=new Map;for(var d=o;d<s;)v.set(i[d],d++)}if(v.has(r[a])){var g=v.get(r[a]);if(o<g&&g<s){for(var c=a,B=1;++c<t&&c<s&&v.has(r[c])&&v.get(r[c])===g+B;)B++;if(g-o<B)for(var b=f(r[a],0);o<g;)e.insertBefore(f(i[o++],1),b);else e.replaceChild(f(i[o++],1),f(r[a++],-1))}else a++}else e.removeChild(f(r[a++],-1))}}return i},e}({}).default;