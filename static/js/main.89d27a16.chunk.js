(this["webpackJsonppathway-builder"]=this["webpackJsonppathway-builder"]||[]).push([[0],{107:function(e,t,a){e.exports={node:"Node_node__38uoJ",icon:"Node_icon__354W4",actionable:"Node_actionable__bHXKd",expandedNode:"Node_expandedNode__1ar-A",childNotActionable:"Node_childNotActionable__1bfBq",childActionable:"Node_childActionable__SwUjD"}},108:function(e,t,a){e.exports={missingDataPopup:"MissingDataPopup_missingDataPopup__A-EBJ",popupContent:"MissingDataPopup_popupContent__24BvC",popupTrigger:"MissingDataPopup_popupTrigger__11eAy",popupChoice:"MissingDataPopup_popupChoice__5oEld",selected:"MissingDataPopup_selected__20Or7",footer:"MissingDataPopup_footer__1wJXm",externalLink:"MissingDataPopup_externalLink__3oYt-"}},166:function(e,t,a){e.exports={infoTable:"ExpandedNode_infoTable__3v2tx",descTitle:"ExpandedNode_descTitle__15ki8",desc:"ExpandedNode_desc__3Xdkf",externalLink:"ExpandedNode_externalLink__1Mr1x",defaultTextButton:"ExpandedNode_defaultTextButton__2Bvq6",commentsForm:"ExpandedNode_commentsForm__3Q20Y",footer:"ExpandedNode_footer__FOCYI",comments:"ExpandedNode_comments__9q-JW"}},213:function(e,t,a){"use strict";(function(e){var n=a(35),r=a(422),o=a(423),c=new(function(){function t(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object(r.a)(this,t),this.config=e.CONFIG?Object(n.a)({},e.CONFIG,{},a):Object(n.a)({},a)}return Object(o.a)(t,[{key:"get",value:function(e,t){var a=e.split("."),n=this.config,r=null;for(var o in a){n=r=n[a[o]]}return r||t}},{key:"add",value:function(e){e&&(this.config=Object(n.a)({},this.config,{},e))}}]),t}());t.a=c}).call(this,a(68))},216:function(e,t,a){e.exports={logo:"Header_logo__3T0lc",homeLink:"Header_homeLink__2ew4r"}},282:function(e,t,a){e.exports={root:"Loading_root__3b6qy"}},288:function(e,t,a){e.exports={arrow:"Arrow_arrow__3TM91",arrowhead:"Arrow_arrowhead__3XjQ0"}},289:function(e,t,a){e.exports={display:"Builder_display__23HzN",graph:"Builder_graph__lF-uJ"}},32:function(e,t,a){e.exports={sidebarContainer:"Sidebar_sidebarContainer__3IS0-",sidebarToggle:"Sidebar_sidebarToggle__2OC3L",sidebar:"Sidebar_sidebar__3qUkX",header:"Sidebar_header__2SFYN",nodeName:"Sidebar_nodeName__3ow6C",icon:"Sidebar_icon__vghqV",back:"Sidebar_back__a1oXX",nodeSettings:"Sidebar_nodeSettings__mx65c",addNodesContainer:"Sidebar_addNodesContainer__25qXW",button:"Sidebar_button__tmvcR",description:"Sidebar_description__3buTg"}},421:function(e,t,a){e.exports=a.p+"static/media/camino-logo-dark.c8fc712a.png"},425:function(e,t,a){e.exports={dropdown:"DropDown_dropdown__1KvCw"}},426:function(e,t,a){e.exports={pathwayPopup:"PathwayPopup_pathwayPopup__2moYb"}},435:function(e,t,a){e.exports={root:"Graph_root__1SJOc"}},455:function(e,t,a){e.exports=a(860)},859:function(e,t,a){},860:function(e,t,a){"use strict";a.r(t);a(456),a(465);var n=a(0),r=a.n(n),o=a(20),c=a.n(o),i=a(74),l=a(105),u=a(25),d=a(15),s=a(11),m=a(438),p=a(917),f=a(895),b=a(35),h=a(437),v=a(280),g=a.n(v),E={spacing:{globalPadding:"2em"}},y={white:"#fff",black:"#222",blue:"#5d89a1",red:"#d95d77",gray:"#4a4a4a",grayMedium:"#bbbdc0",grayBlue:"#cbd5df",grayLighter:"#eaeef2",grayDark:"#444",green:"#2fa874"},O={fontFamily:"'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"},_={MuiButton:{root:{borderRadius:0},label:{fontWeight:600},iconSizeMedium:{"& > *:first-child":{fontSize:14}},iconSizeSmall:{"& > *:first-child":{fontSize:14}}},MuiTableHead:{root:{backgroundColor:y.grayLighter}},MuiTableCell:{root:{fontSize:"1em"},head:{padding:"5px 16px",borderBottom:"none"}},MuiFormControl:{root:{margin:"10px 0"}},MuiFormLabel:{root:{fontStyle:"italic"}},MuiInputBase:{root:{fontWeight:600,"&:hover":{}}},MuiOutlinedInput:{root:{borderRadius:"0"}},MuiSelect:{icon:{fontSize:"2em"}},MuiPaper:{rounded:{borderRadius:"0"}},MuiDialogTitle:{root:{padding:"1em"}},MuiDialogContent:{root:{padding:"0 4em"}},MuiDialogActions:{root:{padding:"2em 4em"}}},j={MuiFormControl:{root:{"&:hover":{borderColor:y.white}}},MuiFormLabel:{root:{color:y.white,"&$focused":{color:y.white}}},MuiInputBase:{root:{color:y.white,"&:hover":{borderColor:y.white,backgroundColor:y.grayDark}}},MuiOutlinedInput:{root:{"&:hover":{borderColor:y.white},"&:hover $notchedOutline":{borderColor:y.white},"&$focused $notchedOutline":{borderColor:y.white}},notchedOutline:{borderColor:y.white}},MuiSelect:{icon:{color:y.white}}},N={primary:{main:y.blue},secondary:{main:y.red},common:y,background:{default:y.grayLighter},text:{primary:y.gray,secondary:y.gray},grey:{800:"#4a4a4a"}},k=Object(h.a)({typography:Object(b.a)({},O),palette:Object(b.a)({},N),overrides:Object(b.a)({},_),variables:Object(b.a)({},E)}),w=Object(h.a)({typography:Object(b.a)({},O),palette:Object(b.a)({},N),overrides:g()(_,j),variables:Object(b.a)({},E)}),C=Object(h.a)({typography:Object(b.a)({},O),palette:g()(N,{background:{default:y.grayBlue},text:{primary:y.black,secondary:y.black}}),overrides:Object(b.a)({},_),variables:Object(b.a)({},E)}),x=function(e){var t=e.theme;if(e.useProjector)switch(t){case"dark":return w;default:return C}switch(t){case"dark":return w;default:return k}},S=Object(n.createContext)({}),P=Object(n.memo)((function(e){var t=e.theme,a=void 0===t?"light":t,o=e.children,c=Object(n.useState)(!1),i=Object(u.a)(c,2),l=i[0],d=i[1],s=x({theme:a,useProjector:l}),m=Object(n.useCallback)((function(){d((function(e){return!e}))}),[]);return r.a.createElement(f.a,{theme:s},r.a.createElement(S.Provider,{value:{useProjector:l,toggleTheme:m}},o))})),B=a(421),M=a.n(B),A=a(216),T=a.n(A),z=Object(n.memo)((function(){var e=Object(n.useState)(null),t=Object(u.a)(e,2),a=t[0],o=t[1],c=Object(n.useContext)(S).toggleTheme,l=Object(n.useCallback)((function(e){o(e.currentTarget)}),[]),f=Object(n.useCallback)((function(){o(null)}),[]),b=Object(n.useCallback)((function(){c(),f()}),[c,f]);return r.a.createElement("header",{className:T.a.header},r.a.createElement(i.b,{to:"/",className:T.a.homeLink},r.a.createElement("img",{src:M.a,alt:"logo",className:T.a.logo})),r.a.createElement("button",{onClick:l,"aria-controls":"options-menu","aria-haspopup":"true"},r.a.createElement(d.a,{icon:s.f})),r.a.createElement(m.a,{id:"options-menu",anchorEl:a,keepMounted:!0,open:Boolean(a),onClose:f},r.a.createElement(p.a,{onClick:b},"Toggle Theme")))})),I=a(906),D=a(439),R=a(213);var L=function(e){var t=Object(n.useState)({status:"loading"}),a=Object(u.a)(t,2),r=a[0],o=a[1];return Object(n.useEffect)((function(){(function(e){return fetch(e,{headers:{Accept:"application/json"}})})(e).then((function(e){return e.json()})).then((function(t){return t.map((function(t){return function(e,t){return fetch(e,t).then((function(e){return e.json()}))}(e+"/"+t)}))})).then((function(e){return Promise.all(e)})).then((function(e){return o({status:"loaded",payload:e})})).catch((function(e){return o({status:"error",error:e})}))}),[e]),r},F=Object(n.createContext)({}),W=Object(n.memo)((function(e){var t=e.children,a=Object(n.useState)([]),o=Object(u.a)(a,2),c=o[0],i=o[1],l=L(R.a.get("demoPathwaysService")),d=l.payload,s=Object(n.useCallback)((function(e){i((function(t){return[].concat(Object(D.a)(t),[e])}))}),[]),m=Object(n.useCallback)((function(e){}),[]);switch(Object(n.useEffect)((function(){d&&i(d)}),[d]),l.status){case"error":return r.a.createElement("div",null,"Error loading pathways");default:return r.a.createElement(F.Provider,{value:{pathways:c,addPathway:s,deletePathway:m,status:l.status}},t)}})),H=function(){return Object(n.useContext)(F)},U=a(282),G=a.n(U),q=Object(n.memo)((function(){return r.a.createElement("div",{className:G.a.root},r.a.createElement(d.a,{icon:s.n,className:G.a.root,size:"4x",spin:!0}))})),X=a(900),J=a(901),Y=a(902),$=a(903),V=a(904),K=a(905),Q=a(899),Z=Object(Q.a)((function(e){return{root:{display:"flex",flexDirection:"column",padding:e.variables.spacing.globalPadding},createPathwayButton:{alignSelf:"flex-end"},pathwayList:{marginTop:"2em"},editButton:{marginRight:"1em"},dialogCloseButton:{float:"right",width:"45px"}}}),{name:"PathwaysList"}),ee=Object(n.memo)((function(){var e=Z(),t=H(),a=t.pathways,n=t.deletePathway;return r.a.createElement(X.a,{className:e.pathwayList},r.a.createElement(J.a,{"aria-label":"pathway list"},r.a.createElement(Y.a,null,r.a.createElement($.a,null,r.a.createElement(V.a,null,"Pathway Name"),r.a.createElement(V.a,null,"Status"),r.a.createElement(V.a,null,"Last Updated"),r.a.createElement(V.a,null))),r.a.createElement(K.a,null,a.map((function(t){return r.a.createElement($.a,{key:t.id},r.a.createElement(V.a,{component:"th",scope:"row"},t.name),r.a.createElement(V.a,null,"draft"),r.a.createElement(V.a,null,"2 days ago"),r.a.createElement(V.a,{align:"right"},r.a.createElement(I.a,{className:e.editButton,color:"primary",size:"small",startIcon:r.a.createElement(d.a,{icon:s.g}),component:i.b,to:"/builder/".concat(encodeURIComponent(t.id))},"Edit"),r.a.createElement(I.a,{color:"secondary",size:"small",startIcon:r.a.createElement(d.a,{icon:s.r}),onClick:function(){return n(t)}},"Delete")))})))))})),te=a(916),ae=a(918),ne=a(907),re=a(908),oe=a(919),ce=a(912),ie=a(424),le=a.n(ie),ue=Object(n.memo)((function(e){var t=e.open,a=e.onClose,o=Z(),c=Object(l.g)(),i=Object(n.useRef)(null),u=Object(n.useRef)(null),m=H().addPathway,p=Object(n.useCallback)((function(e){c.push("/builder/".concat(encodeURIComponent(e),"/node/Start")),a()}),[c,a]),f=Object(n.useCallback)((function(e){var t,a,n,r;e.preventDefault();var o=le.a.generate();m({id:o,name:null!==(t=null===(a=i.current)||void 0===a?void 0:a.value)&&void 0!==t?t:"",description:null!==(n=null===(r=u.current)||void 0===r?void 0:r.value)&&void 0!==n?n:"",library:"",criteria:[],states:{Start:{label:"Start",transitions:[]}}}),p(o)}),[m,p]);return r.a.createElement(te.a,{open:t,onClose:a,"aria-labelledby":"create-pathway",fullWidth:!0,maxWidth:"md"},r.a.createElement(ae.a,{disableTypography:!0},r.a.createElement(ne.a,{"aria-label":"close",onClick:a,className:o.dialogCloseButton},r.a.createElement(d.a,{icon:s.p}))),r.a.createElement("form",{onSubmit:f},r.a.createElement(re.a,null,r.a.createElement(oe.a,{variant:"outlined",autoFocus:!0,label:"Pathway Name",fullWidth:!0,required:!0,inputRef:i}),r.a.createElement(oe.a,{variant:"outlined",label:"Pathway Description",fullWidth:!0,inputRef:u})),r.a.createElement(ce.a,null,r.a.createElement(I.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l}),type:"submit"},"Create"))))})),de=Object(n.memo)((function(){var e=Z(),t=Object(n.useState)(!1),a=Object(u.a)(t,2),o=a[0],c=a[1],i=H().status,l=Object(n.useCallback)((function(){c(!0)}),[]),m=Object(n.useCallback)((function(){c(!1)}),[]);return r.a.createElement("div",{className:e.root},r.a.createElement(I.a,{className:e.createPathwayButton,variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l}),onClick:l},"Create Pathway"),r.a.createElement(ue,{open:o,onClose:m}),"loading"===i?r.a.createElement(q,null):r.a.createElement(ee,null))})),se=Object(Q.a)((function(e){return{root:{display:"flex",alignItems:"center",padding:"2em",backgroundColor:e.palette.background.default,color:e.palette.text.primary,height:"6em"},backButton:{height:"45px",width:"45px"},backIcon:{fontSize:"20px",color:e.palette.grey[800],cursor:"pointer"},pathwayName:{fontSize:"1.4em",marginLeft:"1.5em"}}}),{name:"Navigation"}),me=function(e){var t=e.pathway,a=se(),o=Object(l.g)(),c=Object(n.useCallback)((function(){o.push("/")}),[o]);return r.a.createElement("nav",{className:a.root},r.a.createElement(ne.a,{className:a.backButton,onClick:c,"aria-label":"go back"},r.a.createElement(d.a,{icon:s.d,className:a.backIcon})),r.a.createElement("div",{className:a.pathwayName},null===t||void 0===t?void 0:t.name))},pe=a(425),fe=a.n(pe),be=a(911),he=a(921),ve=a(914),ge=function(e){var t=e.id,a=e.label,o=e.options,c=e.initialSelected,i=Object(n.useState)(null!==c&&void 0!==c?c:o[0]),l=Object(u.a)(i,2),d=l[0],s=l[1];return r.a.createElement(be.a,{variant:"outlined",className:fe.a.dropdown},r.a.createElement(he.a,{id:t,htmlFor:"".concat(t,"-select")},a),r.a.createElement(ve.a,{id:"".concat(t,"-select"),value:d.value,onChange:function(e){var t=o.find((function(t){return t.value===e.target.value}));t&&s(t)},label:a},o.map((function(e){return r.a.createElement(p.a,{value:e.value,key:e.value},e.label)}))))},Ee=a(32),ye=a.n(Ee),Oe=[{label:"Action",value:"action"},{label:"Branch",value:"branch"}],_e=Object(n.memo)((function(){return r.a.createElement("div",{className:ye.a.addNodesContainer},r.a.createElement("table",null,r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{className:ye.a.button},r.a.createElement(I.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l})},"Add Action Node")),r.a.createElement("td",{className:ye.a.description},"Any clinical or worfklow step which is not a decision.")),r.a.createElement("tr",null,r.a.createElement("td",{className:ye.a.button},r.a.createElement(I.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l})},"Add Branch Node")),r.a.createElement("td",{className:ye.a.description},"A logical branching point based on clinical or workflow criteria.")),r.a.createElement("tr",null,r.a.createElement("td",{className:ye.a.button},r.a.createElement(I.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l})},"Add Reusable Node")),r.a.createElement("td",{className:ye.a.description},"A previously built node or group of nodes defining a set of criteria.")))))})),je=Object(n.memo)((function(e){var t=e.currentNodeLabel;return r.a.createElement("div",{className:ye.a.header},r.a.createElement("div",{className:ye.a.icon,id:ye.a.back},r.a.createElement(d.a,{icon:s.d})),r.a.createElement("div",{className:ye.a.nodeName},t),r.a.createElement("div",{className:ye.a.icon},r.a.createElement(d.a,{icon:s.g})),r.a.createElement("div",{className:ye.a.icon,id:ye.a.nodeSettings},r.a.createElement(d.a,{icon:s.h})))})),Ne=Object(n.memo)((function(e){var t=e.headerElement,a=e.currentNode,o=Object(n.useState)(!0),c=Object(u.a)(o,2),i=c[0],l=c[1],m=function(e){var t=Object(n.useContext)(S).useProjector;return x({theme:e,useProjector:t})}("dark"),p=Object(n.useRef)(null),b=Object(n.useCallback)((function(){l((function(e){return!e}))}),[]);return Object(n.useEffect)((function(){(null===p||void 0===p?void 0:p.current)&&(null===t||void 0===t?void 0:t.current)&&(p.current.style.height=window.innerHeight-t.current.clientHeight+"px")}),[i,t]),r.a.createElement(f.a,{theme:m},r.a.createElement("div",{className:ye.a.sidebarContainer,ref:p},i&&r.a.createElement("div",{className:ye.a.sidebar},r.a.createElement(je,{currentNodeLabel:(null===a||void 0===a?void 0:a.label)||""}),r.a.createElement("hr",null),r.a.createElement(ge,{label:"Node Type",id:"Node Type",options:Oe}),r.a.createElement(_e,null)),r.a.createElement("div",{className:ye.a.sidebarToggle,onClick:b},r.a.createElement(d.a,{icon:i?s.d:s.e}))))})),ke=a(161),we=a(217),Ce=a(283),xe=a.n(Ce),Se=R.a.get("graphLayoutProvider","dagre");function Pe(e,t){return"dagre"===Se?function(e,t){var a=Object.keys(e.states),n=new xe.a.graphlib.Graph;n.setGraph({}),n.setDefaultEdgeLabel((function(){return{}})),a.forEach((function(a){var r=e.states[a],o=t[a];o?n.setNode(a,{label:r.label,width:o.width,height:o.height}):n.setNode(a,{label:r.label,width:10*r.label.length,height:50}),r.transitions.forEach((function(e){var t=e.condition?{label:e.condition.description,width:25,height:20}:{};n.setEdge(a,e.transition,t)}))})),xe.a.layout(n);for(var r={},o=n.node("Start").x,c=0,i=a;c<i.length;c++){var l=i[c],u=n.node(l);r[l]={x:u.x-o-u.width/2,y:u.y-u.height/2}}var d={};return n.edges().forEach((function(e){var t=n.edge(e),a="".concat(e.v,", ").concat(e.w),r=t.label?{text:t.label,x:t.x-o,y:t.y}:null;d[a]={label:r,start:e.v,end:e.w,points:t.points.map((function(e){return{x:e.x-o,y:e.y}}))}})),{nodeCoordinates:r,edges:d}}(e,t):function(e){var t=function(e){var t,a={};for(t in e.states)a[t]={label:t,rank:NaN,horizontalPosition:NaN,children:[],parents:[],canMove:!0};return Object.keys(e.states).forEach((function(t){e.states[t].transitions.forEach((function(e){a[t].children.includes(e.transition)||a[t].children.push(e.transition),a[e.transition].parents.includes(t)||a[e.transition].parents.push(t)}))})),a.Start.rank=0,a}(e),a=[["Start"]],n=0;do{var r,o=Object(we.a)(a[n]);try{for(o.s();!(r=o.n()).done;){var c=r.value;s(t[c],n+1)}}catch(p){o.e(p)}finally{o.f()}n++}while(a.length!==n);for(i(t.Start,-50),n=1;n<a.length;n++)l(n);return{nodeCoordinates:function(){var e={};for(var a in t){var n=t[a];e[a]={x:n.horizontalPosition,y:100*n.rank}}return e}(),edges:{}};function i(e,t){if(isNaN(e.horizontalPosition)||e.canMove){e.horizontalPosition=t;for(var a=1;u(e);){var n=a%2===0?-1:1;e.horizontalPosition=t+n*Math.ceil(a/2)*110,a+=1}}}function l(e){var n,r=Object(we.a)(a[e]);try{var o=function(){var e=n.value,a=t[e];if(!isNaN(a.horizontalPosition))return"continue";var r=a.parents.filter((function(e){return t[e].rank<a.rank}));if(1===r.length){var o=a.parents[0],c=t[o];if(c.children.length%2===1)i(t[c.children[Math.floor(c.children.length/2)]],c.horizontalPosition);!function(e){var a=e.children.filter((function(e){return isNaN(t[e].horizontalPosition)||t[e].canMove}));if(0!==a.length)if(1!==a.length){a.length%2===1&&a.splice(Math.ceil(a.length/2),1);for(var n=0;n<a.length/2;n++){var r=t[a[a.length/2-n-1]];i(r,e.horizontalPosition-110*(n+1)),r.canMove=!1,i(r=t[a[a.length/2+n]],e.horizontalPosition+110*(n+1)),r.canMove=!1}}else i(t[a[0]],e.horizontalPosition)}(c)}else{var l=r.map((function(e){return t[e].horizontalPosition})).reduce((function(e,t){return e+t}),0);i(a,l/r.length)}};for(r.s();!(n=r.n()).done;)o()}catch(p){r.e(p)}finally{r.f()}}function u(e){var n,r=a[e.rank].map((function(e){return t[e]})),o=Object(we.a)(r);try{for(o.s();!(n=o.n()).done;){if(d(e,n.value))return!0}}catch(p){o.e(p)}finally{o.f()}return!1}function d(e,t){return!function(e,t){return e.label===t.label}(e,t)&&(!isNaN(e.rank)&&!isNaN(e.horizontalPosition)&&!isNaN(t.rank)&&!isNaN(t.horizontalPosition)&&e.rank===t.rank&&e.horizontalPosition===t.horizontalPosition)}function s(e,n){e.children.forEach((function(r){var o=t[r];o.rank<e.rank?(a[o.rank].splice(a[o.rank].indexOf(r),1),m(r,n),s(o,n+1)):isNaN(o.rank)&&m(r,n)}))}function m(e,n){try{a[n].push(e)}catch(p){a[n]=[e]}finally{t[e].rank=n}}}(e)}var Be=a(107),Me=a.n(Be),Ae=a(108),Te=a.n(Ae),ze=a(913),Ie=a(426),De=a.n(Ie),Re=function(e){var t=e.Content,a=e.Trigger,n=e.popupPosition,o=e.open,c=e.setOpen,i=e.className;return r.a.createElement(ze.a,{content:t,position:n||"bottom right",className:"".concat(De.a.pathwayPopup," ").concat(i),on:"click",open:o,onOpen:function(){c&&c(!0)},onClose:function(){c&&c(!1)},pinned:!0,trigger:a})},Le=a(87),Fe=a.n(Le),We=function(e){var t=e.type,a=e.onClick;return r.a.createElement("button",{className:"".concat(Fe.a.largeActionButton," button ").concat("decline"===t&&Fe.a.largeDecline),type:"button",onClick:a},t[0].toUpperCase()+t.slice(1))},He=function(e){var t=e.type,a=e.onClick;return r.a.createElement("div",{className:"".concat("accept"===t?Fe.a.accept:Fe.a.decline," ").concat(Fe.a.smallActionButton),onClick:a,"data-testid":t},r.a.createElement(d.a,{icon:"accept"===t?s.b:s.p}))},Ue=function(e){var t=e.type,a=e.onClick;return r.a.createElement("div",{className:"".concat("accept"===t?Fe.a.accept:Fe.a.decline," ").concat(Fe.a.mediumActionButton),onClick:a,"data-testid":t},r.a.createElement(d.a,{icon:"accept"===t?s.b:s.p}),{accept:"Submit",decline:"Cancel"}[t])},Ge=function(e){var t=e.type,a=e.size,n=e.onClick;switch(a){case"small":return r.a.createElement(He,{type:t,onClick:n});case"large":return r.a.createElement(We,{type:t,onClick:n});case"medium":return r.a.createElement(Ue,{type:t,onClick:n})}},qe=function(e){var t=e.values,a=e.setOpen,o=Object(n.useState)(!1),c=Object(u.a)(o,2),i=c[0],l=c[1],d=Object(n.useState)(""),s=Object(u.a)(d,2),m=s[0],p=s[1];return r.a.createElement("div",null,r.a.createElement("div",{className:Te.a.popupContent},"Select Value:",r.a.createElement("div",null,t.map((function(e){return r.a.createElement("div",{key:e,className:Te.a.popupChoice+" "+(m===e?Te.a.selected:""),onClick:function(){i&&m===e?(l(!1),p("")):(l(!0),p(e))}},e)})))),r.a.createElement("div",{className:Te.a.footer},r.a.createElement(Ge,{size:"small",type:"decline",onClick:function(){return a(!1)}}),i&&r.a.createElement(Ge,{size:"small",type:"accept",onClick:function(){a(!1)}})))},Xe=function(e){var t=e.values,a=Object(n.useState)(!1),o=Object(u.a)(a,2),c=o[0],i=o[1];return r.a.createElement(Re,{Content:r.a.createElement(qe,{values:t,setOpen:i}),className:Te.a.missingDataPopup,Trigger:r.a.createElement("div",{className:Te.a.popupTrigger},"missing data",r.a.createElement(d.a,{icon:s.g,className:Te.a.externalLink})),open:c,setOpen:i})},Je=a(166),Ye=a.n(Je);function $e(e){var t=e.action;return!!t&&t.length>0}var Ve=Object(n.memo)((function(e){var t=e.pathwayState,a=(e.isActionable,e.isGuidance);return r.a.createElement(r.a.Fragment,null,r.a.createElement(Qe,{isGuidance:a,pathwayState:t}))})),Ke=function(e){var t=e.title,a=e.description;return r.a.createElement("tr",null,r.a.createElement("td",{className:Ye.a.descTitle},t),r.a.createElement("td",{className:Ye.a.desc},a))};var Qe=Object(n.memo)((function(e){var t,a=e.pathwayState,n=e.isGuidance&&function(e){var t,a,n=e.action[0].resource,o=void 0!==n.medicationCodeableConcept?null===n||void 0===n||null===(t=n.medicationCodeableConcept)||void 0===t?void 0:t.coding:null===n||void 0===n||null===(a=n.code)||void 0===a?void 0:a.coding;return[r.a.createElement(Ke,{key:"Notes",title:"Notes",description:e.action[0].description}),r.a.createElement(Ke,{key:"Type",title:"Type",description:n.resourceType}),r.a.createElement(Ke,{key:"System",title:"System",description:r.a.createElement(r.a.Fragment,null,o&&o[0].system,r.a.createElement("a",{href:o&&o[0].system,target:"_blank",rel:"noopener noreferrer"},r.a.createElement(d.a,{icon:s.i,className:Ye.a.externalLink})))}),r.a.createElement(Ke,{key:"Code",title:"Code",description:o&&o[0].code}),r.a.createElement(Ke,{key:"Display",title:"Display",description:o&&o[0].display})]}(a),o=!$e(t=a)&&t.transitions.length>1&&function(e){var t=[],a=e.transitions.map((function(e){var t,a=null===(t=e.condition)||void 0===t?void 0:t.description;return a||""})).filter((function(e,t,a){return a.indexOf(e)===t}));return t.push(r.a.createElement(Ke,{key:"value",title:"Value",description:r.a.createElement(Xe,{values:a})})),t}(a);return r.a.createElement("div",{className:"expandedNode"},r.a.createElement("table",{className:Ye.a.infoTable},r.a.createElement("tbody",null,n||o)))})),Ze=Ve,et=Object(n.memo)(Object(n.forwardRef)((function(e,t){var a=e.pathwayState,n=e.isCurrentNode,o=e.xCoordinate,c=e.yCoordinate,i=e.expanded,l=void 0!==i&&i,u=e.onClickHandler,d=a.label,s={top:c,left:o},m=n,p=[Me.a.node],f="";l&&p.push("expanded"),m?(p.push(Me.a.actionable),f=Me.a.childActionable):f=Me.a.childNotActionable;var b=$e(a);return r.a.createElement("div",{className:p.join(" "),style:s,ref:t},r.a.createElement("div",{className:"nodeTitle ".concat(u&&"clickable"),onClick:u},r.a.createElement("div",{className:"iconAndLabel"},r.a.createElement(tt,{pathwayState:a,isGuidance:b}),d),r.a.createElement(at,{status:null})),l&&r.a.createElement("div",{className:"".concat(Me.a.expandedNode," ").concat(f)},r.a.createElement(Ze,{pathwayState:a,isActionable:m,isGuidance:b})))}))),tt=function(e){var t=e.pathwayState,a=e.isGuidance,n=s.j;if("Start"===t.label&&(n=s.k),a){var o=t;if(o.action.length>0){var c=o.action[0].resource.resourceType;"MedicationRequest"===c?n=s.m:"MedicationAdministration"===c?n=s.a:"Procedure"===c&&(n=s.o)}}return r.a.createElement(d.a,{icon:n,className:Me.a.icon})},at=function(e){var t=e.status;if(null==t)return null;var a=t?s.c:s.q;return r.a.createElement("div",{className:"statusIcon"},r.a.createElement(d.a,{icon:a,className:Me.a.icon}))},nt=et,rt=a(288),ot=a.n(rt),ct=function(e){var t=e.points,a=e.arrowheadId,n=e.widthOffset,o=t.map((function(e){return{x:e.x+n,y:e.y}})),c=o.length;o[c-1].y-=17.5;var i,l="M ".concat(o[0].x," ").concat(o[0].y," ");return i=c%3,l=o.reduce((function(e,t,a,n){return a%3!==i?e:"".concat(e," C ").concat(t.x," ").concat(t.y," ").concat(n[a+1].x," ").concat(n[a+1].y," ").concat(n[a+2].x,"\n        ").concat(n[a+2].y)}),l),r.a.createElement("path",{d:l,fill:"transparent",markerEnd:"url(#".concat(a,")")})},it=function(e){var t=e.edge,a=e.edgeName,n=e.widthOffset,o=ot.a.arrow,c=a.replace(" ",""),i="arrowhead-".concat(c),l=t.label;return r.a.createElement("svg",{className:o},r.a.createElement(ct,{points:t.points,arrowheadId:i,widthOffset:n}),l?r.a.createElement("text",{x:l.x+n,y:l.y},l.text):null,r.a.createElement("defs",null,r.a.createElement("marker",{id:i,className:ot.a.arrowhead,markerWidth:"10",markerHeight:"7",refX:"0",refY:"3.5",orient:"auto"},r.a.createElement("polygon",{points:"0 0, 10 3.5, 0 7"}))))},lt=a(435),ut=a.n(lt),dt=a(436),st=a.n(dt),mt=Object(n.memo)((function(e){var t,a,o,c=e.pathway,i=e.interactive,l=void 0===i||i,d=(e.expandCurrentNode,Object(n.useRef)(null)),s=Object(n.useRef)({}),m=Object(n.useState)(null!==(t=null===d||void 0===d||null===(a=d.current)||void 0===a||null===(o=a.parentElement)||void 0===o?void 0:o.clientWidth)&&void 0!==t?t:0),p=Object(u.a)(m,2),f=p[0],h=p[1],v=Object(n.useCallback)((function(){var e={};return(null===s||void 0===s?void 0:s.current)&&Object.keys(s.current).forEach((function(t){var a=s.current[t],n=a.clientWidth,r=Array.from(a.children).reduce((function(e,t){return e+t.clientHeight}),0);e[t]={width:n,height:r}})),Pe(c,e)}),[c]),g=Object(n.useState)(v()),E=Object(u.a)(g,2),y=E[0],O=E[1],_=y.nodeCoordinates,j=y.edges,N=Object(n.useMemo)((function(){return void 0!==_?Object.values(_).map((function(e){return e.y})).reduce((function(e,t){return Math.max(e,t)})):0}),[_]),k=void 0!==_?Object.values(_).map((function(e){return e.x+f/2})).reduce((function(e,t){return Math.min(e,t)})):0;if(k<0){var w=-1*k;Object.keys(_).forEach((function(e){_[e].x+=w})),Object.keys(j).forEach((function(e){var t=j[e];t.points.forEach((function(e){return e.x+=w})),t.label&&(t.label.x+=w)}))}var C=Object(n.useState)((function(){return Object.keys(y).reduce((function(e,t){return e[t]=!1,e}),{lastSelectedNode:null})})),x=Object(u.a)(C,2),S=x[0],P=x[1],B=Object(n.useCallback)((function(e){P((function(t){var a;return Object(b.a)({},t,(a={},Object(ke.a)(a,e,t[e]&&t.lastSelectedNode!==e?t[e]:!t[e]),Object(ke.a)(a,"lastSelectedNode",e),a))}))}),[]);Object(n.useEffect)((function(){var e;(null===(e=d.current)||void 0===e?void 0:e.parentElement)&&new st.a(d.current.parentElement,(function(){var e,t,a;h(null!==(e=null===(t=d.current)||void 0===t||null===(a=t.parentElement)||void 0===a?void 0:a.clientWidth)&&void 0!==e?e:0),O(v())}))}),[v]),Object(n.useEffect)((function(){O(v())}),[S,v]);var M=void 0!==j?Object.values(j).map((function(e){return e.label})).map((function(e){return e?e.x+10*e.text.length+f/2:0})).reduce((function(e,t){return Math.max(e,t)}),0):f;return r.a.createElement(pt,{graphElement:d,interactive:l,maxHeight:N,nodeCoordinates:_,edges:j,pathway:c,nodeRefs:s,parentWidth:f,maxWidth:M,expanded:S,toggleExpanded:B})})),pt=Object(n.memo)((function(e){var t=e.graphElement,a=e.interactive,o=e.maxHeight,c=e.nodeCoordinates,i=e.edges,u=e.pathway,d=e.nodeRefs,s=e.parentWidth,m=e.maxWidth,p=e.expanded,f=e.toggleExpanded,b=Object(l.h)().id,h=Object(l.g)(),v=Object(n.useCallback)((function(e){var t="/builder/".concat(encodeURIComponent(b),"/node/").concat(encodeURIComponent(e));t!==h.location.pathname&&h.push(t)}),[h,b]);return r.a.createElement("div",{ref:t,id:"graph-root",className:ut.a.root,style:{height:a?o+150:"inherit",width:m+"px",position:"relative",marginRight:"5px"}},void 0!==c?Object.keys(c).map((function(e){var t=Object(n.useCallback)((function(){a&&(v(e),f(e))}),[e]);return r.a.createElement(nt,{key:e,ref:function(t){d.current[e]=t},pathwayState:u.states[e],isCurrentNode:!1,xCoordinate:c[e].x+s/2,yCoordinate:c[e].y,expanded:Boolean(p[e]),onClickHandler:t})})):[],r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",style:{width:m+5,height:o,zIndex:1,top:0,left:0,overflow:"visible"}},void 0!==i?Object.keys(i).map((function(e){var t=i[e];return r.a.createElement(it,{key:e,edge:t,edgeName:e,widthOffset:s/2})})):[]))})),ft=mt,bt=a(289),ht=a.n(bt),vt=Object(n.memo)((function(e){var t=e.pathway,a=e.currentNode,o=Object(n.useRef)(null),c=Object(n.useRef)(null);return Object(n.useEffect)((function(){(null===c||void 0===c?void 0:c.current)&&(null===o||void 0===o?void 0:o.current)&&(c.current.style.height=window.innerHeight-o.current.clientHeight+"px")}),[t,o,c]),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:o},r.a.createElement(z,null),r.a.createElement(me,{pathway:t})),r.a.createElement("div",{className:ht.a.display},r.a.createElement(Ne,{headerElement:o,currentNode:a}),r.a.createElement("div",{ref:c,className:ht.a.graph},r.a.createElement(ft,{pathway:t,expandCurrentNode:!0}))))})),gt=Object(n.memo)((function(){var e,t=Object(l.h)(),a=t.id,o=t.nodeId,c=H().pathways,i=decodeURIComponent(a),u=Object(n.useMemo)((function(){return c.find((function(e){return e.id===i}))}),[i,c]),d=null===u||void 0===u||null===(e=u.states)||void 0===e?void 0:e[decodeURIComponent(o)];return null==u?null:null==d?r.a.createElement(l.a,{to:"/builder/".concat(a,"/node/Start")}):r.a.createElement(vt,{pathway:u,currentNode:d})})),Et=Object(n.createContext)({}),yt=function(e){var t=e.children,a=Object(n.useState)(null),o=Object(u.a)(a,2),c=o[0],i=o[1];return r.a.createElement(Et.Provider,{value:{user:c,setUser:i}},t)},Ot=Object(n.memo)((function(){return r.a.createElement(P,{theme:"light"},r.a.createElement(yt,null,r.a.createElement(W,null,r.a.createElement(i.a,null,r.a.createElement(l.d,null,r.a.createElement(l.b,{path:"/builder/:id/node/:nodeId"},r.a.createElement(gt,null)),r.a.createElement(l.b,{path:"/builder/:id"},r.a.createElement(gt,null)),r.a.createElement(l.b,{path:"/"},r.a.createElement(z,null),r.a.createElement(de,null)))))))}));a(859);c.a.render(r.a.createElement(Ot,null),document.getElementById("root"))},87:function(e,t,a){e.exports={selectButton:"ActionButton_selectButton___qB5R",accept:"ActionButton_accept__28b2D",decline:"ActionButton_decline__zz-vG",smallActionButton:"ActionButton_smallActionButton__1bPWu",largeActionButton:"ActionButton_largeActionButton__blRdA",largeDecline:"ActionButton_largeDecline__wz9Zw",mediumActionButton:"ActionButton_mediumActionButton__3EpOp"}}},[[455,1,2]]]);
//# sourceMappingURL=main.89d27a16.chunk.js.map