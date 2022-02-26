import{S as L,M as _,a as A,L as E,B as k,b as I,c as H,m as g,d as y,V as m,e as G,P as O,W,C}from"./vendor.01f1a7af.js";const D=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(e){if(e.ep)return;e.ep=!0;const s=i(e);fetch(e.href,s)}};D();const q=Symbol("Star"),tt=Symbol("Planet"),V=Symbol("DwarfPlanet"),R=Symbol("Asteroid"),j=Symbol("Commet");var o=2e9,x;const z=667408e-16,S=400;function T(r){return r*Math.PI/180}class et{constructor(t,i,a,e,s,n,f,c,M,d,w,v,b,l,u){this.name=i,this.mass=n,this.bodyType=e,this.color=b,this.parent=a,this.radius=s,this.a=f,this.i=T(c),this.e=M,this.timeOfPeriapsis=d,this.raan=T(w),this.w=T(v),this.lastScale=-1,this.children=[],this.parent!==null&&this.parent.children.push(this);var h=.66;if(this.bodyType===q&&(h=1),(this.bodyType===R||this.bodyType===j)&&(h=.4),this.bodyType===V&&(h=.5),this.markerGeometry=new L(h,16,8),this.markerMaterial=new _({color:this.color}),this.markerMesh=new A(this.markerGeometry,this.markerMaterial),t.add(this.markerMesh),this.realGeometry=new L(1,32,16),this.realMaterial=new _({color:this.color,wireframe:!0}),this.realMesh=new A(this.realGeometry,this.realMaterial),t.add(this.realMesh),this.label=document.createElement("a"),this.label.style.position="absolute",this.label.style.fontSize=h*2+"rem",this.label.className="spaceLabel",this.label.innerHTML=this.name,l==null&&u||(u||(this.label.target="blank"),this.label.href="https://en.wikipedia.org/w/index.php?search="+this.name+"&title=Special%3ASearch&go=Go&ns0=1",l!==void 0&&(this.label.href=l)),document.getElementById("spaceText").appendChild(this.label),this.parent!=null){this.orbitMaterial=new E({color:this.color}),this.orbitGeometry=new k;const B=new Float32Array(S*3+3);this.orbitGeometry.setAttribute("position",new I(B,3)),this.orbit=new H(this.orbitGeometry,this.orbitMaterial),t.add(this.orbit),this.orbitPoints=[];for(var p=0;p<2*Math.PI;p+=2*Math.PI/S)this.orbitPoints.push(this.stateVector(p))}}get mu(){return this.parent===null?0:z*this.parent.mass}get h(){return Math.sqrt(this.mu*this.a*(1-Math.pow(this.e,2)))}get T(){return 2*Math.PI*Math.sqrt(Math.pow(this.a,3)/this.mu)}get QxX(){return g([[-Math.sin(this.raan)*Math.cos(this.i)*Math.sin(this.w)+Math.cos(this.raan)*Math.cos(this.w),-Math.sin(this.raan)*Math.cos(this.i)*Math.cos(this.w)-Math.cos(this.raan)*Math.sin(this.w),Math.sin(this.raan)*Math.sin(this.i)],[Math.cos(this.raan)*Math.cos(this.i)*Math.sin(this.w)+Math.sin(this.raan)*Math.cos(this.w),Math.cos(this.raan)*Math.cos(this.i)*Math.cos(this.w)-Math.sin(this.raan)*Math.sin(this.w),-Math.cos(this.raan)*Math.sin(this.i)],[Math.sin(this.i)*Math.sin(this.w),Math.sin(this.i)*Math.cos(this.w),Math.cos(this.i)]])}trueAnom(t){t=(t-this.timeOfPeriapsis)%this.T;let i;if(this.e===0)i=Math.PI*2/this.T*t;else{let a=t*2*Math.PI/this.T,e=Number.MAX_VALUE,s=a;for(;Math.abs(s-e)>.01;)e=s,s=s-(s-this.e*Math.sin(s)-a)/(1-this.e*Math.cos(s));i=2*Math.atan(Math.sqrt(1+this.e)/Math.sqrt(1-this.e)*Math.tan(s/2))}return i}stateVector(t){if(this.parent==null)return[0,0,0,0,0,0];let i=this.QxX,a=g([[Math.cos(t)],[Math.sin(t)],[0]]);a=y(Math.pow(this.h,2)/this.mu/(1+this.e*Math.cos(t)),a),a=y(i,a);let e=g([[-Math.sin(t)],[this.e+Math.cos(t)],[0]]);return e=y(this.mu/this.h,e),e=y(i,e),[a._data[0],a._data[1],a._data[2],e._data[0],e._data[1],e._data[2]]}transform(t,i){var t=P(t),a=P(x.stateVector(x.trueAnom(i)));return t.equals(a)?new m(0,0,0):(t.multiplyScalar(1/o),t.clone())}getOffset(t){var i;return this.parent!=null?(i=P(this.parent.stateVector(this.parent.trueAnom(t))),i.add(this.parent.getOffset(t))):i=new m(0,0,0),i}drawOrbit(){if(this.parent==null)return;const t=this.orbit.geometry.attributes.position.array;let i=this.timeOfPeriapsis,a,e=0;this.orbitPoints.forEach(s=>{a=this.transform(s,i).toArray(),t[e++]=a[0],t[e++]=a[1],t[e++]=a[2],i+=this.T/S}),t[e++]=t[0],t[e++]=t[1],t[e++]=t[2],this.orbit.geometry.attributes.position.needsUpdate=!0}update(t,i){var a=60;this.radius/o;var e=this.transform(this.stateVector(this.trueAnom(t)),t),s=X(e,i);this.a/o<2&&this.a!==0?(this.markerMesh.visible=!1,this.realMesh.visible=!1,this.label.style.visibility="hidden",typeof this.orbit!="undefined"&&(this.orbit.visible=!1)):(this.markerMesh.visible=!0,this.realMesh.visible=!1,typeof this.orbit!="undefined"&&(this.orbit.visible=!0,this.lastScale!=o&&(this.drawOrbit(),this.lastScale=o)),this.markerMesh.position.copy(e),s.x>a&&s.x<window.innerWidth-a&&s.y>a&&s.y<window.innerHeight-a&&this.a/o>4&&this.a!==0?(this.label.style.visibility="visible",this.label.style.left=s.x+10+"px",this.label.style.top=s.y-20+"px"):this.label.style.visibility="hidden"),this.children.forEach(n=>{n!==null&&n.update(t,i)})}}function N(r){x=r}function F(r){o=r}function X(r,t){var i=r.clone().project(t);return i.x=(i.x+1)/2*window.innerWidth,i.y=-(i.y-1)/2*window.innerHeight,i}function P(r){return new m(r[0],r[2],r[1])}function it(r){return new Date(r+" 00:00:00").getTime()/1e3}var Q="/assets/space_ft.eb93c15c.png",U="/assets/space_bk.9ec66f0b.png",Y="/assets/space_up.11da0299.png",K="/assets/space_dn.b13ad2bf.png",$="/assets/space_rt.af571e8b.png",J="/assets/space_lf.64160502.png";function st(){const r=new G,t=new O(90,window.innerWidth/window.innerHeight,.1,1e6),i=new W({canvas:document.querySelector("#space")});i.setPixelRatio(window.devicePixelRatio),i.setSize(window.innerWidth,window.innerHeight),t.position.set(0,40,20),t.lookAt(new m(0,0,0)),t.updateMatrixWorld();const e=new C().load([Q,U,Y,K,$,J]);return r.background=e,{scene:r,renderer:i,camera:t}}function at(r,t,i,a,e,s,n){var f=Date.now(),c=e,M=f,d=0;function w(){requestAnimationFrame(w),f+=(Date.now()-M)*c,M=Date.now(),t.camera.position.set(30*Math.sin(d),40*Math.cos(d),30*Math.cos(d)),t.camera.lookAt(new m(0,0,0)),t.camera.updateMatrixWorld(),d+=25e-5,r.update(f,t.camera),t.renderer.render(t.scene,t.camera)}window.addEventListener("resize",v,!1);function v(){t.camera.aspect=window.innerWidth/window.innerHeight,t.camera.updateProjectionMatrix(),t.renderer.setSize(window.innerWidth,window.innerHeight)}function b(p){F(Math.pow(window.scrollY,2)*s+a),c=e+Math.pow(window.scrollY/n,2),document.getElementById("scaleText").innerHTML="Distance Scale: x1/"+Math.round(o).toLocaleString()+"<br/>Time Scale: x"+Math.round(c*1e3).toLocaleString()}b(),N(r),document.getElementById("simtitle").innerHTML=i,document.addEventListener("scroll",b),document.getElementById("scaleText").innerHTML="Distance Scale: x1/"+Math.round(o).toLocaleString()+"<br/>Time Scale: x"+Math.round(c*1e3).toLocaleString();var l=!1,u=document.getElementById("hide"),h=document.getElementById("content");u.addEventListener("click",function(p){l?(u.innerHTML="Hide Content",h.style.visibility="visible"):(u.innerHTML="Show Content",h.style.visibility="hidden"),l=!l}),w()}export{R as A,et as B,j as C,V as D,tt as P,st as S,q as a,at as b,it as d};
