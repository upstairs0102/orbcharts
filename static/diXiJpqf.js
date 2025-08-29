import"./DR9_mXdV.js";import{b as l,B as p,a as m,V as u,G as x}from"./DrhgplwB.js";import{S as d,B as h,d as w,L as g,D as _,G as f,e as A}from"./Bn-Tjf_C.js";import{G as b}from"./BQPWTI05.js";import G from"./fFN4KK-3.js";import{e as $,f as B,o as L,c as k}from"./DmW0GBEG.js";import"./D_lgk1xP.js";import"./DiLAK10b.js";import"./g9kqi5aX.js";import"./DzUFsZE_.js";import"./5i4WpBDy.js";const v={id:"chart",style:{width:"100%",height:"100vh"}},z=$({__name:"index.client",setup(y){return B(()=>{const s=document.querySelector("#chart"),e=new l(s,{});new p,new d,new h;const o=new w,i=new g,c=new _,a=new m,r=new f;r.params$.next({}),a.params$.next({tickFullLine:!0});const n=new u;n.params$.next({}),new A,e.dataFormatter$.next({groupAxis:{scalePadding:0,label:"xxx"},valueAxis:{label:"yyy"},rowLabels:["a"],columnLabels:[`test1
test1`,`test2
test2`,`test3
test3`,`test4
test4`,`test5
test5`],visibleFilter:(t,S)=>t.id!=="grid_0_0_4",separateSeries:!0}),e.chartParams$.subscribe(t=>{console.log(t)}),e.chartParams$.next({highlightTarget:"group"}),e.plugins$.next([a,n,r,o,i,c,new b,new x]),e.data$.next(G)}),(s,e)=>(L(),k("div",v))}});export{z as default};
