# hacher-menu
Minimal-sized Javascript hash function implementations, namely SHA2

The focus of this implementation is to be as small as possible, while being correct, and not leaking any global variables. Runtime performance is secondary.

## Size

To illustrate how small the minimized Javascript source code is, the following simply defines 2 of the constants used to initialize a SHA-256 hasher. This code alone takes, when minimized, 787 bytes:

```javascript
var k=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],m=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];
```

The entire SHA-256 hasher (minimized, but not compressed) takes the same size (786), save 1 byte:

```javascript
sha256=r=>{for(var a=8*r.length,e=[],h=0;h<a;h+=8)e[h>>5]|=(255&r[h/8])<<24-h%32;var n=(r,a)=>r+(a>>>0),o=(r,a)=>r>>>a,t=(r,a)=>r>>>a|r<<32-a,p=(r,a,e)=>h=>t(h,r)^t(h,a)^(1&r?o:t)(h,e),v=p(2,13,22),c=p(6,11,25),f=p(7,18,3),g=p(17,19,10),[i,l,m]=[4,0,0].map(r=>[...Array(310>>r)].reduce((a,e,h)=>((e=(h,n)=>h==n?a.push((n**(1/(2+!r))%1*16**8|0)>>>0):n%h?e(++h,n):0)(2,h+2),a),[]));e[a>>5]|=128<<24-a%32,e[15+(a+64>>9<<4)]=a;for(h=0;h<e.length;h+=16){var[s,u,d,j,y,A,E,S]=i;m.forEach((r,a)=>{m[a]=a<16?e[a+h]:n(n(n(g(m[a-2]),m[a-7]),f(m[a-15])),m[a-16]);var o,t,p,i=n(n(n(n(S,c(y)),y&A^~y&E),l[a]),m[a]),b=n(v(s),(o=s)&(t=u)^o&(p=d)^t&p);S=E,E=A,A=y,y=n(j,i),j=d,d=u,u=s,s=n(i,b)}),i=[s,u,d,j,y,A,E,S].map((r,a)=>n(r,i[a]))}return i.map(r=>(1e7+(r>>>0).toString(16)).slice(-8)).join("")};
```

## Usage

To hash a function, simply pass the `sha256` function an `Array` of bytes or a `Uint8array`:

```javascript
let input1 = [1,2,3];
let hash1 = sha256(input1);

let input2 = await fetch("filename").then(r=>r.arrayBuffer()).then(b=>new Uint8Array(b));
let hash2 = sha256(input2);
```

For Strings, use a `TextDecoder`

```javascript
let input = "The quick brown fox jumps over the lazy dog";
// Assuming UTF-8 encoding
let hash = sha256(new TextEncoder().encode(input));
```