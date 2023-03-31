define(["exports","./Cartographic-3309dd0d","./when-b60132fc","./Check-7b2a090c","./buildModuleUrl-57a32107","./Math-119be1a3","./Matrix4-cde86d0e"],(function(a,t,e,r,n,i,s){"use strict";var o={};function u(a,t,e){var r=a+t;return i.CesiumMath.sign(a)!==i.CesiumMath.sign(t)&&Math.abs(r/Math.max(Math.abs(a),Math.abs(t)))<e?0:r}o.computeDiscriminant=function(a,t,e){return t*t-4*a*e},o.computeRealRoots=function(a,t,e){var r;if(0===a)return 0===t?[]:[-e/t];if(0===t){if(0===e)return[0,0];var n=Math.abs(e),s=Math.abs(a);if(n<s&&n/s<i.CesiumMath.EPSILON14)return[0,0];if(n>s&&s/n<i.CesiumMath.EPSILON14)return[];if((r=-e/a)<0)return[];var o=Math.sqrt(r);return[-o,o]}if(0===e)return(r=-t/a)<0?[r,0]:[0,r];var C=u(t*t,-(4*a*e),i.CesiumMath.EPSILON14);if(C<0)return[];var c=-.5*u(t,i.CesiumMath.sign(t)*Math.sqrt(C),i.CesiumMath.EPSILON14);return t>0?[c/a,e/c]:[e/c,c/a]};var C={};function c(a,t,e,r){var n,i,s=a,o=t/3,u=e/3,C=r,c=s*u,l=o*C,h=o*o,M=u*u,f=s*u-h,d=s*C-o*u,m=o*C-M,v=4*f*m-d*d;if(v<0){var g,p,w;h*l>=c*M?(g=s,p=f,w=-2*o*f+s*d):(g=C,p=m,w=-C*d+2*u*m);var R=-(w<0?-1:1)*Math.abs(g)*Math.sqrt(-v),S=(i=-w+R)/2,O=S<0?-Math.pow(-S,1/3):Math.pow(S,1/3),x=i===R?-O:-p/O;return n=p<=0?O+x:-w/(O*O+x*x+p),h*l>=c*M?[(n-o)/s]:[-C/(n+u)]}var y=f,P=-2*o*f+s*d,b=m,N=-C*d+2*u*m,q=Math.sqrt(v),L=Math.sqrt(3)/2,I=Math.abs(Math.atan2(s*q,-P)/3);n=2*Math.sqrt(-y);var E=Math.cos(I);i=n*E;var z=n*(-E/2-L*Math.sin(I)),T=i+z>2*o?i-o:z-o,U=s,W=T/U;I=Math.abs(Math.atan2(C*q,-N)/3);var B=-C,V=(i=(n=2*Math.sqrt(-b))*(E=Math.cos(I)))+(z=n*(-E/2-L*Math.sin(I)))<2*u?i+u:z+u,Z=B/V,A=-T*V-U*B,D=(u*A-o*(T*B))/(-o*A+u*(U*V));return W<=D?W<=Z?D<=Z?[W,D,Z]:[W,Z,D]:[Z,W,D]:W<=Z?[D,W,Z]:D<=Z?[D,Z,W]:[Z,D,W]}C.computeDiscriminant=function(a,t,e,r){var n=t*t,i=e*e;return 18*a*t*e*r+n*i-27*(a*a)*(r*r)-4*(a*i*e+n*t*r)},C.computeRealRoots=function(a,t,e,r){var n,i;if(0===a)return o.computeRealRoots(t,e,r);if(0===t){if(0===e){if(0===r)return[0,0,0];var s=(i=-r/a)<0?-Math.pow(-i,1/3):Math.pow(i,1/3);return[s,s,s]}return 0===r?0===(n=o.computeRealRoots(a,0,e)).Length?[0]:[n[0],0,n[1]]:c(a,0,e,r)}return 0===e?0===r?(i=-t/a)<0?[i,0,0]:[0,0,i]:c(a,t,0,r):0===r?0===(n=o.computeRealRoots(a,t,e)).length?[0]:n[1]<=0?[n[0],n[1],0]:n[0]>=0?[0,n[0],n[1]]:[n[0],0,n[1]]:c(a,t,e,r)};var l={};function h(a,t,e,r){var n=a*a,s=t-3*n/8,u=e-t*a/2+n*a/8,c=r-e*a/4+t*n/16-3*n*n/256,l=C.computeRealRoots(1,2*s,s*s-4*c,-u*u);if(l.length>0){var h=-a/4,M=l[l.length-1];if(Math.abs(M)<i.CesiumMath.EPSILON14){var f=o.computeRealRoots(1,s,c);if(2===f.length){var d,m=f[0],v=f[1];if(m>=0&&v>=0){var g=Math.sqrt(m),p=Math.sqrt(v);return[h-p,h-g,h+g,h+p]}if(m>=0&&v<0)return[h-(d=Math.sqrt(m)),h+d];if(m<0&&v>=0)return[h-(d=Math.sqrt(v)),h+d]}return[]}if(M>0){var w=Math.sqrt(M),R=(s+M-u/w)/2,S=(s+M+u/w)/2,O=o.computeRealRoots(1,w,R),x=o.computeRealRoots(1,-w,S);return 0!==O.length?(O[0]+=h,O[1]+=h,0!==x.length?(x[0]+=h,x[1]+=h,O[1]<=x[0]?[O[0],O[1],x[0],x[1]]:x[1]<=O[0]?[x[0],x[1],O[0],O[1]]:O[0]>=x[0]&&O[1]<=x[1]?[x[0],O[0],O[1],x[1]]:x[0]>=O[0]&&x[1]<=O[1]?[O[0],x[0],x[1],O[1]]:O[0]>x[0]&&O[0]<x[1]?[x[0],O[0],x[1],O[1]]:[O[0],x[0],O[1],x[1]]):O):0!==x.length?(x[0]+=h,x[1]+=h,x):[]}}return[]}function M(a,t,e,r){var n=a*a,s=-2*t,u=e*a+t*t-4*r,c=n*r-e*t*a+e*e,l=C.computeRealRoots(1,s,u,c);if(l.length>0){var h,M,f,d,m,v,g=l[0],p=t-g,w=p*p,R=a/2,S=p/2,O=w-4*r,x=w+4*Math.abs(r),y=n-4*g,P=n+4*Math.abs(g);if(g<0||O*P<y*x){var b=Math.sqrt(y);h=b/2,M=0===b?0:(a*S-e)/b}else{var N=Math.sqrt(O);h=0===N?0:(a*S-e)/N,M=N/2}0===R&&0===h?(f=0,d=0):i.CesiumMath.sign(R)===i.CesiumMath.sign(h)?d=g/(f=R+h):f=g/(d=R-h),0===S&&0===M?(m=0,v=0):i.CesiumMath.sign(S)===i.CesiumMath.sign(M)?v=r/(m=S+M):m=r/(v=S-M);var q=o.computeRealRoots(1,f,m),L=o.computeRealRoots(1,d,v);if(0!==q.length)return 0!==L.length?q[1]<=L[0]?[q[0],q[1],L[0],L[1]]:L[1]<=q[0]?[L[0],L[1],q[0],q[1]]:q[0]>=L[0]&&q[1]<=L[1]?[L[0],q[0],q[1],L[1]]:L[0]>=q[0]&&L[1]<=q[1]?[q[0],L[0],L[1],q[1]]:q[0]>L[0]&&q[0]<L[1]?[L[0],q[0],L[1],q[1]]:[q[0],L[0],q[1],L[1]]:q;if(0!==L.length)return L}return[]}function f(a,r){r=t.Cartesian3.clone(e.defaultValue(r,t.Cartesian3.ZERO)),t.Cartesian3.equals(r,t.Cartesian3.ZERO)||t.Cartesian3.normalize(r,r),this.origin=t.Cartesian3.clone(e.defaultValue(a,t.Cartesian3.ZERO)),this.direction=r}l.computeDiscriminant=function(a,t,e,r,n){var i=a*a,s=t*t,o=s*t,u=e*e,C=u*e,c=r*r,l=c*r,h=n*n;return s*u*c-4*o*l-4*a*C*c+18*a*t*e*l-27*i*c*c+256*(i*a)*(h*n)+n*(18*o*e*r-4*s*C+16*a*u*u-80*a*t*u*r-6*a*s*c+144*i*e*c)+h*(144*a*s*e-27*s*s-128*i*u-192*i*t*r)},l.computeRealRoots=function(a,t,e,r,n){if(Math.abs(a)<i.CesiumMath.EPSILON15)return C.computeRealRoots(t,e,r,n);var s=t/a,o=e/a,u=r/a,c=n/a,l=s<0?1:0;switch(l+=o<0?l+1:l,l+=u<0?l+1:l,l+=c<0?l+1:l){case 0:case 3:case 4:case 6:case 7:case 9:case 10:case 12:case 13:case 14:case 15:return h(s,o,u,c);case 1:case 2:case 5:case 8:case 11:return M(s,o,u,c);default:return}},f.clone=function(a,r){if(e.defined(a))return e.defined(r)?(r.origin=t.Cartesian3.clone(a.origin),r.direction=t.Cartesian3.clone(a.direction),r):new f(a.origin,a.direction)},f.getPoint=function(a,r,n){return e.defined(n)||(n=new t.Cartesian3),n=t.Cartesian3.multiplyByScalar(a.direction,r,n),t.Cartesian3.add(a.origin,n,n)};var d={rayPlane:function(a,r,n){e.defined(n)||(n=new t.Cartesian3);var s=a.origin,o=a.direction,u=r.normal,C=t.Cartesian3.dot(u,o);if(!(Math.abs(C)<i.CesiumMath.EPSILON15)){var c=(-r.distance-t.Cartesian3.dot(u,s))/C;if(!(c<0))return n=t.Cartesian3.multiplyByScalar(o,c,n),t.Cartesian3.add(s,n,n)}}},m=new t.Cartesian3,v=new t.Cartesian3,g=new t.Cartesian3,p=new t.Cartesian3,w=new t.Cartesian3;d.rayTriangleParametric=function(a,r,n,s,o){o=e.defaultValue(o,!1);var u,C,c,l,h,M=a.origin,f=a.direction,d=t.Cartesian3.subtract(n,r,m),R=t.Cartesian3.subtract(s,r,v),S=t.Cartesian3.cross(f,R,g),O=t.Cartesian3.dot(d,S);if(o){if(O<i.CesiumMath.EPSILON6)return;if(u=t.Cartesian3.subtract(M,r,p),(c=t.Cartesian3.dot(u,S))<0||c>O)return;if(C=t.Cartesian3.cross(u,d,w),(l=t.Cartesian3.dot(f,C))<0||c+l>O)return;h=t.Cartesian3.dot(R,C)/O}else{if(Math.abs(O)<i.CesiumMath.EPSILON6)return;var x=1/O;if(u=t.Cartesian3.subtract(M,r,p),(c=t.Cartesian3.dot(u,S)*x)<0||c>1)return;if(C=t.Cartesian3.cross(u,d,w),(l=t.Cartesian3.dot(f,C)*x)<0||c+l>1)return;h=t.Cartesian3.dot(R,C)*x}return h},d.rayTriangle=function(a,r,n,i,s,o){var u=d.rayTriangleParametric(a,r,n,i,s);if(e.defined(u)&&!(u<0))return e.defined(o)||(o=new t.Cartesian3),t.Cartesian3.multiplyByScalar(a.direction,u,o),t.Cartesian3.add(a.origin,o,o)};var R=new f;d.lineSegmentTriangle=function(a,r,n,i,s,o,u){var C=R;t.Cartesian3.clone(a,C.origin),t.Cartesian3.subtract(r,a,C.direction),t.Cartesian3.normalize(C.direction,C.direction);var c=d.rayTriangleParametric(C,n,i,s,o);if(!(!e.defined(c)||c<0||c>t.Cartesian3.distance(a,r)))return e.defined(u)||(u=new t.Cartesian3),t.Cartesian3.multiplyByScalar(C.direction,c,u),t.Cartesian3.add(C.origin,u,u)};var S={root0:0,root1:0};function O(a,r,i){e.defined(i)||(i=new n.Interval);var s=a.origin,o=a.direction,u=r.center,C=r.radius*r.radius,c=t.Cartesian3.subtract(s,u,g),l=function(a,t,e,r){var n=t*t-4*a*e;if(!(n<0)){if(n>0){var i=1/(2*a),s=Math.sqrt(n),o=(-t+s)*i,u=(-t-s)*i;return o<u?(r.root0=o,r.root1=u):(r.root0=u,r.root1=o),r}var C=-t/(2*a);if(0!==C)return r.root0=r.root1=C,r}}(t.Cartesian3.dot(o,o),2*t.Cartesian3.dot(o,c),t.Cartesian3.magnitudeSquared(c)-C,S);if(e.defined(l))return i.start=l.root0,i.stop=l.root1,i}d.raySphere=function(a,t,r){if(r=O(a,t,r),e.defined(r)&&!(r.stop<0))return r.start=Math.max(r.start,0),r};var x=new f;d.lineSegmentSphere=function(a,r,n,i){var s=x;t.Cartesian3.clone(a,s.origin);var o=t.Cartesian3.subtract(r,a,s.direction),u=t.Cartesian3.magnitude(o);if(t.Cartesian3.normalize(o,o),i=O(s,n,i),!(!e.defined(i)||i.stop<0||i.start>u))return i.start=Math.max(i.start,0),i.stop=Math.min(i.stop,u),i};var y=new t.Cartesian3,P=new t.Cartesian3;function b(a,t,e){var r=a+t;return i.CesiumMath.sign(a)!==i.CesiumMath.sign(t)&&Math.abs(r/Math.max(Math.abs(a),Math.abs(t)))<e?0:r}d.rayEllipsoid=function(a,e){var r,i,s,o,u,C=e.oneOverRadii,c=t.Cartesian3.multiplyComponents(C,a.origin,y),l=t.Cartesian3.multiplyComponents(C,a.direction,P),h=t.Cartesian3.magnitudeSquared(c),M=t.Cartesian3.dot(c,l);if(h>1){if(M>=0)return;var f=M*M;if(r=h-1,f<(s=(i=t.Cartesian3.magnitudeSquared(l))*r))return;if(f>s){o=M*M-s;var d=(u=-M+Math.sqrt(o))/i,m=r/u;return d<m?new n.Interval(d,m):{start:m,stop:d}}var v=Math.sqrt(r/i);return new n.Interval(v,v)}return h<1?(r=h-1,o=M*M-(s=(i=t.Cartesian3.magnitudeSquared(l))*r),u=-M+Math.sqrt(o),new n.Interval(0,u/i)):M<0?(i=t.Cartesian3.magnitudeSquared(l),new n.Interval(0,-M/i)):void 0};var N=new t.Cartesian3,q=new t.Cartesian3,L=new t.Cartesian3,I=new t.Cartesian3,E=new t.Cartesian3,z=new s.Matrix3,T=new s.Matrix3,U=new s.Matrix3,W=new s.Matrix3,B=new s.Matrix3,V=new s.Matrix3,Z=new s.Matrix3,A=new t.Cartesian3,D=new t.Cartesian3,k=new t.Cartographic;d.grazingAltitudeLocation=function(a,r){var n=a.origin,u=a.direction;if(!t.Cartesian3.equals(n,t.Cartesian3.ZERO)){var C=r.geodeticSurfaceNormal(n,N);if(t.Cartesian3.dot(u,C)>=0)return n}var c=e.defined(this.rayEllipsoid(a,r)),h=r.transformPositionToScaledSpace(u,N),M=t.Cartesian3.normalize(h,h),f=t.Cartesian3.mostOrthogonalAxis(h,I),d=t.Cartesian3.normalize(t.Cartesian3.cross(f,M,q),q),m=t.Cartesian3.normalize(t.Cartesian3.cross(M,d,L),L),v=z;v[0]=M.x,v[1]=M.y,v[2]=M.z,v[3]=d.x,v[4]=d.y,v[5]=d.z,v[6]=m.x,v[7]=m.y,v[8]=m.z;var g=s.Matrix3.transpose(v,T),p=s.Matrix3.fromScale(r.radii,U),w=s.Matrix3.fromScale(r.oneOverRadii,W),R=B;R[0]=0,R[1]=-u.z,R[2]=u.y,R[3]=u.z,R[4]=0,R[5]=-u.x,R[6]=-u.y,R[7]=u.x,R[8]=0;var S,O,x=s.Matrix3.multiply(s.Matrix3.multiply(g,w,V),R,V),y=s.Matrix3.multiply(s.Matrix3.multiply(x,p,Z),v,Z),P=s.Matrix3.multiplyByVector(x,n,E),F=function(a,e,r,n,u){var C,c=n*n,h=u*u,M=(a[s.Matrix3.COLUMN1ROW1]-a[s.Matrix3.COLUMN2ROW2])*h,f=u*(n*b(a[s.Matrix3.COLUMN1ROW0],a[s.Matrix3.COLUMN0ROW1],i.CesiumMath.EPSILON15)+e.y),d=a[s.Matrix3.COLUMN0ROW0]*c+a[s.Matrix3.COLUMN2ROW2]*h+n*e.x+r,m=h*b(a[s.Matrix3.COLUMN2ROW1],a[s.Matrix3.COLUMN1ROW2],i.CesiumMath.EPSILON15),v=u*(n*b(a[s.Matrix3.COLUMN2ROW0],a[s.Matrix3.COLUMN0ROW2])+e.z),g=[];if(0===v&&0===m){if(0===(C=o.computeRealRoots(M,f,d)).length)return g;var p=C[0],w=Math.sqrt(Math.max(1-p*p,0));if(g.push(new t.Cartesian3(n,u*p,u*-w)),g.push(new t.Cartesian3(n,u*p,u*w)),2===C.length){var R=C[1],S=Math.sqrt(Math.max(1-R*R,0));g.push(new t.Cartesian3(n,u*R,u*-S)),g.push(new t.Cartesian3(n,u*R,u*S))}return g}var O=v*v,x=m*m,y=v*m,P=M*M+x,N=2*(f*M+y),q=2*d*M+f*f-x+O,L=2*(d*f-y),I=d*d-O;if(0===P&&0===N&&0===q&&0===L)return g;var E=(C=l.computeRealRoots(P,N,q,L,I)).length;if(0===E)return g;for(var z=0;z<E;++z){var T=C[z],U=T*T,W=Math.max(1-U,0),B=Math.sqrt(W),V=(i.CesiumMath.sign(M)===i.CesiumMath.sign(d)?b(M*U+d,f*T,i.CesiumMath.EPSILON12):i.CesiumMath.sign(d)===i.CesiumMath.sign(f*T)?b(M*U,f*T+d,i.CesiumMath.EPSILON12):b(M*U+f*T,d,i.CesiumMath.EPSILON12))*b(m*T,v,i.CesiumMath.EPSILON15);V<0?g.push(new t.Cartesian3(n,u*T,u*B)):V>0?g.push(new t.Cartesian3(n,u*T,u*-B)):0!==B?(g.push(new t.Cartesian3(n,u*T,u*-B)),g.push(new t.Cartesian3(n,u*T,u*B)),++z):g.push(new t.Cartesian3(n,u*T,u*B))}return g}(y,t.Cartesian3.negate(P,N),0,0,1),G=F.length;if(G>0){for(var Y=t.Cartesian3.clone(t.Cartesian3.ZERO,D),_=Number.NEGATIVE_INFINITY,j=0;j<G;++j){S=s.Matrix3.multiplyByVector(p,s.Matrix3.multiplyByVector(v,F[j],A),A);var H=t.Cartesian3.normalize(t.Cartesian3.subtract(S,n,I),I),J=t.Cartesian3.dot(H,u);J>_&&(_=J,Y=t.Cartesian3.clone(S,Y))}var K=r.cartesianToCartographic(Y,k);return _=i.CesiumMath.clamp(_,0,1),O=t.Cartesian3.magnitude(t.Cartesian3.subtract(Y,n,I))*Math.sqrt(1-_*_),O=c?-O:O,K.height=O,r.cartographicToCartesian(K,new t.Cartesian3)}};var F=new t.Cartesian3;d.lineSegmentPlane=function(a,r,n,s){e.defined(s)||(s=new t.Cartesian3);var o=t.Cartesian3.subtract(r,a,F),u=n.normal,C=t.Cartesian3.dot(u,o);if(!(Math.abs(C)<i.CesiumMath.EPSILON6)){var c=t.Cartesian3.dot(u,a),l=-(n.distance+c)/C;if(!(l<0||l>1))return t.Cartesian3.multiplyByScalar(o,l,s),t.Cartesian3.add(a,s,s),s}},d.trianglePlaneIntersection=function(a,e,r,n){var i,s,o=n.normal,u=n.distance,C=t.Cartesian3.dot(o,a)+u<0,c=t.Cartesian3.dot(o,e)+u<0,l=t.Cartesian3.dot(o,r)+u<0,h=0;if(h+=C?1:0,h+=c?1:0,1!==(h+=l?1:0)&&2!==h||(i=new t.Cartesian3,s=new t.Cartesian3),1===h){if(C)return d.lineSegmentPlane(a,e,n,i),d.lineSegmentPlane(a,r,n,s),{positions:[a,e,r,i,s],indices:[0,3,4,1,2,4,1,4,3]};if(c)return d.lineSegmentPlane(e,r,n,i),d.lineSegmentPlane(e,a,n,s),{positions:[a,e,r,i,s],indices:[1,3,4,2,0,4,2,4,3]};if(l)return d.lineSegmentPlane(r,a,n,i),d.lineSegmentPlane(r,e,n,s),{positions:[a,e,r,i,s],indices:[2,3,4,0,1,4,0,4,3]}}else if(2===h){if(!C)return d.lineSegmentPlane(e,a,n,i),d.lineSegmentPlane(r,a,n,s),{positions:[a,e,r,i,s],indices:[1,2,4,1,4,3,0,3,4]};if(!c)return d.lineSegmentPlane(r,e,n,i),d.lineSegmentPlane(a,e,n,s),{positions:[a,e,r,i,s],indices:[2,0,4,2,4,3,1,3,4]};if(!l)return d.lineSegmentPlane(a,r,n,i),d.lineSegmentPlane(e,r,n,s),{positions:[a,e,r,i,s],indices:[0,1,4,0,4,3,2,3,4]}}},a.IntersectionTests=d,a.Ray=f}));
