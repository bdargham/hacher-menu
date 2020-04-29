
// (C) Copyright 2020 Basheer Dargham.

sha256=(input)=>{
	var len=8*input.length;

	// convert array of bytes into array of 32-bit integers
    var m=[];for(var i=0;i<len;i+=8)m[i>>5]|=(input[i/8]&255)<< (24 - i%32);
    var addmod32=(a,b)=>a+(b>>>0)

	// Init array function returning 8 or 64 integers as defined in spec
	var init=v=>[...Array(310>>v)].reduce((a,p,x)=>(p=(c,n)=>c==n?a.push((n**(1/(2+!v))%1*(16**8)|0)>>>0):n%c?p(++c,n):0,p(2,x+2),a),[])

    var R  = (X, n) => ( X >>> n );
    var S  = (X, n) => ( X >>> n ) | (X << (32 - n));
    var Maj = (x, y, z) => ((x & y) ^ (x & z) ^ (y & z));

    var fnfn = (a,b,c)=>x=>S(x,a)^S(x,b)^((a&1)?R:S)(x,c);
    var sig0 = fnfn(2,13,22);
    var sig1 = fnfn(6,11,25);
    var gam0 = fnfn(7,18,3);
    var gam1 = fnfn(17,19,10);

	var [hash,K,W]=[4,0,0].map(init);

	m[len >> 5] |= 0x80 << (24 - len % 32);
	m[((len + 64 >> 9) << 4) + 15] = len;

	for (var i=0;i<m.length;i+=16) {
		var [a,b,c,d,e,f,g,h]=hash;
		W.forEach((_,j)=>{
			W[j]=j<16?m[j+i]:addmod32(addmod32(addmod32(gam1(W[j-2]), W[j-7]),gam0(W[j-15])),W[j-16]);
			var T1 = addmod32(addmod32(addmod32(addmod32(h, sig1(e)), ((e & f) ^ ((~e) & g))), K[j]), W[j]);
			var T2 = addmod32(sig0(a), Maj(a, b, c));
			h=g;g=f;f=e;
			e=addmod32(d,T1);
			d=c;c=b;b=a;
			a=addmod32(T1,T2);
		});

		hash=[a,b,c,d,e,f,g,h].map((aval,i)=>addmod32(aval,hash[i]));
	}
	return hash.map(x=>(1e7+(x>>>0).toString(16)).slice(-8)).join('');
};

 // console.log(sha256(new TextEncoder().encode('Hello, world!')));