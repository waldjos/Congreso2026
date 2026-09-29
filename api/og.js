import { deflateSync } from 'node:zlib';

const W = 1200;
const H = 630;

const FONT = {
  A:['01110','10001','10001','11111','10001','10001','10001'],
  B:['11110','10001','10001','11110','10001','10001','11110'],
  C:['01111','10000','10000','10000','10000','10000','01111'],
  D:['11110','10001','10001','10001','10001','10001','11110'],
  E:['11111','10000','10000','11110','10000','10000','11111'],
  F:['11111','10000','10000','11110','10000','10000','10000'],
  G:['01111','10000','10000','10111','10001','10001','01111'],
  H:['10001','10001','10001','11111','10001','10001','10001'],
  I:['11111','00100','00100','00100','00100','00100','11111'],
  J:['00111','00010','00010','00010','10010','10010','01100'],
  K:['10001','10010','10100','11000','10100','10010','10001'],
  L:['10000','10000','10000','10000','10000','10000','11111'],
  M:['10001','11011','10101','10101','10001','10001','10001'],
  N:['10001','11001','10101','10011','10001','10001','10001'],
  O:['01110','10001','10001','10001','10001','10001','01110'],
  P:['11110','10001','10001','11110','10000','10000','10000'],
  Q:['01110','10001','10001','10001','10101','10010','01101'],
  R:['11110','10001','10001','11110','10100','10010','10001'],
  S:['01111','10000','10000','01110','00001','00001','11110'],
  T:['11111','00100','00100','00100','00100','00100','00100'],
  U:['10001','10001','10001','10001','10001','10001','01110'],
  V:['10001','10001','10001','10001','10001','01010','00100'],
  W:['10001','10001','10001','10101','10101','11011','10001'],
  X:['10001','10001','01010','00100','01010','10001','10001'],
  Y:['10001','10001','01010','00100','00100','00100','00100'],
  Z:['11111','00001','00010','00100','01000','10000','11111'],
  '0':['01110','10001','10011','10101','11001','10001','01110'],
  '1':['00100','01100','00100','00100','00100','00100','01110'],
  '2':['01110','10001','00001','00010','00100','01000','11111'],
  '3':['11110','00001','00001','01110','00001','00001','11110'],
  '4':['00010','00110','01010','10010','11111','00010','00010'],
  '5':['11111','10000','10000','11110','00001','00001','11110'],
  '6':['01110','10000','10000','11110','10001','10001','01110'],
  '7':['11111','00001','00010','00100','01000','01000','01000'],
  '8':['01110','10001','10001','01110','10001','10001','01110'],
  '9':['01110','10001','10001','01111','00001','00001','01110'],
  '-':['00000','00000','00000','11111','00000','00000','00000'],
  '.':['00000','00000','00000','00000','00000','00110','00110'],
  ' ':['00000','00000','00000','00000','00000','00000','00000'],
};

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  t.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([t, data])), 8 + data.length);
  return out;
}

function pngFromRgb(rgb) {
  const stride = W * 3;
  const raw = Buffer.alloc((stride + 1) * H);
  for (let y = 0; y < H; y++) {
    const dst = y * (stride + 1);
    raw[dst] = 0;
    rgb.copy(raw, dst + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 7 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeImage() {
  const rgb = Buffer.alloc(W * H * 3);
  const put = (x,y,r,g,b) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    rgb[i]=r; rgb[i+1]=g; rgb[i+2]=b;
  };
  const rect = (x,y,w,h,c) => {
    for (let yy=y; yy<y+h; yy++) for (let xx=x; xx<x+w; xx++) put(xx,yy,...c);
  };
  const circle = (cx,cy,rad,c,thick=1) => {
    const r2=rad*rad, r1=(rad-thick)*(rad-thick);
    for(let y=Math.max(0,cy-rad); y<Math.min(H,cy+rad+1); y++){
      for(let x=Math.max(0,cx-rad); x<Math.min(W,cx+rad+1); x++){
        const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);
        if(d<=r2 && d>=r1) put(x,y,...c);
      }
    }
  };
  const drawText = (text,x,y,scale,c,spacing=1) => {
    let ox=x;
    for(const raw of text.toUpperCase()){
      const ch = raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const glyph=FONT[ch] || FONT[' '];
      for(let row=0; row<7; row++){
        for(let col=0; col<5; col++){
          if(glyph[row][col]==='1') rect(ox+col*scale,y+row*scale,scale,scale,c);
        }
      }
      ox += 5*scale + spacing*scale;
    }
  };

  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const tx=x/W, ty=y/H;
      let r=7 + Math.floor(7*tx);
      let g=26 + Math.floor(25*tx) + Math.floor(4*ty);
      let b=56 + Math.floor(35*tx) + Math.floor(5*ty);
      const dx=x-1000, dy=y-110, d=Math.sqrt(dx*dx+dy*dy);
      if(d<380){
        const a=(380-d)/380;
        r+=Math.floor(10*a); g+=Math.floor(24*a); b+=Math.floor(38*a);
      }
      put(x,y,Math.min(255,r),Math.min(255,g),Math.min(255,b));
    }
  }

  for(let x=0;x<W;x+=48) for(let y=0;y<H;y++) {
    const i=(y*W+x)*3; rgb[i]+=3; rgb[i+1]+=3; rgb[i+2]+=4;
  }
  for(let y=0;y<H;y+=48) for(let x=0;x<W;x++) {
    const i=(y*W+x)*3; rgb[i]+=3; rgb[i+1]+=3; rgb[i+2]+=4;
  }

  const GOLD=[217,182,95], WHITE=[246,248,252], MUTED=[167,183,205], PANEL=[11,37,76];

  circle(90,78,44,GOLD,4);
  drawText('SVU',62,65,4,GOLD,1);
  drawText('SOCIEDAD VENEZOLANA DE UROLOGIA',160,54,4,WHITE,1);

  rect(58,150,330,46,PANEL);
  rect(58,150,330,2,GOLD);
  rect(58,194,330,2,GOLD);
  drawText('PROGRAMA ACTUALIZADO',78,164,3,GOLD,1);

  drawText('XXXVI CONGRESO',58,236,8,WHITE,1);
  drawText('NACIONAL DE UROLOGIA',58,310,7,WHITE,1);
  drawText('2026',58,382,10,GOLD,1);

  rect(58,500,650,62,PANEL);
  drawText('4-7 NOVIEMBRE 2026',82,516,5,WHITE,1);
  drawText('HOTEL TIBISAY - ISLA DE MARGARITA',58,580,3,MUTED,1);

  rect(870,175,270,320,[8,31,66]);
  rect(870,175,3,320,GOLD);
  drawText('CIENCIA',925,230,5,GOLD,1);
  drawText('INNOVACION',900,292,5,WHITE,1);
  drawText('UROLOGIA',915,354,5,WHITE,1);
  rect(920,420,160,2,GOLD);
  drawText('MARGARITA',908,448,4,GOLD,1);

  return pngFromRgb(rgb);
}

export default function handler(req, res) {
  try {
    const png = makeImage();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', String(png.length));
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(png);
  } catch {
    res.status(500).send('Unable to generate image');
  }
}
