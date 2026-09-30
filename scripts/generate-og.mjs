import fs from 'node:fs';
import { deflateSync } from 'node:zlib';

const W=1200,H=630,rgb=Buffer.alloc(W*H*3);
const C={
  navy:[5,24,52], navy2:[8,37,72], navy3:[11,58,95],
  gold:[211,169,73], gold2:[242,210,126],
  white:[248,250,253], muted:[174,191,211],
  blue:[72,155,211], glow:[112,198,235], panel:[8,34,68]
};

function put(x,y,c){if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*3;rgb[i]=c[0];rgb[i+1]=c[1];rgb[i+2]=c[2]}
function blend(x,y,c,a){if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*3;rgb[i]=Math.round(rgb[i]*(1-a)+c[0]*a);rgb[i+1]=Math.round(rgb[i+1]*(1-a)+c[1]*a);rgb[i+2]=Math.round(rgb[i+2]*(1-a)+c[2]*a)}
function rect(x,y,w,h,c,a=1){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)a===1?put(xx,yy,c):blend(xx,yy,c,a)}
function line(x0,y0,x1,y1,c,t=1,a=1){const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let e=dx+dy;while(true){for(let oy=-t;oy<=t;oy++)for(let ox=-t;ox<=t;ox++)a===1?put(x0+ox,y0+oy,c):blend(x0+ox,y0+oy,c,a);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function ellipse(cx,cy,rx,ry,c,a=1){for(let y=cy-ry;y<=cy+ry;y++){const yy=(y-cy)/ry,span=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy)));for(let x=cx-span;x<=cx+span;x++)a===1?put(x,y,c):blend(x,y,c,a)}}
function ellipseOutline(cx,cy,rx,ry,c,t=2,a=1,inner=C.navy2){ellipse(cx,cy,rx,ry,c,a);ellipse(cx,cy,Math.max(1,rx-t),Math.max(1,ry-t),inner,1)}
function roundRect(x,y,w,h,r,c,a=1){rect(x+r,y,w-2*r,h,c,a);rect(x,y+r,w,h-2*r,c,a);ellipse(x+r,y+r,r,r,c,a);ellipse(x+w-r-1,y+r,r,r,c,a);ellipse(x+r,y+h-r-1,r,r,c,a);ellipse(x+w-r-1,y+h-r-1,r,r,c,a)}

const F={
A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['11111','00100','00100','00100','00100','00100','11111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','11011','10001'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],
'0':['01110','10001','10011','10101','11001','10001','01110'],'1':['00100','01100','00100','00100','00100','00100','01110'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110'],
'-':['00000','00000','00000','11111','00000','00000','00000'],' ':['00000','00000','00000','00000','00000','00000','00000']
};
function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function text(s,x,y,scale,c,spacing=1,soft=false){
  let ox=x;
  for(const ch of norm(s)){
    const g=F[ch]||F[' '];
    for(let r=0;r<7;r++)for(let col=0;col<5;col++)if(g[r][col]==='1'){
      const px=ox+col*scale,py=y+r*scale;
      if(soft){
        rect(px-1,py-1,scale+2,scale+2,c,.18);
        rect(px,py,scale,scale,c,1);
      }else rect(px,py,scale,scale,c);
    }
    ox+=(5+spacing)*scale;
  }
}

// Background: premium blue depth, no retro-heavy graphics.
for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const tx=x/W,ty=y/H;
  const right=Math.max(0,(x-720)/480);
  const glow=Math.max(0,1-Math.hypot((x-1010)/440,(y-210)/360));
  const r=Math.round(C.navy[0]*(1-tx)+C.navy2[0]*tx + 8*glow);
  const g=Math.round(C.navy[1]*(1-tx)+C.navy3[1]*tx + 18*glow + 3*ty);
  const b=Math.round(C.navy[2]*(1-tx)+C.navy3[2]*tx + 30*glow + 4*right);
  put(x,y,[Math.min(255,r),Math.min(255,g),Math.min(255,b)]);
}

// Subtle premium lines.
for(let x=0;x<W;x+=72)rect(x,0,1,H,[96,147,190],.055);
for(let y=0;y<H;y+=72)rect(0,y,W,1,[96,147,190],.055);
ellipseOutline(1125,65,300,300,C.gold,3,.28,C.navy3);
ellipseOutline(1125,65,258,258,C.gold2,1,.14,C.navy3);
line(822,-20,690,650,C.gold,3,.62);
line(846,-20,714,650,C.gold2,1,.30);

// SVU identity mark.
roundRect(55,44,365,108,22,[7,31,65],.78);
ellipseOutline(110,98,40,40,C.gold,4,1,[7,31,65]);
ellipse(98,94,9,17,C.gold2); ellipse(122,94,9,17,C.gold2);
line(102,104,110,120,C.gold2,2); line(118,104,110,120,C.gold2,2);
ellipse(110,124,9,6,C.gold2);
text('SOCIEDAD',168,62,4,C.white,1,true);
text('VENEZOLANA',168,92,4,C.white,1,true);
text('DE UROLOGIA',168,122,4,C.white,1,true);

// Status badge.
roundRect(55,178,335,44,20,[9,39,76],.92);
ellipse(79,200,5,5,C.gold2);
text('PROGRAMA ACTUALIZADO',96,188,3,C.gold2,1,true);

// Main title, cleaner hierarchy.
text('XXXVI CONGRESO',55,258,8,C.white,1,true);
text('NACIONAL DE',55,328,7,C.white,1,true);
text('UROLOGIA',55,388,8,C.white,1,true);
text('2026',55,452,10,C.gold2,1,true);

// Date/location card.
roundRect(55,535,660,64,17,[7,30,61],.92);
text('4-7 NOVIEMBRE 2026',82,548,5,C.white,1,true);
text('HOTEL TIBISAY - ISLA DE MARGARITA',82,582,3,C.muted,1,true);

// Right-side clinical illustration, more refined and secondary.
roundRect(855,174,282,335,30,[6,31,62],.48);
ellipseOutline(930,260,54,86,C.glow,2,.60,[7,38,73]);
ellipseOutline(1060,260,54,86,C.glow,2,.60,[7,38,73]);
ellipse(946,258,32,66,[32,112,166],.24);
ellipse(1044,258,32,66,[32,112,166],.24);
line(943,321,978,397,C.gold2,3,.80);
line(1047,321,1012,397,C.gold2,3,.80);
ellipseOutline(995,426,45,34,C.glow,2,.62,[8,44,82]);
line(995,459,995,481,C.gold2,3,.80);
text('CIENCIA',908,520,4,C.gold2,1,true);
text('INNOVACION',879,555,4,C.white,1,true);
text('UROLOGIA',910,590,4,C.white,1,true);

function crc32(buf){let c=0xffffffff;for(const v of buf){c^=v;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1))}return(c^0xffffffff)>>>0}
function chunk(type,data){const t=Buffer.from(type),out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([t,data])),8+data.length);return out}
const stride=W*3,raw=Buffer.alloc((stride+1)*H);
for(let y=0;y<H;y++){const o=y*(stride+1);raw[o]=0;rgb.copy(raw,o+1,y*stride,(y+1)*stride)}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=2;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(new URL('../public/og-congreso-2026-v14.png',import.meta.url),png);
console.log('Generated social preview:',png.length,'bytes');
