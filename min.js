var udomdiff=(e=>(e.default=function(e,r,i,f,l){for(var n=i.length,t=r.length,o=n,s=0,a=0,v=null;s<t||a<o;)if(t===s)for(var d=o<n?a?f(i[a-1],-0).nextSibling:f(i[o],0):l;a<o;)e.insertBefore(f(i[a++],1),d);else if(o===a)for(;s<t;)v&&v.has(r[s])||e.removeChild(f(r[s],-1)),s++;else if(r[s]===i[a])s++,a++;else if(r[t-1]===i[o-1])t--,o--;else if(r[s]===i[o-1]&&i[a]===r[t-1]){var g=f(r[--t],-1).nextSibling;e.insertBefore(f(i[a++],1),f(r[s++],-1).nextSibling),e.insertBefore(f(i[--o],1),g),r[t]=i[o]}else{if(!v)for(var v=new Map,h=a;h<o;)v.set(i[h],h++);if(v.has(r[s])){var u=v.get(r[s]);if(a<u&&u<o){for(var b=s,B=1;++b<t&&b<o&&v.get(r[b])===u+B;)B++;if(u-a<B)for(var c=f(r[s],0);a<u;)e.insertBefore(f(i[a++],1),c);else e.replaceChild(f(i[a++],1),f(r[s++],-1))}else s++}else e.removeChild(f(r[s++],-1))}return i},Object.defineProperty(e,"__esModule",{value:!0}),e))({}).default;