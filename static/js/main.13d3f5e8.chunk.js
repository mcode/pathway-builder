(this["webpackJsonppathway-builder"]=this["webpackJsonppathway-builder"]||[]).push([[0],{108:function(e,t,a){e.exports={node:"Node_node__38uoJ",icon:"Node_icon__354W4",actionable:"Node_actionable__bHXKd",expandedNode:"Node_expandedNode__1ar-A",childNotActionable:"Node_childNotActionable__1bfBq",childActionable:"Node_childActionable__SwUjD"}},109:function(e,t,a){e.exports={missingDataPopup:"MissingDataPopup_missingDataPopup__A-EBJ",popupContent:"MissingDataPopup_popupContent__24BvC",popupTrigger:"MissingDataPopup_popupTrigger__11eAy",popupChoice:"MissingDataPopup_popupChoice__5oEld",selected:"MissingDataPopup_selected__20Or7",footer:"MissingDataPopup_footer__1wJXm",externalLink:"MissingDataPopup_externalLink__3oYt-"}},169:function(e,t,a){e.exports={infoTable:"ExpandedNode_infoTable__3v2tx",descTitle:"ExpandedNode_descTitle__15ki8",desc:"ExpandedNode_desc__3Xdkf",externalLink:"ExpandedNode_externalLink__1Mr1x",defaultTextButton:"ExpandedNode_defaultTextButton__2Bvq6",commentsForm:"ExpandedNode_commentsForm__3Q20Y",footer:"ExpandedNode_footer__FOCYI",comments:"ExpandedNode_comments__9q-JW"}},214:function(e,t,a){"use strict";(function(e){var n=a(11),r=a(423),o=a(424),c=new(function(){function t(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object(r.a)(this,t),this.config=e.CONFIG?Object(n.a)({},e.CONFIG,{},a):Object(n.a)({},a)}return Object(o.a)(t,[{key:"get",value:function(e,t){var a=e.split("."),n=this.config,r=null;for(var o in a){n=r=n[a[o]]}return r||t}},{key:"add",value:function(e){e&&(this.config=Object(n.a)({},this.config,{},e))}}]),t}());t.a=c}).call(this,a(69))},218:function(e,t,a){e.exports={logo:"Header_logo__3T0lc",homeLink:"Header_homeLink__2ew4r"}},283:function(e,t,a){e.exports={root:"Loading_root__3b6qy"}},289:function(e,t,a){e.exports={arrow:"Arrow_arrow__3TM91",arrowhead:"Arrow_arrowhead__3XjQ0"}},290:function(e,t,a){e.exports={display:"Builder_display__23HzN",graph:"Builder_graph__lF-uJ"}},422:function(e,t,a){e.exports=a.p+"static/media/camino-logo-dark.c8fc712a.png"},425:function(e,t,a){e.exports={pathwayPopup:"PathwayPopup_pathwayPopup__2moYb"}},434:function(e,t,a){e.exports={root:"Graph_root__1SJOc"}},453:function(e,t,a){e.exports=a(858)},857:function(e,t,a){},858:function(e,t,a){"use strict";a.r(t);a(454),a(463);var n=a(0),r=a.n(n),o=a(21),c=a.n(o),i=a(68),l=a(105),u=a(26),d=a(13),s=a(10),m=a(437),p=a(914),b=a(892),h=a(11),f=a(436),v=a(217),g=a.n(v),y={spacing:{globalPadding:"2em"}},E={white:"#fff",black:"#222",blue:"#5d89a1",red:"#d95d77",gray:"#4a4a4a",grayMedium:"#bbbdc0",grayBlue:"#cbd5df",grayLighter:"#eaeef2",grayDark:"#444",green:"#2fa874"},O={fontFamily:["Open Sans","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue","sans-serif"].join(",")},j={MuiButton:{root:{borderRadius:0},label:{fontWeight:600},iconSizeMedium:{"& > *:first-child":{fontSize:14}},iconSizeSmall:{"& > *:first-child":{fontSize:14}}},MuiTableHead:{root:{backgroundColor:E.grayLighter}},MuiTableCell:{root:{fontSize:"1em"},head:{padding:"5px 16px",borderBottom:"none"}},MuiFormControl:{root:{margin:"10px 0"}},MuiFormLabel:{root:{fontStyle:"italic"}},MuiInputBase:{root:{fontWeight:600,"&:hover":{}}},MuiOutlinedInput:{root:{borderRadius:"0"}},MuiSelect:{icon:{fontSize:"2em"}},MuiPaper:{rounded:{borderRadius:"0"}},MuiDialogTitle:{root:{padding:"1em"}},MuiDialogContent:{root:{padding:"0 4em"}},MuiDialogActions:{root:{padding:"2em 4em"}}},C={MuiFormControl:{root:{"&:hover":{borderColor:E.white}}},MuiFormLabel:{root:{color:E.white,"&$focused":{color:E.white}}},MuiInputBase:{root:{color:E.white,"&:hover":{borderColor:E.white,backgroundColor:E.grayDark}}},MuiOutlinedInput:{root:{"&:hover":{borderColor:E.white},"&:hover $notchedOutline":{borderColor:E.white},"&$focused $notchedOutline":{borderColor:E.white}},notchedOutline:{borderColor:E.white}},MuiSelect:{icon:{color:E.white}},MuiMenuItem:{root:{color:E.grayDark}}},k={primary:{main:E.blue},secondary:{main:E.red},error:{main:E.red},common:E,background:{default:E.grayLighter},text:{primary:E.gray,secondary:E.gray},grey:{800:"#4a4a4a"}},N=Object(f.a)({typography:Object(h.a)({},O),palette:Object(h.a)({},k),overrides:Object(h.a)({},j),variables:Object(h.a)({},y)}),w=Object(f.a)({typography:Object(h.a)({},O),palette:g()(k,{text:{primary:E.white,secondary:E.white}}),overrides:g()(j,C),variables:Object(h.a)({},y)}),x=Object(f.a)({typography:Object(h.a)({},O),palette:g()(k,{background:{default:E.grayBlue},text:{primary:E.black,secondary:E.black}}),overrides:Object(h.a)({},j),variables:Object(h.a)({},y)}),_=function(e){var t=e.theme;if(e.useProjector)switch(t){case"dark":return w;default:return x}switch(t){case"dark":return w;default:return N}},S=Object(n.createContext)({}),P=Object(n.memo)((function(e){var t=e.theme,a=void 0===t?"light":t,o=e.children,c=Object(n.useState)(!1),i=Object(u.a)(c,2),l=i[0],d=i[1],s=_({theme:a,useProjector:l}),m=Object(n.useCallback)((function(){d((function(e){return!e}))}),[]);return r.a.createElement(b.a,{theme:s},r.a.createElement(S.Provider,{value:{useProjector:l,toggleTheme:m}},o))})),T=a(422),B=a.n(T),I=a(218),M=a.n(I),A=Object(n.memo)((function(){var e=Object(n.useState)(null),t=Object(u.a)(e,2),a=t[0],o=t[1],c=Object(n.useContext)(S).toggleTheme,l=Object(n.useCallback)((function(e){o(e.currentTarget)}),[]),b=Object(n.useCallback)((function(){o(null)}),[]),h=Object(n.useCallback)((function(){c(),b()}),[c,b]);return r.a.createElement("header",{className:M.a.header},r.a.createElement(i.b,{to:"/",className:M.a.homeLink},r.a.createElement("img",{src:B.a,alt:"logo",className:M.a.logo})),r.a.createElement("button",{onClick:l,"aria-controls":"options-menu","aria-haspopup":"true"},r.a.createElement(d.a,{icon:s.f})),r.a.createElement(m.a,{id:"options-menu",anchorEl:a,keepMounted:!0,open:Boolean(a),onClose:b},r.a.createElement(p.a,{onClick:h},"Toggle Theme")))})),z=a(903),D=a(141),R=a(214);var L=function(e){var t=Object(n.useState)({status:"loading"}),a=Object(u.a)(t,2),r=a[0],o=a[1];return Object(n.useEffect)((function(){(function(e){return fetch(e,{headers:{Accept:"application/json"}})})(e).then((function(e){return e.json()})).then((function(t){return t.map((function(t){return function(e,t){return fetch(e,t).then((function(e){return e.json()}))}(e+"/"+t)}))})).then((function(e){return Promise.all(e)})).then((function(e){return o({status:"loaded",payload:e})})).catch((function(e){return o({status:"error",error:e})}))}),[e]),r},F=Object(n.createContext)({}),W=Object(n.memo)((function(e){var t=e.children,a=Object(n.useState)([]),o=Object(u.a)(a,2),c=o[0],i=o[1],l=L(R.a.get("demoPathwaysService")),d=l.payload,s=Object(n.useCallback)((function(e){i((function(t){return[].concat(Object(D.a)(t),[e])}))}),[]),m=Object(n.useCallback)((function(e){}),[]),p=Object(n.useCallback)((function(e,t){i((function(a){return[].concat(Object(D.a)(a.slice(0,t)),[e],Object(D.a)(a.slice(t+1)))}))}),[]);switch(Object(n.useEffect)((function(){d&&i(d)}),[d]),l.status){case"error":return r.a.createElement("div",null,"Error loading pathways");default:return r.a.createElement(F.Provider,{value:{pathways:c,addPathway:s,deletePathway:m,updatePathwayAtIndex:p,status:l.status}},t)}})),H=function(){return Object(n.useContext)(F)},U=a(283),G=a.n(U),q=Object(n.memo)((function(){return r.a.createElement("div",{className:G.a.root},r.a.createElement(d.a,{icon:s.n,className:G.a.root,size:"4x",spin:!0}))})),J=a(897),Y=a(898),X=a(899),$=a(900),V=a(901),K=a(902),Q=a(896),Z=Object(Q.a)((function(e){return{root:{display:"flex",flexDirection:"column",padding:e.variables.spacing.globalPadding},createPathwayButton:{alignSelf:"flex-end"},pathwayList:{marginTop:"2em"},editButton:{marginRight:"1em"},dialogCloseButton:{float:"right",width:"45px"}}}),{name:"PathwaysList"}),ee=Object(n.memo)((function(){var e=Z(),t=H(),a=t.pathways,n=t.deletePathway;return r.a.createElement(J.a,{className:e.pathwayList},r.a.createElement(Y.a,{"aria-label":"pathway list"},r.a.createElement(X.a,null,r.a.createElement($.a,null,r.a.createElement(V.a,null,"Pathway Name"),r.a.createElement(V.a,null,"Status"),r.a.createElement(V.a,null,"Last Updated"),r.a.createElement(V.a,null))),r.a.createElement(K.a,null,a.map((function(t){return r.a.createElement($.a,{key:t.id},r.a.createElement(V.a,{component:"th",scope:"row"},t.name),r.a.createElement(V.a,null,"draft"),r.a.createElement(V.a,null,"2 days ago"),r.a.createElement(V.a,{align:"right"},r.a.createElement(z.a,{className:e.editButton,color:"primary",size:"small",startIcon:r.a.createElement(d.a,{icon:s.g}),component:i.b,to:"/builder/".concat(encodeURIComponent(t.id))},"Edit"),r.a.createElement(z.a,{color:"secondary",size:"small",startIcon:r.a.createElement(d.a,{icon:s.s}),onClick:function(){return n(t)}},"Delete")))})))))})),te=a(913),ae=a(915),ne=a(904),re=a(905),oe=a(916),ce=a(909),ie=a(107),le=a.n(ie),ue=a(44);function de(e){return e||(e=le.a.generate()),{key:e,label:"New Node",transitions:[],nodeTypeIsUndefined:!0}}function se(e,t){return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t.key,t))})}function me(e,t,a){switch(a){case"action":return be(e,t);case"branch":return function(e,t){var a=e.states[t];if(void 0===a.cql&&void 0===a.action&&void 0===a.nodeTypeIsUndefined)return e;return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},a,{cql:void 0,action:void 0,nodeTypeIsUndefined:void 0})))})}(e,t);default:return e}}function pe(e,t,a){var n={id:le.a.generate(),transition:a};return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},e.states[t],{transitions:[].concat(Object(D.a)(e.states[t].transitions),[n])})))})}function be(e,t){var a=e.states[t];return void 0!==a.cql&&void 0!==a.action?e:Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},a,{cql:"",action:[],nodeTypeIsUndefined:void 0,criteriaSource:void 0,mcodeCriteria:void 0,otherCriteria:void 0})))})}var he=Object(n.memo)((function(e){var t=e.open,a=e.onClose,o=Z(),c=Object(l.g)(),i=Object(n.useRef)(null),u=Object(n.useRef)(null),m=H().addPathway,p=Object(n.useCallback)((function(e){c.push("/builder/".concat(encodeURIComponent(e),"/node/Start")),a()}),[c,a]),b=Object(n.useCallback)((function(e){var t,a,n,r;e.preventDefault();var o=le.a.generate(),c=null!==(t=null===(a=i.current)||void 0===a?void 0:a.value)&&void 0!==t?t:"",l=null!==(n=null===(r=u.current)||void 0===r?void 0:r.value)&&void 0!==n?n:"";m(function(e,t,a){return{id:null!==a&&void 0!==a?a:le.a.generate(),name:e,description:null!==t&&void 0!==t?t:"",library:"",criteria:[],states:{Start:{key:"Start",label:"Start",transitions:[]}}}}(c,l,o)),p(o)}),[m,p]);return r.a.createElement(te.a,{open:t,onClose:a,"aria-labelledby":"create-pathway",fullWidth:!0,maxWidth:"md"},r.a.createElement(ae.a,{disableTypography:!0},r.a.createElement(ne.a,{"aria-label":"close",onClick:a,className:o.dialogCloseButton},r.a.createElement(d.a,{icon:s.p}))),r.a.createElement("form",{onSubmit:b},r.a.createElement(re.a,null,r.a.createElement(oe.a,{variant:"outlined",autoFocus:!0,label:"Pathway Name",fullWidth:!0,required:!0,inputRef:i}),r.a.createElement(oe.a,{variant:"outlined",label:"Pathway Description",fullWidth:!0,inputRef:u})),r.a.createElement(ce.a,null,r.a.createElement(z.a,{variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l}),type:"submit"},"Create"))))})),fe=Object(n.memo)((function(){var e=Z(),t=Object(n.useState)(!1),a=Object(u.a)(t,2),o=a[0],c=a[1],i=H().status,l=Object(n.useCallback)((function(){c(!0)}),[]),m=Object(n.useCallback)((function(){c(!1)}),[]);return r.a.createElement("div",{className:e.root},r.a.createElement(z.a,{className:e.createPathwayButton,variant:"contained",color:"primary",startIcon:r.a.createElement(d.a,{icon:s.l}),onClick:l},"Create Pathway"),r.a.createElement(he,{open:o,onClose:m}),"loading"===i?r.a.createElement(q,null):r.a.createElement(ee,null))})),ve=Object(Q.a)((function(e){return{root:{display:"flex",alignItems:"center",padding:"2em",backgroundColor:e.palette.background.default,color:e.palette.text.primary,height:"6em"},backButton:{height:"45px",width:"45px"},backIcon:{fontSize:"20px",color:e.palette.grey[800],cursor:"pointer"},pathwayName:{fontSize:"1.4em",marginLeft:"1.5em"}}}),{name:"Navigation"}),ge=function(e){var t=e.pathway,a=ve(),o=Object(l.g)(),c=Object(n.useCallback)((function(){o.push("/")}),[o]);return r.a.createElement("nav",{className:a.root},r.a.createElement(ne.a,{className:a.backButton,onClick:c,"aria-label":"go back"},r.a.createElement(d.a,{icon:s.d,className:a.backIcon})),r.a.createElement("div",{className:a.pathwayName},null===t||void 0===t?void 0:t.name))},ye=Object(Q.a)((function(e){return{root:{display:"flex",flexDirection:"column",padding:e.variables.spacing.globalPadding,color:e.palette.text.primary,backgroundColor:e.palette.grey[800],width:"33%",minWidth:"500px",overflowY:"scroll",float:"left"},formControl:{margin:e.spacing(1,0),minWidth:375},divider:{width:"100%"},sidebarHeader:{display:"flex",justifyContent:"space-between"},sidebarHeaderGroup:{display:"flex",alignItems:"center"},sidebarHeaderButton:{height:"45px",width:"45px",color:e.palette.text.primary},headerLabelGroup:{display:"flex",cursor:"pointer",height:"60px"},headerLabel:{display:"flex",alignItems:"center",fontSize:"1.6em",fontWeight:700,margin:"0 5px"},headerLabelText:{marginBottom:"5px"},editIcon:{fontSize:"0.6em",marginLeft:"10px"},sidebarButtonGroup:{display:"flex",margin:"10px 0"},sidebarButton:{minWidth:180,marginRight:"20px"},sidebarButtonText:{fontStyle:"italic"},toggleSidebar:{display:"inline-flex",alignItems:"center",justifyContent:"center",float:"left",width:"50px",minWidth:"50px",height:"50px",fontSize:"2em",backgroundColor:e.palette.primary.main,color:e.palette.text.primary,"&:hover":{cursor:"pointer"}}}}),{name:"Sidebar"}),Ee=Object(n.memo)((function(e){var t=e.pathway,a=e.updatePathway,o=e.headerElement,c=e.currentNode,i=Object(n.useState)(!0),m=Object(u.a)(i,2),p=m[0],b=m[1],h=ye(),f=Object(l.g)(),v=Object(n.useRef)(null),g=null===c||void 0===c?void 0:c.key,y=Object(n.useCallback)((function(){b(!p)}),[p]),E=Object(n.useCallback)((function(e){g&&a(me(t,g,e))}),[t,a,g]),O=Object(n.useCallback)((function(e){var a="/builder/".concat(encodeURIComponent(t.id),"/node/").concat(encodeURIComponent(e));a!==f.location.pathname&&f.push(a)}),[f,t.id]),j=Object(n.useCallback)((function(e){if(g){var n=de(),r=se(t,n);r=me(r=pe(r,g,n.key),n.key,e),a(r),O(n.key)}}),[t,a,g,O]);Object(n.useEffect)((function(){(null===v||void 0===v?void 0:v.current)&&(null===o||void 0===o?void 0:o.current)&&(v.current.style.height=window.innerHeight-o.current.clientHeight+"px")}),[p,o]);var C=function(e,t){if(!t)return"null";var a=e.states[t];return a.nodeTypeIsUndefined?"null":a.action||"Start"===t?"action":"branch"}(t,g);return r.a.createElement(r.a.Fragment,null,p&&r.a.createElement("div",{className:h.root,ref:v},r.a.createElement(ke,{pathway:t,currentNode:c,updatePathway:a,isTransition:!1}),r.a.createElement("hr",{className:h.divider}),"null"===C&&r.a.createElement(De,{pathway:t,currentNode:c,changeNodeType:E,addNode:j}),"action"===C&&r.a.createElement(Ae,{pathway:t,currentNode:c,changeNodeType:E,addNode:j}),"branch"===C&&r.a.createElement(Ie,{pathway:t,currentNode:c,changeNodeType:E,updatePathway:a})),r.a.createElement("div",{className:h.toggleSidebar,onClick:y},r.a.createElement(d.a,{icon:p?s.d:s.e})))})),Oe=a(5),je=a(908),Ce=a(906),ke=Object(n.memo)((function(e){var t=e.pathway,a=e.currentNode,o=e.updatePathway,c=e.isTransition,i=Object(n.useState)(!1),l=Object(u.a)(i,2),m=l[0],p=l[1],b=Object(n.useRef)(null),f=null===a||void 0===a?void 0:a.key,v=(null===a||void 0===a?void 0:a.label)||"",g=ye(),y=Object(n.useCallback)((function(){}),[]),E=Object(n.useCallback)((function(){}),[]),O=Object(n.useCallback)((function(){}),[]),j=Object(n.useCallback)((function(){var e,a,n=null!==(e=null===(a=b.current)||void 0===a?void 0:a.value)&&void 0!==e?e:"";f&&o(function(e,t,a){return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},e.states[t],{label:a})))})}(t,f,n)),p(!1)}),[t,o,f]),C=Object(n.useCallback)((function(){p(!0)}),[]),k=Object(n.useCallback)((function(e){"Enter"===e.key&&j()}),[j]);return r.a.createElement("div",{className:g.sidebarHeader},r.a.createElement("div",{className:g.sidebarHeaderGroup},"Start"!==v&&!c&&r.a.createElement(ne.a,{className:g.sidebarHeaderButton,onClick:y,"aria-label":"go to parent node"},r.a.createElement(d.a,{icon:s.d})),r.a.createElement("div",{className:g.headerLabelGroup,onClick:C},m?r.a.createElement(je.a,{className:g.formControl,fullWidth:!0},r.a.createElement(Ce.a,{className:g.headerLabel,type:"text",inputRef:b,onBlur:j,onKeyPress:k,defaultValue:v,autoFocus:!0})):r.a.createElement("div",{className:Object(Oe.a)(g.headerLabel,g.headerLabelText)},v,r.a.createElement(d.a,{className:g.editIcon,icon:s.g})))),r.a.createElement("div",{className:g.sidebarHeaderGroup},r.a.createElement(ne.a,{className:g.sidebarHeaderButton,onClick:c?E:O,"aria-label":c?"go to transition node":"open node options"},r.a.createElement(d.a,{icon:c?s.e:s.h}))))})),Ne=Object(n.memo)((function(e){var t=e.buttonName,a=e.buttonIcon,n=e.buttonText,o=e.onClick,c=ye();return r.a.createElement("div",{className:c.sidebarButtonGroup},r.a.createElement(z.a,{className:c.sidebarButton,variant:"contained",color:"primary",startIcon:a,onClick:o},t),r.a.createElement("div",{className:c.sidebarButtonText},n))})),we=a(918),xe=a(911),_e=Object(n.memo)((function(e){var t=e.id,a=e.label,o=e.options,c=e.value,i=e.onChange,l=Object(n.useCallback)((function(e){i&&i(e)}),[i]);return r.a.createElement(je.a,{variant:"outlined",fullWidth:!0},r.a.createElement(we.a,{id:t,htmlFor:"".concat(t,"-select")},a),r.a.createElement(xe.a,{id:"".concat(t,"-select"),value:c||"",onChange:l,label:a,error:null==c||""===c,MenuProps:{getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},displayEmpty:!0},o.map((function(e){return r.a.createElement(p.a,{key:e.value,value:e.value},e.label)}))))})),Se=[{value:"action",label:"Action"},{value:"branch",label:"Branch"}],Pe=[{value:"mcode",label:"mCODE"},{value:"other",label:"Other"}],Te=[{value:"tumorCategory",label:"Tumor Category"},{value:"nodeCategory",label:"Node Category"},{value:"metastatisCategory",label:"Metastatis Category"}],Be=[{value:"item",label:"Item"}],Ie=Object(n.memo)((function(e){var t=e.pathway,a=e.currentNode,o=e.changeNodeType,c=e.updatePathway,i=null===a||void 0===a?void 0:a.key,l=ye(),u=Object(n.useCallback)((function(e){o((null===e||void 0===e?void 0:e.target.value)||"")}),[o]),m=Object(n.useCallback)((function(e){if(i){var a=(null===e||void 0===e?void 0:e.target.value)||"";c(function(e,t,a){return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},e.states[t],{criteriaSource:a})))})}(t,i,a))}}),[i,c,t]),p=Object(n.useCallback)((function(e){if(i){var a=(null===e||void 0===e?void 0:e.target.value)||"";c(function(e,t,a){return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},e.states[t],{mcodeCriteria:a})))})}(t,i,a))}}),[i,c,t]),b=Object(n.useCallback)((function(e){if(i){var a=(null===e||void 0===e?void 0:e.target.value)||"";c(function(e,t,a){return Object(h.a)({},e,{states:Object(h.a)({},e.states,Object(ue.a)({},t,Object(h.a)({},e.states[t],{otherCriteria:a})))})}(t,i,a))}}),[i,c,t]),f=Object(n.useCallback)((function(){var e=de(),a=se(t,e);c(pe(a,i||"",e.key))}),[t,c,i]),v=null!=a.criteriaSource&&(a.mcodeCriteria||a.otherCriteria);return r.a.createElement(r.a.Fragment,null,r.a.createElement(_e,{id:"nodeType",label:"Node Type",options:Se,onChange:u,value:"branch"}),r.a.createElement(_e,{id:"criteriaSource",label:"Criteria Source",options:Pe,onChange:m,value:a.criteriaSource}),"mcode"===a.criteriaSource&&r.a.createElement(_e,{id:"mCodeCriteria",label:"mCODE Criteria",options:Te,onChange:p,value:a.mcodeCriteria}),"other"===a.criteriaSource&&r.a.createElement(_e,{id:"otherCriteria",label:"Other Criteria",options:Be,onChange:b,value:a.otherCriteria}),a.transitions.map((function(e){return r.a.createElement(Re,{key:e.id,pathway:t,transition:e,updatePathway:c})})),v&&r.a.createElement(r.a.Fragment,null,r.a.createElement("hr",{className:l.divider}),r.a.createElement(Ne,{buttonName:"Add Transition",buttonIcon:r.a.createElement(d.a,{icon:s.l}),buttonText:"Add transition logic for a clinical decision within a workflow.",onClick:f})))})),Me=[{label:"Action",value:"action"},{label:"Branch",value:"branch"}],Ae=Object(n.memo)((function(e){e.pathway;var t=e.currentNode,a=e.changeNodeType,o=e.addNode,c=ye(),i=Object(n.useCallback)((function(e){a((null===e||void 0===e?void 0:e.target.value)||"")}),[a]),l=void 0!==t.key&&"Start"!==t.key,u=void 0!==t.key&&0===t.transitions.length;return r.a.createElement(r.a.Fragment,null,l&&r.a.createElement(_e,{id:"nodeType",label:"Node Type",options:Me,onChange:i,value:"action"}),u&&r.a.createElement(r.a.Fragment,null,l&&r.a.createElement("hr",{className:c.divider}),r.a.createElement(Ne,{buttonName:"Add Action Node",buttonIcon:r.a.createElement(d.a,{icon:s.l}),buttonText:"Any clinical or workflow step which is not a decision.",onClick:function(){return o("action")}}),r.a.createElement(Ne,{buttonName:"Add Branch Node",buttonIcon:r.a.createElement(d.a,{icon:s.l}),buttonText:"A logical branching point based on clinical or workflow criteria.",onClick:function(){return o("branch")}})))})),ze=[{label:"",value:""},{label:"Action",value:"action"},{label:"Branch",value:"branch"}],De=Object(n.memo)((function(e){e.pathway;var t=e.currentNode,a=e.changeNodeType,o=(e.addNode,Object(n.useCallback)((function(e){a((null===e||void 0===e?void 0:e.target.value)||"")}),[a])),c=void 0!==t.key&&"Start"!==t.key;return r.a.createElement(r.a.Fragment,null,c&&r.a.createElement(_e,{id:"nodeType",label:"Node Type",options:ze,onChange:o,value:""}))})),Re=Object(n.memo)((function(e){var t=e.pathway,a=e.transition,n=e.updatePathway,o=ye(),c=(null===a||void 0===a?void 0:a.transition)||"",i=t.states[c];return r.a.createElement(r.a.Fragment,null,r.a.createElement("hr",{className:o.divider}),r.a.createElement(ke,{pathway:t,currentNode:i,updatePathway:n,isTransition:!0}),r.a.createElement(Ne,{buttonName:"Use Criteria",buttonIcon:r.a.createElement(d.a,{icon:s.l}),buttonText:"Add previously built or imported criteria logic to branch node."}),r.a.createElement(Ne,{buttonName:"Build Criteria",buttonIcon:r.a.createElement(d.a,{icon:s.r}),buttonText:"Create new criteria logic to add to branch node."}))})),Le=a(219),Fe=a(284),We=a.n(Fe),He=R.a.get("graphLayoutProvider","dagre");function Ue(e,t){return"dagre"===He?function(e,t){var a=Object.keys(e.states),n=new We.a.graphlib.Graph;n.setGraph({}),n.setDefaultEdgeLabel((function(){return{}})),a.forEach((function(a){var r=e.states[a],o=t[a];o?n.setNode(a,{label:r.label,width:o.width,height:o.height}):n.setNode(a,{label:r.label,width:10*r.label.length,height:50}),r.transitions.forEach((function(e){var t=e.condition?{label:e.condition.description,width:25,height:20}:{};n.setEdge(a,e.transition,t)}))})),We.a.layout(n);for(var r={},o=n.node("Start").x,c=0,i=a;c<i.length;c++){var l=i[c],u=n.node(l);r[l]={x:u.x-o-u.width/2,y:u.y-u.height/2}}var d={};return n.edges().forEach((function(e){var t=n.edge(e),a="".concat(e.v,", ").concat(e.w),r=t.label?{text:t.label,x:t.x-o,y:t.y}:null;d[a]={label:r,start:e.v,end:e.w,points:t.points.map((function(e){return{x:e.x-o,y:e.y}}))}})),{nodeCoordinates:r,edges:d}}(e,t):function(e){var t=function(e){var t,a={};for(t in e.states)a[t]={label:t,rank:NaN,horizontalPosition:NaN,children:[],parents:[],canMove:!0};return Object.keys(e.states).forEach((function(t){e.states[t].transitions.forEach((function(e){a[t].children.includes(e.transition)||a[t].children.push(e.transition),a[e.transition].parents.includes(t)||a[e.transition].parents.push(t)}))})),a.Start.rank=0,a}(e),a=[["Start"]],n=0;do{var r,o=Object(Le.a)(a[n]);try{for(o.s();!(r=o.n()).done;){var c=r.value;s(t[c],n+1)}}catch(p){o.e(p)}finally{o.f()}n++}while(a.length!==n);for(i(t.Start,-50),n=1;n<a.length;n++)l(n);return{nodeCoordinates:function(){var e={};for(var a in t){var n=t[a];e[a]={x:n.horizontalPosition,y:100*n.rank}}return e}(),edges:{}};function i(e,t){if(isNaN(e.horizontalPosition)||e.canMove){e.horizontalPosition=t;for(var a=1;u(e);){var n=a%2===0?-1:1;e.horizontalPosition=t+n*Math.ceil(a/2)*110,a+=1}}}function l(e){var n,r=Object(Le.a)(a[e]);try{var o=function(){var e=n.value,a=t[e];if(!isNaN(a.horizontalPosition))return"continue";var r=a.parents.filter((function(e){return t[e].rank<a.rank}));if(1===r.length){var o=a.parents[0],c=t[o];if(c.children.length%2===1)i(t[c.children[Math.floor(c.children.length/2)]],c.horizontalPosition);!function(e){var a=e.children.filter((function(e){return isNaN(t[e].horizontalPosition)||t[e].canMove}));if(0!==a.length)if(1!==a.length){a.length%2===1&&a.splice(Math.ceil(a.length/2),1);for(var n=0;n<a.length/2;n++){var r=t[a[a.length/2-n-1]];i(r,e.horizontalPosition-110*(n+1)),r.canMove=!1,i(r=t[a[a.length/2+n]],e.horizontalPosition+110*(n+1)),r.canMove=!1}}else i(t[a[0]],e.horizontalPosition)}(c)}else{var l=r.map((function(e){return t[e].horizontalPosition})).reduce((function(e,t){return e+t}),0);i(a,l/r.length)}};for(r.s();!(n=r.n()).done;)o()}catch(p){r.e(p)}finally{r.f()}}function u(e){var n,r=a[e.rank].map((function(e){return t[e]})),o=Object(Le.a)(r);try{for(o.s();!(n=o.n()).done;){if(d(e,n.value))return!0}}catch(p){o.e(p)}finally{o.f()}return!1}function d(e,t){return!function(e,t){return e.label===t.label}(e,t)&&(!isNaN(e.rank)&&!isNaN(e.horizontalPosition)&&!isNaN(t.rank)&&!isNaN(t.horizontalPosition)&&e.rank===t.rank&&e.horizontalPosition===t.horizontalPosition)}function s(e,n){e.children.forEach((function(r){var o=t[r];o.rank<e.rank?(a[o.rank].splice(a[o.rank].indexOf(r),1),m(r,n),s(o,n+1)):isNaN(o.rank)&&m(r,n)}))}function m(e,n){try{a[n].push(e)}catch(p){a[n]=[e]}finally{t[e].rank=n}}}(e)}var Ge=a(108),qe=a.n(Ge),Je=a(109),Ye=a.n(Je),Xe=a(910),$e=a(425),Ve=a.n($e),Ke=function(e){var t=e.Content,a=e.Trigger,n=e.popupPosition,o=e.open,c=e.setOpen,i=e.className;return r.a.createElement(Xe.a,{content:t,position:n||"bottom right",className:"".concat(Ve.a.pathwayPopup," ").concat(i),on:"click",open:o,onOpen:function(){c&&c(!0)},onClose:function(){c&&c(!1)},pinned:!0,trigger:a})},Qe=a(87),Ze=a.n(Qe),et=function(e){var t=e.type,a=e.onClick;return r.a.createElement("button",{className:"".concat(Ze.a.largeActionButton," button ").concat("decline"===t&&Ze.a.largeDecline),type:"button",onClick:a},t[0].toUpperCase()+t.slice(1))},tt=function(e){var t=e.type,a=e.onClick;return r.a.createElement("div",{className:"".concat("accept"===t?Ze.a.accept:Ze.a.decline," ").concat(Ze.a.smallActionButton),onClick:a,"data-testid":t},r.a.createElement(d.a,{icon:"accept"===t?s.b:s.p}))},at=function(e){var t=e.type,a=e.onClick;return r.a.createElement("div",{className:"".concat("accept"===t?Ze.a.accept:Ze.a.decline," ").concat(Ze.a.mediumActionButton),onClick:a,"data-testid":t},r.a.createElement(d.a,{icon:"accept"===t?s.b:s.p}),{accept:"Submit",decline:"Cancel"}[t])},nt=function(e){var t=e.type,a=e.size,n=e.onClick;switch(a){case"small":return r.a.createElement(tt,{type:t,onClick:n});case"large":return r.a.createElement(et,{type:t,onClick:n});case"medium":return r.a.createElement(at,{type:t,onClick:n})}},rt=function(e){var t=e.values,a=e.setOpen,o=Object(n.useState)(!1),c=Object(u.a)(o,2),i=c[0],l=c[1],d=Object(n.useState)(""),s=Object(u.a)(d,2),m=s[0],p=s[1];return r.a.createElement("div",null,r.a.createElement("div",{className:Ye.a.popupContent},"Select Value:",r.a.createElement("div",null,t.map((function(e){return r.a.createElement("div",{key:e,className:Ye.a.popupChoice+" "+(m===e?Ye.a.selected:""),onClick:function(){i&&m===e?(l(!1),p("")):(l(!0),p(e))}},e)})))),r.a.createElement("div",{className:Ye.a.footer},r.a.createElement(nt,{size:"small",type:"decline",onClick:function(){return a(!1)}}),i&&r.a.createElement(nt,{size:"small",type:"accept",onClick:function(){a(!1)}})))},ot=function(e){var t=e.values,a=Object(n.useState)(!1),o=Object(u.a)(a,2),c=o[0],i=o[1];return r.a.createElement(Ke,{Content:r.a.createElement(rt,{values:t,setOpen:i}),className:Ye.a.missingDataPopup,Trigger:r.a.createElement("div",{className:Ye.a.popupTrigger},"missing data",r.a.createElement(d.a,{icon:s.g,className:Ye.a.externalLink})),open:c,setOpen:i})},ct=a(169),it=a.n(ct);function lt(e){var t=e.action;return!!t&&t.length>0}var ut=Object(n.memo)((function(e){var t=e.pathwayState,a=(e.isActionable,e.isGuidance);return r.a.createElement(r.a.Fragment,null,r.a.createElement(st,{isGuidance:a,pathwayState:t}))})),dt=function(e){var t=e.title,a=e.description;return r.a.createElement("tr",null,r.a.createElement("td",{className:it.a.descTitle},t),r.a.createElement("td",{className:it.a.desc},a))};var st=Object(n.memo)((function(e){var t,a=e.pathwayState,n=e.isGuidance&&function(e){var t,a,n=e.action[0].resource,o=void 0!==n.medicationCodeableConcept?null===n||void 0===n||null===(t=n.medicationCodeableConcept)||void 0===t?void 0:t.coding:null===n||void 0===n||null===(a=n.code)||void 0===a?void 0:a.coding;return[r.a.createElement(dt,{key:"Notes",title:"Notes",description:e.action[0].description}),r.a.createElement(dt,{key:"Type",title:"Type",description:n.resourceType}),r.a.createElement(dt,{key:"System",title:"System",description:r.a.createElement(r.a.Fragment,null,o&&o[0].system,r.a.createElement("a",{href:o&&o[0].system,target:"_blank",rel:"noopener noreferrer"},r.a.createElement(d.a,{icon:s.i,className:it.a.externalLink})))}),r.a.createElement(dt,{key:"Code",title:"Code",description:o&&o[0].code}),r.a.createElement(dt,{key:"Display",title:"Display",description:o&&o[0].display})]}(a),o=!lt(t=a)&&t.transitions.length>1&&function(e){var t=[],a=e.transitions.map((function(e){var t,a=null===(t=e.condition)||void 0===t?void 0:t.description;return a||""})).filter((function(e,t,a){return a.indexOf(e)===t}));return t.push(r.a.createElement(dt,{key:"value",title:"Value",description:r.a.createElement(ot,{values:a})})),t}(a);return r.a.createElement("div",{className:"expandedNode"},r.a.createElement("table",{className:it.a.infoTable},r.a.createElement("tbody",null,n||o)))})),mt=ut,pt=Object(n.memo)(Object(n.forwardRef)((function(e,t){var a=e.name,o=e.pathwayState,c=e.isCurrentNode,i=e.xCoordinate,l=e.yCoordinate,u=e.expanded,d=void 0!==u&&u,s=e.onClick,m=Object(n.useCallback)((function(){s&&s(a)}),[s,a]),p=o.label,b={top:l,left:i},h=c,f=[qe.a.node],v="";d&&f.push("expanded"),h?(f.push(qe.a.actionable),v=qe.a.childActionable):v=qe.a.childNotActionable;var g=lt(o);return r.a.createElement("div",{className:f.join(" "),style:b,ref:t},r.a.createElement("div",{className:"nodeTitle ".concat(m&&"clickable"),onClick:m},r.a.createElement("div",{className:"iconAndLabel"},r.a.createElement(bt,{pathwayState:o,isGuidance:g}),p),r.a.createElement(ht,{status:null})),d&&r.a.createElement("div",{className:"".concat(qe.a.expandedNode," ").concat(v)},r.a.createElement(mt,{pathwayState:o,isActionable:h,isGuidance:g})))}))),bt=function(e){var t=e.pathwayState,a=e.isGuidance,n=s.j;if("Start"===t.label&&(n=s.k),a){var o=t;if(o.action.length>0){var c=o.action[0].resource.resourceType;"MedicationRequest"===c?n=s.m:"MedicationAdministration"===c?n=s.a:"Procedure"===c&&(n=s.o)}}return r.a.createElement(d.a,{icon:n,className:qe.a.icon})},ht=function(e){var t=e.status;if(null==t)return null;var a=t?s.c:s.q;return r.a.createElement("div",{className:"statusIcon"},r.a.createElement(d.a,{icon:a,className:qe.a.icon}))},ft=pt,vt=a(289),gt=a.n(vt),yt=function(e){var t=e.points,a=e.arrowheadId,n=e.widthOffset,o=t.map((function(e){return{x:e.x+n,y:e.y}})),c=o.length;o[c-1].y-=17.5;var i,l="M ".concat(o[0].x," ").concat(o[0].y," ");return i=c%3,l=o.reduce((function(e,t,a,n){return a%3!==i?e:"".concat(e," C ").concat(t.x," ").concat(t.y," ").concat(n[a+1].x," ").concat(n[a+1].y," ").concat(n[a+2].x,"\n        ").concat(n[a+2].y)}),l),r.a.createElement("path",{d:l,fill:"transparent",markerEnd:"url(#".concat(a,")")})},Et=function(e){var t=e.edge,a=e.edgeName,n=e.widthOffset,o=gt.a.arrow,c=a.replace(" ",""),i="arrowhead-".concat(c),l=t.label;return r.a.createElement("svg",{className:o},r.a.createElement(yt,{points:t.points,arrowheadId:i,widthOffset:n}),l?r.a.createElement("text",{x:l.x+n,y:l.y},l.text):null,r.a.createElement("defs",null,r.a.createElement("marker",{id:i,className:gt.a.arrowhead,markerWidth:"10",markerHeight:"7",refX:"0",refY:"3.5",orient:"auto"},r.a.createElement("polygon",{points:"0 0, 10 3.5, 0 7"}))))},Ot=a(434),jt=a.n(Ot),Ct=a(435),kt=a.n(Ct),Nt=Object(n.memo)((function(e){var t,a,o,c=e.pathway,i=e.interactive,l=void 0===i||i,d=(e.expandCurrentNode,Object(n.useRef)(null)),s=Object(n.useRef)({}),m=Object(n.useState)(null!==(t=null===d||void 0===d||null===(a=d.current)||void 0===a||null===(o=a.parentElement)||void 0===o?void 0:o.clientWidth)&&void 0!==t?t:0),p=Object(u.a)(m,2),b=p[0],f=p[1],v=Object(n.useCallback)((function(){var e={};return(null===s||void 0===s?void 0:s.current)&&Object.keys(s.current).forEach((function(t){var a=s.current[t],n=a.clientWidth,r=Array.from(a.children).reduce((function(e,t){return e+t.clientHeight}),0);e[t]={width:n,height:r}})),Ue(c,e)}),[c]),g=Object(n.useState)(v()),y=Object(u.a)(g,2),E=y[0],O=y[1],j=E.nodeCoordinates,C=E.edges,k=Object(n.useMemo)((function(){return void 0!==j?Object.values(j).map((function(e){return e.y})).reduce((function(e,t){return Math.max(e,t)})):0}),[j]),N=void 0!==j?Object.values(j).map((function(e){return e.x+b/2})).reduce((function(e,t){return Math.min(e,t)})):0;if(N<0){var w=-1*N;Object.keys(j).forEach((function(e){j[e].x+=w})),Object.keys(C).forEach((function(e){var t=C[e];t.points.forEach((function(e){return e.x+=w})),t.label&&(t.label.x+=w)}))}var x=Object(n.useState)((function(){return Object.keys(E).reduce((function(e,t){return e[t]=!1,e}),{lastSelectedNode:null})})),_=Object(u.a)(x,2),S=_[0],P=_[1],T=Object(n.useCallback)((function(e){P((function(t){var a;return Object(h.a)({},t,(a={},Object(ue.a)(a,e,t[e]&&t.lastSelectedNode!==e?t[e]:!t[e]),Object(ue.a)(a,"lastSelectedNode",e),a))}))}),[]);Object(n.useEffect)((function(){var e;(null===(e=d.current)||void 0===e?void 0:e.parentElement)&&new kt.a(d.current.parentElement,(function(){var e,t,a;f(null!==(e=null===(t=d.current)||void 0===t||null===(a=t.parentElement)||void 0===a?void 0:a.clientWidth)&&void 0!==e?e:0),O(v())}))}),[v]),Object(n.useEffect)((function(){O(v())}),[c,S,v]);var B=void 0!==C?Object.values(C).map((function(e){return e.label})).map((function(e){return e?e.x+10*e.text.length+b/2:0})).reduce((function(e,t){return Math.max(e,t)}),0):b;return r.a.createElement(wt,{graphElement:d,interactive:l,maxHeight:k,nodeCoordinates:j,edges:C,pathway:c,nodeRefs:s,parentWidth:b,maxWidth:B,expanded:S,toggleExpanded:T})})),wt=Object(n.memo)((function(e){var t=e.graphElement,a=e.interactive,o=e.maxHeight,c=e.nodeCoordinates,i=e.edges,u=e.pathway,d=e.nodeRefs,s=e.parentWidth,m=e.maxWidth,p=e.expanded,b=e.toggleExpanded,h=Object(l.h)().id,f=Object(l.g)(),v=Object(n.useCallback)((function(e){var t="/builder/".concat(encodeURIComponent(h),"/node/").concat(encodeURIComponent(e));t!==f.location.pathname&&f.push(t)}),[f,h]),g=Object(n.useCallback)((function(e){a&&(v(e),b(e))}),[v,b,a]);return r.a.createElement("div",{ref:t,id:"graph-root",className:jt.a.root,style:{height:a?o+150:"inherit",width:m+"px",position:"relative",marginRight:"5px"}},void 0!==c?Object.keys(c).map((function(e){return r.a.createElement(ft,{key:e,name:e,ref:function(t){d.current[e]=t},pathwayState:u.states[e],isCurrentNode:!1,xCoordinate:c[e].x+s/2,yCoordinate:c[e].y,expanded:Boolean(p[e]),onClick:g})})):[],r.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",style:{width:m+5,height:o,zIndex:1,top:0,left:0,overflow:"visible"}},void 0!==i?Object.keys(i).map((function(e){var t=i[e];return r.a.createElement(Et,{key:e,edge:t,edgeName:e,widthOffset:s/2})})):[]))})),xt=Nt,_t=a(290),St=a.n(_t),Pt=Object(n.memo)((function(e){var t=e.pathway,a=e.updatePathway,o=e.currentNode,c=Object(n.useRef)(null),i=Object(n.useRef)(null),l=function(e){var t=Object(n.useContext)(S).useProjector;return _({theme:e,useProjector:t})}("dark");return Object(n.useEffect)((function(){(null===i||void 0===i?void 0:i.current)&&(null===c||void 0===c?void 0:c.current)&&(i.current.style.height=window.innerHeight-c.current.clientHeight+"px")}),[t,c,i]),r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{ref:c},r.a.createElement(A,null),r.a.createElement(ge,{pathway:t})),r.a.createElement("div",{className:St.a.display},r.a.createElement(b.a,{theme:l},r.a.createElement(Ee,{pathway:t,updatePathway:a,headerElement:c,currentNode:o})),r.a.createElement("div",{ref:i,className:St.a.graph},r.a.createElement(xt,{pathway:t,expandCurrentNode:!0}))))})),Tt=Object(n.memo)((function(){var e,t=Object(l.h)(),a=t.id,o=t.nodeId,c=H(),i=c.pathways,u=c.updatePathwayAtIndex,d=decodeURIComponent(a),s=Object(n.useMemo)((function(){return i.findIndex((function(e){return e.id===d}))}),[d,i]),m=i[s],p=null===m||void 0===m||null===(e=m.states)||void 0===e?void 0:e[decodeURIComponent(o)],b=Object(n.useCallback)((function(e){u(e,s)}),[s,u]);return null==m?null:null==p?r.a.createElement(l.a,{to:"/builder/".concat(a,"/node/Start")}):r.a.createElement(Pt,{pathway:m,updatePathway:b,currentNode:p})})),Bt=Object(n.createContext)({}),It=function(e){var t=e.children,a=Object(n.useState)(null),o=Object(u.a)(a,2),c=o[0],i=o[1];return r.a.createElement(Bt.Provider,{value:{user:c,setUser:i}},t)},Mt=Object(n.memo)((function(){return r.a.createElement(P,{theme:"light"},r.a.createElement(It,null,r.a.createElement(W,null,r.a.createElement(i.a,null,r.a.createElement(l.d,null,r.a.createElement(l.b,{path:"/builder/:id/node/:nodeId"},r.a.createElement(Tt,null)),r.a.createElement(l.b,{path:"/builder/:id"},r.a.createElement(Tt,null)),r.a.createElement(l.b,{path:"/"},r.a.createElement(A,null),r.a.createElement(fe,null)))))))}));a(857);c.a.render(r.a.createElement(Mt,null),document.getElementById("root"))},87:function(e,t,a){e.exports={selectButton:"ActionButton_selectButton___qB5R",accept:"ActionButton_accept__28b2D",decline:"ActionButton_decline__zz-vG",smallActionButton:"ActionButton_smallActionButton__1bPWu",largeActionButton:"ActionButton_largeActionButton__blRdA",largeDecline:"ActionButton_largeDecline__wz9Zw",mediumActionButton:"ActionButton_mediumActionButton__3EpOp"}}},[[453,1,2]]]);
//# sourceMappingURL=main.13d3f5e8.chunk.js.map