const pt = globalThis, zt = pt.ShadowRoot && (pt.ShadyCSS === void 0 || pt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ot = /* @__PURE__ */ Symbol(), Zt = /* @__PURE__ */ new WeakMap();
let pe = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== Ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (zt && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Zt.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Zt.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Te = (t) => new pe(typeof t == "string" ? t : t + "", void 0, Ot), U = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, a, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[r + 1], t[0]);
  return new pe(s, t, Ot);
}, He = (t, e) => {
  if (zt) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), a = pt.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = s.cssText, t.appendChild(i);
  }
}, Gt = zt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return Te(s);
})(t) : t;
const { is: ze, defineProperty: Oe, getOwnPropertyDescriptor: Ne, getOwnPropertyNames: Re, getOwnPropertySymbols: Ue, getPrototypeOf: je } = Object, vt = globalThis, Yt = vt.trustedTypes, De = Yt ? Yt.emptyScript : "", qe = vt.reactiveElementPolyfillSupport, tt = (t, e) => t, mt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? De : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, Nt = (t, e) => !ze(t, e), Wt = { attribute: !0, type: String, converter: mt, reflect: !1, useDefault: !1, hasChanged: Nt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), vt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Wt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), a = this.getPropertyDescriptor(e, i, s);
      a !== void 0 && Oe(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: a, set: r } = Ne(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: a, set(n) {
      const c = a?.call(this);
      r?.call(this, n), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Wt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(tt("elementProperties"))) return;
    const e = je(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(tt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(tt("properties"))) {
      const s = this.properties, i = [...Re(s), ...Ue(s)];
      for (const a of i) this.createProperty(a, s[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, a] of s) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const a = this._$Eu(s, i);
      a !== void 0 && this._$Eh.set(a, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) s.unshift(Gt(a));
    } else e !== void 0 && s.push(Gt(e));
    return s;
  }
  static _$Eu(e, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return He(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, s, i) {
    this._$AK(e, i);
  }
  _$ET(e, s) {
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : mt).toAttribute(s, i.type);
      this._$Em = e, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const r = i.getPropertyOptions(a), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : mt;
      this._$Em = a;
      const c = n.fromAttribute(s, r.type);
      this[a] = c ?? this._$Ej?.get(a) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, a = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (a === !1 && (r = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? Nt)(r, s) || i.useDefault && i.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: a, wrapped: r }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, r] of i) {
        const { wrapped: n } = r, c = this[a];
        n !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, r, c);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[tt("elementProperties")] = /* @__PURE__ */ new Map(), D[tt("finalized")] = /* @__PURE__ */ new Map(), qe?.({ ReactiveElement: D }), (vt.reactiveElementVersions ??= []).push("2.1.2");
const Rt = globalThis, Xt = (t) => t, _t = Rt.trustedTypes, Qt = _t ? _t.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, ue = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + I, Fe = `<${me}>`, N = document, st = () => N.createComment(""), it = (t) => t === null || typeof t != "object" && typeof t != "function", Ut = Array.isArray, Be = (t) => Ut(t) || typeof t?.[Symbol.iterator] == "function", wt = `[ 	
\f\r]`, Q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Jt = /-->/g, te = />/g, z = RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ee = /'/g, se = /"/g, _e = /^(?:script|style|textarea|title)$/i, ge = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), o = ge(1), Ke = ge(2), B = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), ie = /* @__PURE__ */ new WeakMap(), O = N.createTreeWalker(N, 129);
function fe(t, e) {
  if (!Ut(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qt !== void 0 ? Qt.createHTML(e) : e;
}
const Ze = (t, e) => {
  const s = t.length - 1, i = [];
  let a, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Q;
  for (let c = 0; c < s; c++) {
    const h = t[c];
    let m, f, p = -1, x = 0;
    for (; x < h.length && (n.lastIndex = x, f = n.exec(h), f !== null); ) x = n.lastIndex, n === Q ? f[1] === "!--" ? n = Jt : f[1] !== void 0 ? n = te : f[2] !== void 0 ? (_e.test(f[2]) && (a = RegExp("</" + f[2], "g")), n = z) : f[3] !== void 0 && (n = z) : n === z ? f[0] === ">" ? (n = a ?? Q, p = -1) : f[1] === void 0 ? p = -2 : (p = n.lastIndex - f[2].length, m = f[1], n = f[3] === void 0 ? z : f[3] === '"' ? se : ee) : n === se || n === ee ? n = z : n === Jt || n === te ? n = Q : (n = z, a = void 0);
    const $ = n === z && t[c + 1].startsWith("/>") ? " " : "";
    r += n === Q ? h + Fe : p >= 0 ? (i.push(m), h.slice(0, p) + ue + h.slice(p) + I + $) : h + I + (p === -2 ? c : $);
  }
  return [fe(t, r + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class at {
  constructor({ strings: e, _$litType$: s }, i) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const c = e.length - 1, h = this.parts, [m, f] = Ze(e, s);
    if (this.el = at.createElement(m, i), O.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = O.nextNode()) !== null && h.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(ue)) {
          const x = f[n++], $ = a.getAttribute(p).split(I), C = /([.?@])?(.*)/.exec(x);
          h.push({ type: 1, index: r, name: C[2], strings: $, ctor: C[1] === "." ? Ye : C[1] === "?" ? We : C[1] === "@" ? Xe : bt }), a.removeAttribute(p);
        } else p.startsWith(I) && (h.push({ type: 6, index: r }), a.removeAttribute(p));
        if (_e.test(a.tagName)) {
          const p = a.textContent.split(I), x = p.length - 1;
          if (x > 0) {
            a.textContent = _t ? _t.emptyScript : "";
            for (let $ = 0; $ < x; $++) a.append(p[$], st()), O.nextNode(), h.push({ type: 2, index: ++r });
            a.append(p[x], st());
          }
        }
      } else if (a.nodeType === 8) if (a.data === me) h.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(I, p + 1)) !== -1; ) h.push({ type: 7, index: r }), p += I.length - 1;
      }
      r++;
    }
  }
  static createElement(e, s) {
    const i = N.createElement("template");
    return i.innerHTML = e, i;
  }
}
function K(t, e, s = t, i) {
  if (e === B) return e;
  let a = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const r = it(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(t), a._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = a : s._$Cl = a), a !== void 0 && (e = K(t, a._$AS(t, e.values), a, i)), e;
}
class Ge {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: i } = this._$AD, a = (e?.creationScope ?? N).importNode(s, !0);
    O.currentNode = a;
    let r = O.nextNode(), n = 0, c = 0, h = i[0];
    for (; h !== void 0; ) {
      if (n === h.index) {
        let m;
        h.type === 2 ? m = new ot(r, r.nextSibling, this, e) : h.type === 1 ? m = new h.ctor(r, h.name, h.strings, this, e) : h.type === 6 && (m = new Qe(r, this, e)), this._$AV.push(m), h = i[++c];
      }
      n !== h?.index && (r = O.nextNode(), n++);
    }
    return O.currentNode = N, a;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class ot {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, a) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = K(this, e, s), it(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== B && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Be(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && it(this._$AH) ? this._$AA.nextSibling.data = e : this.T(N.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = at.createElement(fe(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(s);
    else {
      const r = new Ge(a, this), n = r.u(this.options);
      r.p(s), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let s = ie.get(e.strings);
    return s === void 0 && ie.set(e.strings, s = new at(e)), s;
  }
  k(e) {
    Ut(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, a = 0;
    for (const r of e) a === s.length ? s.push(i = new ot(this.O(st()), this.O(st()), this, this.options)) : i = s[a], i._$AI(r), a++;
    a < s.length && (this._$AR(i && i._$AB.nextSibling, a), s.length = a);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = Xt(e).nextSibling;
      Xt(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class bt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, a, r) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = s, this._$AM = a, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(e, s = this, i, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = K(this, e, s, 0), n = !it(e) || e !== this._$AH && e !== B, n && (this._$AH = e);
    else {
      const c = e;
      let h, m;
      for (e = r[0], h = 0; h < r.length - 1; h++) m = K(this, c[i + h], s, h), m === B && (m = this._$AH[h]), n ||= !it(m) || m !== this._$AH[h], m === l ? e = l : e !== l && (e += (m ?? "") + r[h + 1]), this._$AH[h] = m;
    }
    n && !a && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ye extends bt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class We extends bt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class Xe extends bt {
  constructor(e, s, i, a, r) {
    super(e, s, i, a, r), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = K(this, e, s, 0) ?? l) === B) return;
    const i = this._$AH, a = e === l && i !== l || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== l && (i === l || a);
    a && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Qe {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    K(this, e);
  }
}
const Je = Rt.litHtmlPolyfillSupport;
Je?.(at, ot), (Rt.litHtmlVersions ??= []).push("3.3.3");
const ts = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const r = s?.renderBefore ?? null;
    i._$litPart$ = a = new ot(e.insertBefore(st(), r), r, void 0, s ?? {});
  }
  return a._$AI(t), a;
};
const jt = globalThis;
class k extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ts(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return B;
  }
}
k._$litElement$ = !0, k.finalized = !0, jt.litElementHydrateSupport?.({ LitElement: k });
const es = jt.litElementPolyfillSupport;
es?.({ LitElement: k });
(jt.litElementVersions ??= []).push("4.2.2");
const j = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const ss = { attribute: !0, type: String, converter: mt, reflect: !1, hasChanged: Nt }, is = (t = ss, e, s) => {
  const { kind: i, metadata: a } = s;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), r.set(s.name, t), i === "accessor") {
    const { name: n } = s;
    return { set(c) {
      const h = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, h, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(c) {
      const h = this[n];
      e.call(this, c), this.requestUpdate(n, h, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function u(t) {
  return (e, s) => typeof s == "object" ? is(t, e, s) : ((i, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(t, e, s);
}
function _(t) {
  return u({ ...t, state: !0, attribute: !1 });
}
const as = (t, e, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, s), s);
function rs(t, e) {
  return (s, i, a) => {
    const r = (n) => n.renderRoot?.querySelector(t) ?? null;
    return as(s, i, { get() {
      return r(this);
    } });
  };
}
const ve = (t) => !!t && t.entity_id.startsWith("media_player.") && "mass_player_type" in t.attributes;
function ns(t, e) {
  const i = (e.players?.length ? e.players : Object.keys(t.states).filter((a) => ve(t.states[a]))).map((a) => t.states[a]).filter((a) => !!a).map((a) => os(a)).filter((a) => a.available || e.hide_unavailable === !1);
  return e.players?.length ? i : i.sort(
    (a, r) => a.isGroup === r.isGroup ? a.name.localeCompare(r.name, "sv") : a.isGroup ? -1 : 1
  );
}
function os(t) {
  return {
    id: t.entity_id,
    name: t.attributes.friendly_name ?? t.entity_id,
    entity: t,
    isGroup: t.attributes.mass_player_type === "group",
    available: t.state !== "unavailable" && t.state !== "unknown",
    playing: t.state === "playing"
  };
}
const St = (t) => t?.attributes.group_members ?? [];
function be(t, e) {
  const s = St(t.states[e]);
  if (s.length > 1 && s[0] !== e && s.includes(e) && t.states[s[0]]) return s[0];
  for (const [i, a] of Object.entries(t.states)) {
    if (i === e || !ve(a) || a.attributes.mass_player_type === "group") continue;
    const r = St(a);
    if (r.length > 1 && r[0] === i && r.includes(e)) return i;
  }
  return e;
}
function ls(t, e) {
  const s = t.states[e];
  return !s || s.attributes.mass_player_type === "group" ? [] : St(s).filter((i) => i !== e);
}
function L(t) {
  return t ? !["off", "unavailable", "unknown", "standby"].includes(t.state) && !!(t.attributes.media_title || t.attributes.media_content_id) : !1;
}
function cs(t, e, s) {
  if (s && e.states[s]) return s;
  const i = t.filter((a) => a.entity.attributes.app_id === "music_assistant");
  return i.find((a) => a.playing)?.id ?? t.find((a) => a.playing)?.id ?? i.find((a) => a.entity.state === "paused")?.id ?? t[0]?.id;
}
const ye = 15e3;
class hs extends Error {
  constructor(e, s) {
    super(`${e}: no answer within ${s / 1e3} s`), this.name = "TimeoutError";
  }
}
function ds(t, e, s) {
  let i;
  return Promise.race([
    t,
    new Promise((a, r) => {
      i = window.setTimeout(() => r(new hs(e, s)), s);
    })
  ]).finally(() => clearTimeout(i));
}
async function T(t, e, s, i = {}, a, r = !1, n = ye) {
  return (await ds(
    t.callWS({
      type: "call_service",
      domain: e,
      service: s,
      service_data: i,
      ...a ? { target: { entity_id: a } } : {},
      ...r ? { return_response: !0 } : {}
    }),
    `${e}.${s}`,
    n
  ))?.response;
}
let dt;
async function ps(t, e) {
  if (e && e !== "auto") return e;
  if (dt) return dt;
  const s = await t.callWS({
    type: "config_entries/get",
    domain: "music_assistant"
  }), i = s.find((a) => a.state === "loaded") ?? s[0];
  if (!i) throw new Error("Music Assistant integration not found");
  return dt = i.entry_id, dt;
}
const xe = (t) => !!t.name?.trim();
async function kt(t, e, s, i, a, r = !1) {
  const n = await T(
    t,
    "music_assistant",
    "search",
    { config_entry_id: e, name: s, media_type: i, limit: a, ...r ? { library_only: !0 } : {} },
    void 0,
    !0,
    // Provider searches (Spotify, TuneIn, …) can be slow when nothing is cached.
    r ? ye : 45e3
  ), c = {};
  for (const [h, m] of Object.entries(n ?? {})) c[h] = (m ?? []).filter(xe);
  return c;
}
async function ae(t, e, s, i = {}) {
  return ((await T(
    t,
    "music_assistant",
    "get_library",
    { config_entry_id: e, media_type: s, limit: i.limit ?? 30, ...i },
    void 0,
    !0
  ))?.items ?? []).filter(xe);
}
function us(t, e, s, i, a = !1) {
  return T(
    t,
    "music_assistant",
    "play_media",
    {
      media_id: s.uri,
      media_type: s.media_type,
      enqueue: i,
      ...a ? { radio_mode: !0 } : {}
    },
    e
  );
}
async function ms(t, e) {
  return (await T(
    t,
    "music_assistant",
    "get_queue",
    {},
    e,
    !0
  ))?.[e] ?? null;
}
const _s = (t, e, s) => T(t, "music_assistant", "transfer_queue", { source_player: e, auto_play: !0 }, s), gs = (t, e, s) => T(t, "media_player", "join", { group_members: s }, e), fs = (t, e) => T(t, "media_player", "unjoin", {}, e), Z = (t, e, s, i = {}) => T(t, "media_player", s, i, e), vs = {
  search: "Sök musik",
  search_placeholder: "Sök artist, album, låt, spellista…",
  speakers: "Högtalare",
  close: "Stäng",
  nothing_playing: "Ingenting spelas",
  nothing_playing_hint: "Sök efter musik eller välj en favorit för att börja spela.",
  next_up: "Nästa",
  grouped_with: "Spelar i grupp med",
  group_volume: "Gruppvolym",
  in_group: "I gruppen",
  add_to_group: "Lägg till",
  remove_from_group: "Ta bort ur gruppen",
  transfer_here: "Flytta musiken hit",
  select: "Välj",
  active: "Aktiv",
  idle: "Inaktiv",
  playing: "Spelar",
  paused: "Pausad",
  off: "Av",
  unavailable: "Ej tillgänglig",
  all: "Allt",
  artists: "Artister",
  albums: "Album",
  tracks: "Låtar",
  playlists: "Spellistor",
  radio: "Radio",
  podcasts: "Podcasts",
  audiobooks: "Ljudböcker",
  favorites: "Favoriter",
  recent: "Senast spelade",
  no_results: "Inga träffar",
  searching: "Söker…",
  searching_more: "Söker i fler källor…",
  search_failed: "Sökningen misslyckades",
  retry: "Försök igen",
  play_now: "Spela nu",
  play_next: "Spela härnäst",
  add_to_queue: "Lägg sist i kön",
  start_radio: "Starta radio",
  playing_on: "Spelar på",
  added_to_queue: "Tillagd i kön",
  error: "Något gick fel",
  mute: "Ljud av",
  unmute: "Ljud på",
  group: "Grupp",
  members: "Medlemmar"
}, bs = {
  search: "Search music",
  search_placeholder: "Search artist, album, track, playlist…",
  speakers: "Speakers",
  close: "Close",
  nothing_playing: "Nothing playing",
  nothing_playing_hint: "Search for music or pick a favorite to start playing.",
  next_up: "Next",
  grouped_with: "Playing in a group with",
  group_volume: "Group volume",
  in_group: "In group",
  add_to_group: "Add",
  remove_from_group: "Remove from group",
  transfer_here: "Move music here",
  select: "Select",
  active: "Active",
  idle: "Idle",
  playing: "Playing",
  paused: "Paused",
  off: "Off",
  unavailable: "Unavailable",
  all: "All",
  artists: "Artists",
  albums: "Albums",
  tracks: "Tracks",
  playlists: "Playlists",
  radio: "Radio",
  podcasts: "Podcasts",
  audiobooks: "Audiobooks",
  favorites: "Favorites",
  recent: "Recently played",
  no_results: "No results",
  searching: "Searching…",
  searching_more: "Searching more sources…",
  search_failed: "Search failed",
  retry: "Try again",
  play_now: "Play now",
  play_next: "Play next",
  add_to_queue: "Add to end of queue",
  start_radio: "Start radio",
  playing_on: "Playing on",
  added_to_queue: "Added to queue",
  error: "Something went wrong",
  mute: "Mute",
  unmute: "Unmute",
  group: "Group",
  members: "Members"
}, re = (t) => {
  const e = t === "en" ? bs : vs;
  return (s) => e[s] ?? s;
}, J = /* @__PURE__ */ new Map();
async function ys(t) {
  if (J.has(t)) return J.get(t);
  const e = await new Promise((s) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.onload = () => {
      try {
        const r = document.createElement("canvas");
        r.width = r.height = 24;
        const n = r.getContext("2d", { willReadFrequently: !0 });
        n.drawImage(i, 0, 0, 24, 24);
        const c = n.getImageData(0, 0, 24, 24).data;
        let h = 0, m = 0, f = 0, p = 0;
        for (let x = 0; x < c.length; x += 4) {
          const [$, C, X] = [c[x], c[x + 1], c[x + 2]], ct = Math.max($, C, X), Pe = Math.min($, C, X), Bt = ct === 0 ? 0 : (ct - Pe) / ct, Kt = ct / 255, ht = 0.05 + Bt * Bt * (Kt > 0.15 && Kt < 0.95 ? 1 : 0.2);
          h += $ * ht, m += C * ht, f += X * ht, p += ht;
        }
        s(xs(h / p, m / p, f / p));
      } catch {
        s(null);
      }
    }, i.onerror = () => s(null), i.src = t;
  });
  return J.size > 50 && J.clear(), J.set(t, e), e;
}
function xs(t, e, s) {
  const i = Math.max(t, e, s, 1), r = Math.min(Math.max(i, 140), 230) / i;
  return [t, e, s].map((n) => Math.round(Math.min(255, n * r))).join(", ");
}
const b = {
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  SHUFFLE_SET: 32768,
  REPEAT_SET: 262144,
  GROUPING: 524288
}, y = (t, e) => !!t && ((t.attributes.supported_features ?? 0) & e) !== 0;
function F(t, e) {
  const s = e?.attributes.entity_picture_local || e?.attributes.entity_picture;
  if (s)
    return /^https?:/.test(s) ? s : t.hassUrl ? t.hassUrl(s) : s;
}
function gt(t) {
  if (t === void 0 || !Number.isFinite(t) || t < 0) return "–:––";
  const e = Math.floor(t), s = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), a = String(e % 60).padStart(2, "0");
  return s ? `${s}:${String(i).padStart(2, "0")}:${a}` : `${i}:${a}`;
}
function Mt(t) {
  const e = t?.attributes;
  if (!e || e.media_position === void 0) return;
  let s = Number(e.media_position);
  t.state === "playing" && e.media_position_updated_at && (s += (Date.now() - new Date(e.media_position_updated_at).getTime()) / 1e3);
  const i = Number(e.media_duration);
  return i > 0 ? Math.min(s, i) : s;
}
const $e = (t, e) => Number(t.states[e]?.attributes.volume_level ?? 0), yt = (t, e) => e.length ? e.reduce((s, i) => s + $e(t, i), 0) / e.length : 0;
function Dt(t, e, s) {
  const i = s - yt(t, e);
  return Promise.all(
    e.map(
      (a) => Z(t, a, "volume_set", {
        volume_level: $s(Math.min(1, Math.max(0, $e(t, a) + i)))
      })
    )
  );
}
const $s = (t) => Math.round(t * 100) / 100, It = (t) => [t?.attributes.media_artist, t?.attributes.media_album_name].filter(Boolean).join(" · ");
var ws = "M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z", ks = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z", As = "M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z", Cs = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z", we = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", ke = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", ne = "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z", ft = "M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3", rt = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", xt = "M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z", Pt = "M14,19H18V5H14M6,19H10V5H6V19Z", nt = "M8,5.14V19.14L19,12.14L8,5.14Z", Es = "M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z", Vs = "M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z", Ls = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z", Ss = "M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z", Ms = "M20,6A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8C2,7.15 2.53,6.42 3.28,6.13L15.71,1L16.47,2.83L8.83,6H20M20,8H4V12H16V10H18V12H20V8M7,14A3,3 0 0,0 4,17A3,3 0 0,0 7,20A3,3 0 0,0 10,17A3,3 0 0,0 7,14Z", Is = "M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z", Ae = "M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z", Ce = "M2,5.27L3.28,4L20,20.72L18.73,22L15.73,19H7V22L3,18L7,14V17H13.73L7,10.27V11H5V8.27L2,5.27M17,13H19V17.18L17,15.18V13M17,5V2L21,6L17,10V7H8.82L6.82,5H17Z", Ee = "M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z", Ve = "M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z", Le = "M16,4.5V7H5V9H16V11.5L19.5,8M16,12.5V15H5V17H16V19.5L19.5,16", Ps = "M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12", Tt = "M16,18H18V6H16M6,18L14.5,12L6,6V18Z", Ht = "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z", Ts = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", G = "M14,10A3,3 0 0,0 11,13A3,3 0 0,0 14,16A3,3 0 0,0 17,13A3,3 0 0,0 14,10M14,18A5,5 0 0,1 9,13A5,5 0 0,1 14,8A5,5 0 0,1 19,13A5,5 0 0,1 14,18M14,2A2,2 0 0,1 16,4A2,2 0 0,1 14,6A2,2 0 0,1 12,4A2,2 0 0,1 14,2M19,0H9A2,2 0 0,0 7,2V18A2,2 0 0,0 9,20H19A2,2 0 0,0 21,18V2A2,2 0 0,0 19,0M5,22H17V24H5A2,2 0 0,1 3,22V4H5", Hs = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", qt = "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z", Se = "M7,9V15H11L16,20V4L11,9H7Z", Me = "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z", Ft = "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z";
const d = (t) => Ke`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${t}></path></svg>`;
var zs = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, lt = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Os(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && zs(e, s, a), a;
};
let R = class extends k {
  constructor() {
    super(...arguments), this.value = 0, this.disabled = !1, this.label = "", this._dragValue = null, this._holdUntil = 0, this._heldValue = 0;
  }
  get _shown() {
    return this._dragValue !== null ? this._dragValue : Date.now() < this._holdUntil ? this._heldValue : oe(this.value);
  }
  render() {
    const t = `${this._shown * 100}%`;
    return o`
      <div
        class="track"
        role="slider"
        aria-label=${this.label}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${Math.round(this._shown * 100)}
        @pointerdown=${this._down}
        @pointermove=${this._move}
        @pointerup=${this._up}
        @pointercancel=${this._up}
      >
        <div class="rail"><div class="fill" style="width:${t}"></div></div>
        <div class="thumb" style="left:${t}"></div>
      </div>
    `;
  }
  _valueAt(t) {
    const e = this.getBoundingClientRect();
    return oe((t.clientX - e.left) / e.width);
  }
  _down(t) {
    this.disabled || (t.currentTarget.setPointerCapture(t.pointerId), this._dragValue = this._valueAt(t), this._emit("value-input", this._dragValue));
  }
  _move(t) {
    this._dragValue !== null && (this._dragValue = this._valueAt(t), this._emit("value-input", this._dragValue));
  }
  _up() {
    if (this._dragValue === null) return;
    const t = this._dragValue;
    this._dragValue = null, this._heldValue = t, this._holdUntil = Date.now() + 2e3, this._emit("value-change", t), setTimeout(() => this.requestUpdate(), 2050);
  }
  _emit(t, e) {
    this.dispatchEvent(new CustomEvent(t, { detail: { value: e } }));
  }
};
R.styles = U`
    :host {
      --_h: var(--ma-slider-height, 12px);
      --_thumb: var(--ma-slider-thumb, 28px);
      display: block;
      height: max(var(--_thumb), 44px);
      touch-action: none;
      user-select: none;
      cursor: pointer;
    }
    :host([disabled]) {
      opacity: 0.4;
      pointer-events: none;
    }
    .track {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .rail {
      position: relative;
      width: 100%;
      height: var(--_h);
      border-radius: calc(var(--_h) / 2);
      background: var(--ma-slider-rail, rgba(255, 255, 255, 0.22));
      overflow: hidden;
    }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      background: var(--ma-slider-fill, #fff);
      border-radius: inherit;
    }
    .thumb {
      position: absolute;
      top: 50%;
      width: var(--_thumb);
      height: var(--_thumb);
      margin-left: calc(var(--_thumb) / -2);
      transform: translateY(-50%);
      border-radius: 50%;
      background: var(--ma-slider-thumb-color, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
  `;
lt([
  u({ type: Number })
], R.prototype, "value", 2);
lt([
  u({ type: Boolean, reflect: !0 })
], R.prototype, "disabled", 2);
lt([
  u()
], R.prototype, "label", 2);
lt([
  _()
], R.prototype, "_dragValue", 2);
R = lt([
  j("ma-slider")
], R);
const oe = (t) => Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
var Ns = Object.defineProperty, Rs = Object.getOwnPropertyDescriptor, W = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Rs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ns(e, s, a), a;
};
let P = class extends k {
  constructor() {
    super(...arguments), this.entityId = "", this.volumeIds = [], this.nextItem = null, this._lastVolSend = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => {
      this.hass?.states[this.entityId]?.state === "playing" && this.requestUpdate();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._timer);
  }
  render() {
    const t = this.hass.states[this.entityId];
    if (!t) return l;
    const e = this.localize, s = L(t), i = s ? F(this.hass, t) : void 0;
    return o`
      <div class="art-wrap">
        ${i ? o`<img class="art" src=${i} alt="" />` : o`<div class="art placeholder">${d(xt)}</div>`}
      </div>
      <div class="info">
        ${s ? o`
              <div class="titles">
                <div class="title">${t.attributes.media_title ?? ""}</div>
                <div class="artist">${It(t)}</div>
              </div>
              ${this._renderProgress()} ${this._renderTransport()}
            ` : o`
              <div class="titles">
                <div class="title">${e("nothing_playing")}</div>
                <div class="artist hint">${e("nothing_playing_hint")}</div>
              </div>
              <div class="idle-actions">
                <button class="pill" @click=${() => this._fire("open-search")}>
                  ${d(rt)} ${e("search")}
                </button>
                <button class="pill" @click=${() => this._fire("open-speakers")}>
                  ${d(G)} ${e("speakers")}
                </button>
              </div>
            `}
        ${this._renderVolume()} ${s ? this._renderNext() : l}
      </div>
    `;
  }
  _renderProgress() {
    const t = this.hass.states[this.entityId], e = Number(t.attributes.media_duration), s = Mt(t);
    return e > 0 ? o`
      <div class="progress">
        <ma-slider
          class="seek"
          .value=${(s ?? 0) / e}
          ?disabled=${!y(t, b.SEEK)}
          @value-change=${(i) => this._call("media_seek", { seek_position: Math.round(i.detail.value * e) })}
        ></ma-slider>
        <div class="times"><span>${gt(s)}</span><span>${gt(e)}</span></div>
      </div>
    ` : o`<div class="progress-spacer"></div>`;
  }
  _renderTransport() {
    const t = this.hass.states[this.entityId], e = t.attributes, s = t.state === "playing", i = e.repeat ?? "off", a = i === "off" ? "all" : i === "all" ? "one" : "off";
    return o`
      <div class="transport">
        <button
          class="ctl small ${e.shuffle ? "on" : ""}"
          ?disabled=${!y(t, b.SHUFFLE_SET)}
          @click=${() => this._call("shuffle_set", { shuffle: !e.shuffle })}
        >
          ${d(e.shuffle ? Ve : Le)}
        </button>
        <button class="ctl" ?disabled=${!y(t, b.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
          ${d(Ht)}
        </button>
        <button class="ctl play" @click=${() => this._call("media_play_pause")}>
          ${d(s ? Pt : nt)}
        </button>
        <button class="ctl" ?disabled=${!y(t, b.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
          ${d(Tt)}
        </button>
        <button
          class="ctl small ${i !== "off" ? "on" : ""}"
          ?disabled=${!y(t, b.REPEAT_SET)}
          @click=${() => this._call("repeat_set", { repeat: a })}
        >
          ${d(i === "one" ? Ee : i === "all" ? Ae : Ce)}
        </button>
      </div>
    `;
  }
  _renderVolume() {
    const t = this.hass.states[this.entityId];
    if (!y(t, b.VOLUME_SET)) return l;
    const e = this.localize, s = this.volumeIds.length ? this.volumeIds : [this.entityId], i = s.length > 1, a = i ? yt(this.hass, s) : Number(t.attributes.volume_level ?? 0), r = !!t.attributes.is_volume_muted, n = r || a === 0 ? Ft : a < 0.33 ? Se : a < 0.66 ? Me : qt;
    return o`
      <div class="volume">
        <button
          class="ctl small"
          title=${e(r ? "unmute" : "mute")}
          ?disabled=${!y(t, b.VOLUME_MUTE)}
          @click=${() => this._call("volume_mute", { is_volume_muted: !r })}
        >
          ${d(n)}
        </button>
        <ma-slider
          class="vol"
          .value=${a}
          .label=${i ? e("group_volume") : ""}
          @value-input=${(c) => this._setVolume(s, c.detail.value, !0)}
          @value-change=${(c) => this._setVolume(s, c.detail.value, !1)}
        ></ma-slider>
        <span class="vol-pct">${Math.round(a * 100)}</span>
      </div>
      ${i ? o`<div class="vol-caption">${e("group_volume")} · ${s.length}</div>` : l}
    `;
  }
  _renderNext() {
    const t = this.nextItem;
    if (!t) return l;
    const e = t.media_item, s = e?.name ?? t.name, i = e?.artists?.map((a) => a.name).join(", ");
    return o`
      <div class="next">
        <span class="next-label">${this.localize("next_up")}</span>
        <span class="next-title">${s}${i ? o` <span class="dim">– ${i}</span>` : l}</span>
      </div>
    `;
  }
  _setVolume(t, e, s) {
    const i = Date.now();
    if (s && i - this._lastVolSend < 250) return;
    this._lastVolSend = i, (t.length > 1 ? Dt(this.hass, t, e) : Z(this.hass, t[0], "volume_set", { volume_level: Math.round(e * 100) / 100 })).catch((r) => this._error(r));
  }
  _call(t, e = {}) {
    Z(this.hass, this.entityId, t, e).catch((s) => this._error(s));
  }
  _error(t) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: t, bubbles: !0, composed: !0 }));
  }
  _fire(t) {
    this.dispatchEvent(new CustomEvent(t, { bubbles: !0, composed: !0 }));
  }
};
P.styles = U`
    :host {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: clamp(24px, 4vw, 64px);
      align-items: center;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      padding: 8px clamp(24px, 3vw, 48px) clamp(24px, 3vh, 40px);
    }
    .art-wrap {
      height: 100%;
      max-height: min(100%, 46vw);
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      min-height: 0;
    }
    .art {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      background: rgba(255, 255, 255, 0.06);
    }
    .art.placeholder {
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.35);
    }
    .art.placeholder .icon {
      width: 40%;
      height: 40%;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: clamp(16px, 3vh, 32px);
      min-width: 0;
      max-width: 720px;
    }
    .title {
      font-size: clamp(32px, 4.2vw, 64px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.01em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .artist {
      margin-top: 10px;
      line-height: 1.3;
      font-size: clamp(20px, 2.2vw, 32px);
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist.hint {
      white-space: normal;
    }
    .progress {
      --ma-slider-height: 8px;
      --ma-slider-thumb: 22px;
      --ma-slider-fill: rgb(var(--ma-accent));
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .transport {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    .ctl {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      transition: transform 0.12s ease, background 0.2s;
    }
    .ctl:active {
      transform: scale(0.9);
      background: rgba(255, 255, 255, 0.12);
    }
    .ctl .icon {
      width: 56px;
      height: 56px;
    }
    .ctl.small {
      width: 64px;
      height: 64px;
      color: var(--ma-text-dim);
    }
    .ctl.small .icon {
      width: 34px;
      height: 34px;
    }
    .ctl.small.on {
      color: rgb(var(--ma-accent));
    }
    .ctl.play {
      width: 120px;
      height: 120px;
      background: #fff;
      color: #111;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    .ctl.play .icon {
      width: 64px;
      height: 64px;
    }
    .volume {
      display: flex;
      align-items: center;
      gap: 12px;
      --ma-slider-height: 14px;
      --ma-slider-thumb: 34px;
    }
    .volume .vol {
      flex: 1;
    }
    .vol-pct {
      width: 3ch;
      text-align: right;
      font-size: 20px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .vol-caption {
      margin-top: -16px;
      padding-left: 76px;
      font-size: 15px;
      color: var(--ma-text-dim);
    }
    .next {
      font-size: 18px;
      display: flex;
      gap: 12px;
      align-items: baseline;
      min-width: 0;
    }
    .next-label {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 13px;
      font-weight: 700;
      color: rgb(var(--ma-accent));
      flex: none;
    }
    .next-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dim {
      color: var(--ma-text-dim);
    }
    .idle-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 28px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      font-size: 22px;
      font-weight: 600;
    }
    .pill:active {
      background: rgba(255, 255, 255, 0.24);
    }
    .pill .icon {
      width: 28px;
      height: 28px;
    }
    .icon {
      fill: currentColor;
      display: block;
    }
    @media (max-height: 700px) {
      .ctl.play { width: 96px; height: 96px; }
      .ctl { width: 68px; height: 68px; }
      .ctl .icon { width: 44px; height: 44px; }
    }
  `;
W([
  u({ attribute: !1 })
], P.prototype, "hass", 2);
W([
  u({ attribute: !1 })
], P.prototype, "localize", 2);
W([
  u()
], P.prototype, "entityId", 2);
W([
  u({ attribute: !1 })
], P.prototype, "volumeIds", 2);
W([
  u({ attribute: !1 })
], P.prototype, "nextItem", 2);
P = W([
  j("ma-now-playing")
], P);
var Us = Object.defineProperty, js = Object.getOwnPropertyDescriptor, H = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? js(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Us(e, s, a), a;
};
let E = class extends k {
  constructor() {
    super(...arguments), this.players = [], this.activeId = "", this.leaderId = "", this.groupIds = [], this._busy = /* @__PURE__ */ new Set();
  }
  render() {
    const t = this.localize, e = this.hass.states[this.leaderId], s = e?.attributes.friendly_name ?? "", i = y(e, b.GROUPING) && e?.attributes.mass_player_type !== "group", a = this.groupIds.length > 1;
    return o`
      <header>
        <h2>${t("speakers")}</h2>
        <button class="icon-btn" @click=${() => this._fire("close")} aria-label=${t("close")}>
          ${d(ke)}
        </button>
      </header>
      ${a ? o`
            <section class="group-card">
              <div class="group-head">
                ${d(G)}
                <div>
                  <div class="group-title">${t("group")}: ${s}</div>
                  <div class="group-sub">
                    ${this.groupIds.map((r) => this.hass.states[r]?.attributes.friendly_name).join(", ")}
                  </div>
                </div>
              </div>
              <div class="vol-row">
                <span class="vol-label">${t("group_volume")}</span>
                <ma-slider
                  .value=${yt(this.hass, this.groupIds)}
                  @value-change=${(r) => Dt(this.hass, this.groupIds, r.detail.value).catch((n) => this._error(n))}
                ></ma-slider>
              </div>
            </section>
          ` : l}
      <div class="list">${this.players.map((r) => this._renderPlayer(r, i))}</div>
    `;
  }
  _renderPlayer(t, e) {
    const s = this.localize, i = t.entity, a = t.id === this.activeId, r = this.groupIds.includes(t.id), n = t.id === this.leaderId, c = be(this.hass, t.id), h = L(this.hass.states[c]), m = this.hass.states[c], f = h ? F(this.hass, m) : void 0, p = this._busy.has(t.id), x = !!i.attributes.is_volume_muted, $ = e && !t.isGroup && y(i, b.GROUPING) && !n && t.available, C = !a && !r && t.available && L(this.hass.states[this.leaderId]) && c !== this.leaderId;
    return o`
      <div class="player ${a ? "active" : ""} ${r ? "in-group" : ""} ${t.available ? "" : "unavailable"}">
        <button class="main" @click=${() => this._select(t.id)} ?disabled=${!t.available}>
          <div class="thumb">
            ${f ? o`<img src=${f} alt="" />` : d(t.isGroup ? G : Ts)}
          </div>
          <div class="text">
            <div class="name">
              ${t.name} ${a ? o`<span class="badge">${s("active")}</span>` : l}
            </div>
            <div class="status">
              ${h ? [m.attributes.media_title, m.attributes.media_artist].filter(Boolean).join(" – ") : this._stateLabel(i.state)}
              ${c !== t.id ? o`<span class="dim"> · ${s("grouped_with")} ${this.hass.states[c]?.attributes.friendly_name}</span>` : l}
            </div>
          </div>
        </button>
        <div class="actions">
          ${$ ? o`
                <button
                  class="toggle ${r ? "on" : ""}"
                  ?disabled=${p}
                  @click=${() => this._toggleGroup(t.id, r)}
                  title=${s(r ? "remove_from_group" : "add_to_group")}
                >
                  ${d(r ? Cs : Ls)}
                  <span>${s(r ? "in_group" : "add_to_group")}</span>
                </button>
              ` : l}
          ${C ? o`
                <button class="icon-btn" ?disabled=${p} title=${s("transfer_here")} @click=${() => this._transfer(t.id)}>
                  ${d(Hs)}
                </button>
              ` : l}
        </div>
        ${t.available && y(i, b.VOLUME_SET) ? o`
              <div class="vol-row">
                <button
                  class="icon-btn small"
                  ?disabled=${!y(i, b.VOLUME_MUTE)}
                  @click=${() => this._cmd(t.id, "volume_mute", { is_volume_muted: !x })}
                >
                  ${d(x ? Ft : qt)}
                </button>
                <ma-slider
                  .value=${Number(i.attributes.volume_level ?? 0)}
                  @value-change=${(X) => this._cmd(t.id, "volume_set", { volume_level: Math.round(X.detail.value * 100) / 100 })}
                ></ma-slider>
                <span class="pct">${Math.round(Number(i.attributes.volume_level ?? 0) * 100)}</span>
              </div>
            ` : l}
      </div>
    `;
  }
  _stateLabel(t) {
    const e = ["playing", "paused", "idle", "off", "unavailable"].includes(t) ? t : "idle";
    return this.localize(e);
  }
  _select(t) {
    this.dispatchEvent(new CustomEvent("select-player", { detail: t, bubbles: !0, composed: !0 }));
  }
  async _toggleGroup(t, e) {
    await this._withBusy(t, () => e ? fs(this.hass, t) : gs(this.hass, this.leaderId, [t]));
  }
  async _transfer(t) {
    await this._withBusy(t, () => _s(this.hass, this.leaderId, t)), this._select(t);
  }
  _cmd(t, e, s) {
    Z(this.hass, t, e, s).catch((i) => this._error(i));
  }
  async _withBusy(t, e) {
    this._busy = new Set(this._busy).add(t);
    try {
      await e();
    } catch (s) {
      this._error(s);
    } finally {
      const s = new Set(this._busy);
      s.delete(t), this._busy = s;
    }
  }
  _error(t) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: t, bubbles: !0, composed: !0 }));
  }
  _fire(t) {
    this.dispatchEvent(new CustomEvent(t, { bubbles: !0, composed: !0 }));
  }
};
E.styles = U`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      --ma-slider-height: 10px;
      --ma-slider-thumb: 28px;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 12px 28px;
    }
    h2 {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
      opacity: 0.4;
      pointer-events: none;
    }
    .icon {
      fill: currentColor;
      width: 30px;
      height: 30px;
      display: block;
      flex: none;
    }
    .icon-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex: none;
    }
    .icon-btn:active {
      background: rgba(255, 255, 255, 0.14);
    }
    .icon-btn.small {
      width: 48px;
      height: 48px;
      color: var(--ma-text-dim);
    }
    .icon-btn.small .icon {
      width: 26px;
      height: 26px;
    }
    .list {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 4px 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .group-card {
      margin: 0 16px 12px;
      padding: 16px 18px;
      border-radius: 18px;
      background: rgba(var(--ma-accent), 0.18);
      border: 1px solid rgba(var(--ma-accent), 0.4);
    }
    .group-head {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .group-title {
      font-size: 20px;
      font-weight: 700;
    }
    .group-sub {
      font-size: 15px;
      color: var(--ma-text-dim);
    }
    .vol-label {
      font-size: 15px;
      color: var(--ma-text-dim);
      flex: none;
    }
    .player {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 4px 8px;
      padding: 10px 10px 6px 12px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.07);
      border: 2px solid transparent;
    }
    .player.active {
      border-color: rgb(var(--ma-accent));
    }
    .player.in-group:not(.active) {
      background: rgba(var(--ma-accent), 0.14);
    }
    .player.unavailable {
      opacity: 0.45;
    }
    .main {
      display: flex;
      align-items: center;
      gap: 14px;
      text-align: left;
      min-width: 0;
      padding: 4px 0;
    }
    .thumb {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      flex: none;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
      color: var(--ma-text-dim);
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .text {
      min-width: 0;
    }
    .name {
      font-size: 21px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-weight: 700;
    }
    .status {
      font-size: 15px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dim {
      opacity: 0.8;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 48px;
      padding: 0 16px 0 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }
    .toggle .icon {
      width: 24px;
      height: 24px;
    }
    .toggle.on {
      background: rgb(var(--ma-accent));
      color: #111;
    }
    .vol-row {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vol-row ma-slider {
      flex: 1;
    }
    .group-card .vol-row {
      margin-top: 10px;
      gap: 14px;
    }
    .pct {
      width: 3ch;
      text-align: right;
      font-size: 16px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
      padding-right: 6px;
    }
  `;
H([
  u({ attribute: !1 })
], E.prototype, "hass", 2);
H([
  u({ attribute: !1 })
], E.prototype, "localize", 2);
H([
  u({ attribute: !1 })
], E.prototype, "players", 2);
H([
  u()
], E.prototype, "activeId", 2);
H([
  u()
], E.prototype, "leaderId", 2);
H([
  u({ attribute: !1 })
], E.prototype, "groupIds", 2);
H([
  _()
], E.prototype, "_busy", 2);
E = H([
  j("ma-speaker-panel")
], E);
var Ds = Object.defineProperty, qs = Object.getOwnPropertyDescriptor, v = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? qs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ds(e, s, a), a;
};
const q = [
  { key: "artists", type: "artist", label: "artists" },
  { key: "albums", type: "album", label: "albums" },
  { key: "tracks", type: "track", label: "tracks" },
  { key: "playlists", type: "playlist", label: "playlists" },
  { key: "radio", type: "radio", label: "radio" },
  { key: "podcasts", type: "podcast", label: "podcasts" },
  { key: "audiobooks", type: "audiobook", label: "audiobooks" }
], Fs = [
  { tab: "all", label: "all" },
  { tab: "artist", label: "artists" },
  { tab: "album", label: "albums" },
  { tab: "track", label: "tracks" },
  { tab: "playlist", label: "playlists" },
  { tab: "radio", label: "radio" },
  { tab: "podcast", label: "podcasts" }
], Bs = ["artist", "album", "track", "playlist", "radio"], At = ["playlist", "album", "track", "radio", "artist"], le = ["playlist", "album", "artist", "radio", "track"], ce = {
  artist: ws,
  album: ks,
  track: xt,
  playlist: Es,
  radio: Ms,
  podcast: Ss,
  audiobook: As
};
let g = class extends k {
  constructor() {
    super(...arguments), this.entityId = "", this.playerName = "", this.entryId = "", this.open = !1, this.mode = "search", this._query = "", this._tab = "all", this._results = null, this._favorites = null, this._loading = !1, this._failure = null, this._menuItem = null, this._vvHeight = null, this._recentTab = "all", this._recent = null, this._recentLoading = !1, this._recentCache = /* @__PURE__ */ new Map(), this._completeKey = "", this._fullInFlight = !1, this._fullPending = !1, this._cache = /* @__PURE__ */ new Map(), this._provisional = !1, this._refreshedKey = "", this._refreshing = !1, this._favoritesRequested = !1, this._longPressed = !1, this._onViewport = () => {
      const t = window.visualViewport;
      t && (this._vvHeight = t.height, this.style.setProperty("--ma-vv-top", `${t.offsetTop}px`));
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.visualViewport?.addEventListener("resize", this._onViewport), window.visualViewport?.addEventListener("scroll", this._onViewport);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.visualViewport?.removeEventListener("resize", this._onViewport), window.visualViewport?.removeEventListener("scroll", this._onViewport);
  }
  willUpdate(t) {
    if (t.has("open") && this.open && this._onViewport(), this.mode === "recent") {
      (t.has("open") || t.has("mode") || t.has("entryId")) && this.open && this.entryId && (this._recentCache.clear(), this._recentTab = "all", this._loadRecent("all"));
      return;
    }
    (t.has("open") || t.has("entryId")) && this.open && this.entryId && !this._favoritesRequested && (this._favoritesRequested = !0, this._loadFavorites());
  }
  updated(t) {
    (t.has("open") || t.has("mode")) && this.open && this.mode === "search" && (this._input?.focus(), this._input?.select());
  }
  render() {
    if (!this.open) return l;
    const t = this.localize, e = this._vvHeight ? `height:${this._vvHeight}px` : "";
    return o`
      <div class="sheet" style=${e}>
        <div class="top">
          ${this.mode === "recent" ? o`<h2 class="page-title">${d(ft)} ${t("recent")}</h2>` : o`<label class="field">
            ${d(rt)}
            <input
              type="search"
              inputmode="search"
              enterkeyhint="search"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder=${t("search_placeholder")}
              .value=${this._query}
              @input=${this._onInput}
              @keydown=${this._onKey}
            />
            ${this._query ? o`<button class="clear" @click=${this._clear} aria-label="clear">${d(ke)}</button>` : l}
          </label>`}
          <button class="close" @click=${this._close}>${t("close")}</button>
        </div>
        <div class="tabs">
          ${Fs.map(
      ({ tab: s, label: i }) => o`
              <button class="tab ${this._activeTab === s ? "on" : ""}" @click=${() => this._setTab(s)}>
                ${t(i)}
              </button>
            `
    )}
          <span class="target">${t("playing_on")}: <b>${this.playerName}</b></span>
        </div>
        <div class="results">${this._renderBody()}</div>
        ${this._menuItem ? this._renderMenu(this._menuItem) : l}
      </div>
    `;
  }
  get _activeTab() {
    return this.mode === "recent" ? this._recentTab : this._tab;
  }
  _renderRecent() {
    const t = this.localize, e = this._recent;
    if (!e) return o`<div class="msg">${this._recentLoading ? t("searching") : ""}</div>`;
    const s = this._recentTab, i = At.filter((a) => s === "all" || a === s).map((a) => q.find((r) => r.type === a)).concat(s !== "all" && !At.includes(s) ? q.filter((a) => a.type === s) : []).map((a) => ({ ...a, items: e[a.key] ?? [] })).filter((a) => a.items.length);
    return i.length ? this._renderSections(i, s !== "all") : o`<div class="msg">${this._recentLoading ? t("searching") : t("no_results")}</div>`;
  }
  _renderSections(t, e) {
    const s = this.localize;
    return o`${t.map(
      (i) => o`
        <section>
          ${e ? l : o`<h3>${s(i.label)}</h3>`}
          ${i.type === "track" ? o`<div class="tracks ${e ? "full" : ""}">${i.items.map((a) => this._renderTrack(a))}</div>` : o`<div class="${e ? "grid" : "row"}">${i.items.map((a) => this._renderTile(a))}</div>`}
        </section>
      `
    )}`;
  }
  _renderBody() {
    if (this.mode === "recent") return this._renderRecent();
    const t = this.localize, e = this._query.trim(), s = e.length >= 2 ? this._results : this._favorites;
    if (this._failure && !this._loading)
      return o`
        <div class="msg failure">
          <div class="failure-title">${t("search_failed")}</div>
          <div class="failure-detail">${this._failure}</div>
          <button class="retry" @click=${this._retry}>${t("retry")}</button>
        </div>
      `;
    if (!s) return o`<div class="msg">${this._loading ? t("searching") : ""}</div>`;
    const i = q.filter((r) => this._tab === "all" ? !0 : r.type === this._tab).map((r) => ({ ...r, items: s[r.key] ?? [] })).filter((r) => r.items.length);
    if (!i.length) {
      const r = this._loading || this._refreshing || e.length >= 2 && this._completeKey !== this._key;
      return o`<div class="msg">${t(r ? "searching" : "no_results")}</div>`;
    }
    const a = this._tab !== "all";
    return o`
      ${this._loading || this._refreshing || e.length >= 2 && this._completeKey !== this._key ? o`<div class="loading-bar"></div>
            <div class="more-sources">${t("searching_more")}</div>` : l}
      ${e.length < 2 ? o`<h2 class="fav-title">${t("favorites")}</h2>` : l}
      ${this._renderSections(i, a)}
    `;
  }
  _pressHandlers(t) {
    return {
      down: () => {
        this._longPressed = !1, this._longPressTimer = window.setTimeout(() => {
          this._longPressed = !0, this._menuItem = t;
        }, 550);
      },
      cancel: () => clearTimeout(this._longPressTimer),
      click: () => {
        clearTimeout(this._longPressTimer), this._longPressed || this._play(t, Ks(t));
      }
    };
  }
  _renderTile(t) {
    const e = this._pressHandlers(t), s = Et(t);
    return o`
      <div class="tile ${t.media_type}">
        <button
          class="tile-main"
          @pointerdown=${e.down}
          @pointerup=${e.cancel}
          @pointerleave=${e.cancel}
          @pointercancel=${e.cancel}
          @contextmenu=${(i) => i.preventDefault()}
          @click=${e.click}
        >
          <div class="cover">
            ${d(ce[t.media_type])}
            ${s ? o`<img src=${s} alt="" loading="lazy" @error=${he} />` : l}
            <span class="play-badge">${d(nt)}</span>
          </div>
          <div class="tile-name">${t.name}</div>
          <div class="tile-sub">${Vt(t, this.localize)}</div>
        </button>
        <button class="more" @click=${() => this._menuItem = t} aria-label="more">${d(ne)}</button>
      </div>
    `;
  }
  _renderTrack(t) {
    const e = this._pressHandlers(t), s = Et(t);
    return o`
      <div class="track">
        <button
          class="track-main"
          @pointerdown=${e.down}
          @pointerup=${e.cancel}
          @pointerleave=${e.cancel}
          @pointercancel=${e.cancel}
          @contextmenu=${(i) => i.preventDefault()}
          @click=${e.click}
        >
          <div class="track-cover">
            ${d(xt)}${s ? o`<img src=${s} alt="" loading="lazy" @error=${he} />` : l}
          </div>
          <div class="track-text">
            <div class="tile-name">${t.name}</div>
            <div class="tile-sub">${Vt(t, this.localize)}</div>
          </div>
        </button>
        <button class="more" @click=${() => this._menuItem = t} aria-label="more">${d(ne)}</button>
      </div>
    `;
  }
  _renderMenu(t) {
    const e = this.localize, s = ["artist", "album", "track", "playlist"].includes(t.media_type), i = (r, n, c, h = !1) => o`
      <button
        class="menu-opt"
        @click=${() => {
      this._menuItem = null, this._play(t, c, h);
    }}
      >
        ${d(r)} ${e(n)}
      </button>
    `, a = Et(t);
    return o`
      <div class="scrim" @click=${() => this._menuItem = null}>
        <div class="menu" @click=${(r) => r.stopPropagation()}>
          <div class="menu-head">
            <div class="track-cover">${a ? o`<img src=${a} alt="" />` : d(ce[t.media_type])}</div>
            <div class="track-text">
              <div class="tile-name">${t.name}</div>
              <div class="tile-sub">${Vt(t, e)}</div>
            </div>
          </div>
          ${i(nt, "play_now", t.media_type === "track" ? "play" : "replace")}
          ${t.media_type !== "radio" ? i(Ps, "play_next", "next") : l}
          ${t.media_type !== "radio" ? i(Vs, "add_to_queue", "add") : l}
          ${s ? i(Is, "start_radio", "replace", !0) : l}
        </div>
      </div>
    `;
  }
  get _key() {
    return `${this._tab}|${this._query.trim().toLowerCase()}`;
  }
  get _types() {
    return this._tab === "all" ? Bs : [this._tab];
  }
  get _limit() {
    return this._tab === "all" ? 12 : 30;
  }
  /**
   * Two-stage search: the local library answers in milliseconds and is shown
   * right away; the provider search (Spotify, TuneIn, …) runs once typing has
   * paused and only one at a time, so a slow on-screen keyboard doesn't pile
   * up provider requests that delay each other.
   */
  _cancelRefresh() {
    clearTimeout(this._refreshTimer), this._refreshing = !1;
  }
  _onInput(t) {
    if (this._query = t.target.value, this._provisional = !1, this._cancelRefresh(), clearTimeout(this._libraryTimer), clearTimeout(this._fullTimer), this._query.trim().length < 2) {
      this._results = null, this._failure = null;
      return;
    }
    this._libraryTimer = window.setTimeout(() => this._librarySearch(), 250), this._fullTimer = window.setTimeout(() => this._fullSearch(), 600);
  }
  _onKey(t) {
    t.key === "Enter" ? (this._searchNow(), this._input.blur()) : t.key === "Escape" && this._close();
  }
  _clear() {
    this._cancelRefresh(), clearTimeout(this._libraryTimer), clearTimeout(this._fullTimer), this._query = "", this._results = null, this._failure = null, this._input.focus();
  }
  _setTab(t) {
    if (this.mode === "recent") {
      if (t === this._recentTab) return;
      this._recentTab = t, this._loadRecent(t);
      return;
    }
    t !== this._tab && (this._provisional = !1, this._cancelRefresh(), this._tab = t, this._searchNow());
  }
  _searchNow() {
    clearTimeout(this._libraryTimer), clearTimeout(this._fullTimer);
    const t = this._query.trim();
    if (t.length < 2) return;
    const e = this._cache.get(this._key);
    if (e) {
      this._results = e, this._completeKey = this._key, this._loading = !1;
      return;
    }
    const s = this._cache.get(`all|${t.toLowerCase()}`);
    s && (this._results = s, this._provisional = !0), this._completeKey !== this._key && this._librarySearch(), this._fullSearch();
  }
  async _librarySearch() {
    const t = this._key;
    if (!(!this.entryId || this._completeKey === t))
      try {
        const e = await kt(this.hass, this.entryId, this._query.trim(), this._types, this._limit, !0);
        t === this._key && this._completeKey !== t && !this._provisional && (this._results = e);
      } catch (e) {
        console.warn("[ma-player-card] library search failed", e);
      }
  }
  async _fullSearch() {
    if (!this.entryId || this._query.trim().length < 2) return;
    if (this._loading = !0, this._failure = null, this._fullInFlight) {
      this._fullPending = !0;
      return;
    }
    const t = this._key;
    if (t === this._completeKey) {
      this._loading = !1;
      return;
    }
    this._fullInFlight = !0;
    const e = Date.now();
    try {
      const s = await kt(this.hass, this.entryId, this._query.trim(), this._types, this._limit);
      this._cache.set(t, s), this._cache.size > 20 && this._cache.delete(this._cache.keys().next().value), t === this._key && (this._results = s, this._provisional = !1, this._completeKey = t, (Date.now() - e > 4e3 || Ct(s) === 0) && this._refreshedKey !== t && this._scheduleRefresh(t, Ct(s)));
    } catch (s) {
      t === this._key && this._fail(s);
    } finally {
      if (this._fullInFlight = !1, this._fullPending && (this._fullPending = !1, this._key !== t)) {
        this._fullSearch();
        return;
      }
      this._loading = !1;
    }
  }
  _scheduleRefresh(t, e) {
    this._refreshedKey = t, this._refreshing = !0, clearTimeout(this._refreshTimer), this._refreshTimer = window.setTimeout(async () => {
      try {
        if (t !== this._key) return;
        const s = await kt(this.hass, this.entryId, this._query.trim(), this._types, this._limit);
        Ct(s) > e && (this._cache.set(t, s), t === this._key && (this._results = s));
      } catch (s) {
        console.warn("[ma-player-card] follow-up search failed", s);
      } finally {
        t === this._key && (this._refreshing = !1);
      }
    }, 6e3);
  }
  _fail(t) {
    this._failure = t?.message ?? t?.code ?? String(t), console.warn("[ma-player-card] search failed", t);
  }
  _retry() {
    this._failure = null, this._query.trim().length >= 2 ? (this._completeKey = "", this._searchNow()) : this._loadFavorites();
  }
  async _loadRecent(t) {
    const e = this._recentCache.get(t);
    if (e) {
      this._recent = e;
      return;
    }
    this._recent = t === "all" ? null : this._recentCache.get("all") ?? null, this._recentLoading = !0;
    const s = t === "all" ? At : [t], i = {};
    try {
      await Promise.all(
        s.map(async (a) => {
          i[q.find((r) => r.type === a).key] = await ae(this.hass, this.entryId, a, {
            order_by: "last_played_desc",
            limit: t === "all" ? 12 : 50
          });
        })
      ), this._recentCache.set(t, i), this._recentTab === t && (this._recent = i);
    } catch (a) {
      this._recentTab === t && this._error(a);
    } finally {
      this._recentTab === t && (this._recentLoading = !1);
    }
  }
  async _loadFavorites() {
    const t = {}, e = (a) => q.find((r) => r.type === a).key;
    let s, i = 0;
    if (await Promise.all(
      le.map(async (a) => {
        try {
          t[e(a)] = await ae(this.hass, this.entryId, a, {
            favorite: !0,
            limit: 40,
            order_by: "sort_name"
          });
        } catch (r) {
          s ??= r, i++, t[e(a)] = [];
        }
      })
    ), i === le.length) {
      this._fail(s), this._favoritesRequested = !1;
      return;
    }
    this._favorites = t;
  }
  async _play(t, e, s = !1) {
    try {
      await us(this.hass, this.entityId, t, e, s);
      const i = this.localize, a = e === "next" || e === "add" ? i("added_to_queue") : `${i("playing_on")} ${this.playerName}`;
      this.dispatchEvent(new CustomEvent("ma-toast", { detail: `${t.name} · ${a}`, bubbles: !0, composed: !0 })), e !== "next" && e !== "add" && this._close();
    } catch (i) {
      this._error(i);
    }
  }
  _close() {
    this._menuItem = null, this._input?.blur(), this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  _error(t) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: t, bubbles: !0, composed: !0 }));
  }
};
g.styles = U`
    :host {
      position: fixed;
      inset: 0;
      z-index: 20;
      pointer-events: none;
    }
    :host([open]) {
      pointer-events: auto;
    }
    .sheet {
      position: absolute;
      top: var(--ma-vv-top, 0);
      left: 0;
      right: 0;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      background: var(--ma-overlay-bg, rgba(14, 14, 18, 0.97));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: var(--ma-text);
      animation: drop 0.18s ease-out;
    }
    @keyframes drop {
      from { transform: translateY(-16px); opacity: 0; }
      to { transform: none; opacity: 1; }
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      text-align: left;
    }
    .icon {
      fill: currentColor;
      width: 28px;
      height: 28px;
      display: block;
      flex: none;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px 8px;
    }
    .page-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      height: 68px;
      margin: 0;
      padding-left: 8px;
      font-size: 30px;
      font-weight: 700;
    }
    .page-title .icon {
      width: 34px;
      height: 34px;
    }
    .field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      height: 68px;
      padding: 0 12px 0 22px;
      border-radius: 34px;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid transparent;
      color: var(--ma-text-dim);
    }
    .field:focus-within {
      border-color: rgb(var(--ma-accent));
    }
    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: none;
      color: var(--ma-text);
      font: inherit;
      font-size: 26px;
    }
    input::-webkit-search-cancel-button {
      display: none;
    }
    .clear {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 50%;
    }
    .close {
      height: 68px;
      padding: 0 26px;
      border-radius: 34px;
      background: rgba(255, 255, 255, 0.12);
      font-size: 20px;
      font-weight: 600;
    }
    .tabs {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 24px 10px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tab {
      flex: none;
      height: 46px;
      padding: 0 20px;
      border-radius: 23px;
      background: rgba(255, 255, 255, 0.08);
      font-size: 18px;
      font-weight: 600;
    }
    .tab.on {
      background: #fff;
      color: #111;
    }
    .target {
      margin-left: auto;
      flex: none;
      padding-left: 16px;
      font-size: 16px;
      color: var(--ma-text-dim);
    }
    .target b {
      color: var(--ma-text);
    }
    .results {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 0 24px calc(32px + var(--ma-footer-space, 0px));
      position: relative;
    }
    .msg {
      padding: 48px 0;
      text-align: center;
      font-size: 22px;
      color: var(--ma-text-dim);
    }
    .failure {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .failure-title {
      color: var(--ma-text);
      font-weight: 700;
    }
    .failure-detail {
      font-size: 17px;
      max-width: 80%;
      word-break: break-word;
    }
    .retry {
      margin-top: 8px;
      height: 56px;
      padding: 0 28px;
      border-radius: 28px;
      background: #fff;
      color: #111;
      font-size: 19px;
      font-weight: 700;
    }
    .more-sources {
      font-size: 15px;
      color: var(--ma-text-dim);
      padding-top: 6px;
    }
    .loading-bar {
      position: sticky;
      top: 0;
      height: 3px;
      margin: 0 -24px;
      background: linear-gradient(90deg, transparent, rgb(var(--ma-accent)), transparent);
      background-size: 50% 100%;
      background-repeat: no-repeat;
      animation: load 1s linear infinite;
      z-index: 1;
    }
    @keyframes load {
      from { background-position: -50% 0; }
      to { background-position: 150% 0; }
    }
    .fav-title {
      font-size: 26px;
      margin: 8px 0 0;
    }
    h3 {
      font-size: 20px;
      margin: 18px 0 10px;
      color: var(--ma-text-dim);
      font-weight: 600;
    }
    .row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 176px;
      gap: 18px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
      gap: 22px 18px;
      padding-top: 8px;
    }
    .tile {
      position: relative;
      min-width: 0;
    }
    .tile-main {
      display: block;
      width: 100%;
    }
    .cover {
      position: relative;
      aspect-ratio: 1;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.08);
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .tile.artist .cover {
      border-radius: 50%;
    }
    .cover img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cover > .icon {
      width: 44%;
      height: 44%;
    }
    .play-badge {
      position: absolute;
      right: 8px;
      bottom: 8px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgb(var(--ma-accent));
      color: #111;
      display: grid;
      place-items: center;
      opacity: 0;
      transform: scale(0.8);
      transition: 0.15s;
    }
    .tile-main:active .play-badge {
      opacity: 1;
      transform: none;
    }
    .tile-main:active .cover {
      filter: brightness(0.8);
    }
    .tile-name {
      margin-top: 8px;
      font-size: 17px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile-sub {
      font-size: 14px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile .more {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
    }
    .tile .more .icon {
      width: 24px;
      height: 24px;
    }
    .tracks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 24px;
    }
    .tracks.full {
      padding-top: 8px;
    }
    .track {
      display: flex;
      align-items: center;
      border-radius: 12px;
      min-width: 0;
    }
    .track:active {
      background: rgba(255, 255, 255, 0.08);
    }
    .track-main {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
      padding: 6px;
    }
    .track-cover {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      overflow: hidden;
      flex: none;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.08);
      color: var(--ma-text-dim);
    }
    .track-cover {
      position: relative;
    }
    .track-cover img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .track-text {
      min-width: 0;
    }
    .track-text .tile-name {
      margin-top: 0;
    }
    .track .more {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .scrim {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: grid;
      place-items: center;
      z-index: 2;
    }
    .menu {
      width: min(520px, 90vw);
      max-height: 90%;
      overflow-y: auto;
      border-radius: 24px;
      background: #232329;
      padding: 12px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    }
    .menu-head {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 8px 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 6px;
    }
    .menu-head .track-cover {
      width: 72px;
      height: 72px;
    }
    .menu-opt {
      display: flex;
      align-items: center;
      gap: 18px;
      width: 100%;
      height: 68px;
      padding: 0 16px;
      border-radius: 14px;
      font-size: 21px;
      font-weight: 600;
    }
    .menu-opt:active {
      background: rgba(255, 255, 255, 0.1);
    }
  `;
v([
  u({ attribute: !1 })
], g.prototype, "hass", 2);
v([
  u({ attribute: !1 })
], g.prototype, "localize", 2);
v([
  u()
], g.prototype, "entityId", 2);
v([
  u()
], g.prototype, "playerName", 2);
v([
  u()
], g.prototype, "entryId", 2);
v([
  u({ type: Boolean, reflect: !0 })
], g.prototype, "open", 2);
v([
  u()
], g.prototype, "mode", 2);
v([
  _()
], g.prototype, "_query", 2);
v([
  _()
], g.prototype, "_tab", 2);
v([
  _()
], g.prototype, "_results", 2);
v([
  _()
], g.prototype, "_favorites", 2);
v([
  _()
], g.prototype, "_loading", 2);
v([
  _()
], g.prototype, "_failure", 2);
v([
  _()
], g.prototype, "_menuItem", 2);
v([
  _()
], g.prototype, "_vvHeight", 2);
v([
  _()
], g.prototype, "_recentTab", 2);
v([
  _()
], g.prototype, "_recent", 2);
v([
  _()
], g.prototype, "_recentLoading", 2);
v([
  rs("input")
], g.prototype, "_input", 2);
v([
  _()
], g.prototype, "_refreshing", 2);
g = v([
  j("ma-search-overlay")
], g);
const he = (t) => t.target.remove(), Ct = (t) => Object.values(t).reduce((e, s) => e + (s?.length ?? 0), 0);
function Et(t) {
  const e = t.image || t.album?.image;
  return e && /^https?:|^\//.test(e) ? e : void 0;
}
function Vt(t, e) {
  const s = t.artists?.map((a) => a.name).join(", ");
  if (t.media_type === "track") return [s, t.album?.name].filter(Boolean).join(" · ");
  if (t.media_type === "album") return s ?? e("albums");
  const i = q.find((a) => a.type === t.media_type)?.label;
  return i ? e(i) : "";
}
const Ks = (t) => t.media_type === "track" ? "play" : "replace";
var Zs = Object.defineProperty, Gs = Object.getOwnPropertyDescriptor, M = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Gs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Zs(e, s, a), a;
};
let A = class extends k {
  constructor() {
    super(...arguments), this.variant = "large", this.entityId = "", this.playerName = "", this.volumeIds = [], this.nextItem = null, this._lastVolSend = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => {
      this.options?.show_progress && this.hass?.states[this.entityId]?.state === "playing" && this.requestUpdate();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._timer);
  }
  render() {
    return !this.hass?.states[this.entityId] || !this.options ? l : this.variant === "compact" ? this._renderCompact() : this._renderLarge();
  }
  // ---------- layouts ----------
  _renderLarge() {
    const t = this.hass.states[this.entityId], e = this.options, s = this.localize, i = L(t);
    return o`
      ${this._renderHeader()}
      <div class="hero ${e.show_artwork ? "" : "no-art"}">
        ${e.show_artwork ? this._renderArt(i) : l}
        <div class="titles">
          <div class="title">${i ? t.attributes.media_title ?? "" : s("nothing_playing")}</div>
          <div class="artist ${i ? "" : "hint"}">${i ? It(t) : s("nothing_playing_hint")}</div>
          ${i && e.show_next_up ? this._renderNext() : l}
        </div>
      </div>
      ${i && e.show_progress ? this._renderProgress() : l}
      ${i ? this._renderTransport(e.show_shuffle_repeat, e.show_previous) : l}
      ${e.show_volume ? this._renderVolume() : l}
    `;
  }
  _renderCompact() {
    const t = this.hass.states[this.entityId], e = this.options, s = this.localize, i = L(t), a = t.state === "playing", r = i ? It(t) : s("nothing_playing_hint");
    return o`
      <div class="row">
        ${e.show_artwork ? this._renderArt(i) : l}
        <div class="titles">
          <div class="title">${i ? t.attributes.media_title ?? "" : s("nothing_playing")}</div>
          <div class="artist">${r}</div>
          ${e.show_player ? o`<button class="player-link" @click=${() => this._fire("open-speakers")}>
                ${d(G)}<span>${this._playerLabel()}</span>
              </button>` : l}
        </div>
        <div class="controls">
          ${i && e.show_shuffle_repeat ? this._shuffleBtn() : l}
          ${i && e.show_previous ? o`<button class="ctl prev" ?disabled=${!y(t, b.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
                ${d(Ht)}
              </button>` : l}
          ${i ? o`<button class="ctl play" @click=${() => this._call("media_play_pause")}>
                ${d(a ? Pt : nt)}
              </button>` : l}
          ${i ? o`<button class="ctl" ?disabled=${!y(t, b.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
                ${d(Tt)}
              </button>` : l}
          ${i && e.show_shuffle_repeat ? this._repeatBtn() : l}
          ${this._renderActionIcons()}
        </div>
      </div>
      ${e.show_volume ? this._renderVolume() : l}
      ${i && e.show_progress ? this._renderThinProgress() : l}
    `;
  }
  // ---------- pieces ----------
  _playerLabel() {
    const t = this.volumeIds.length;
    return t > 1 ? `${this.playerName} +${t - 1}` : this.playerName;
  }
  _renderHeader() {
    const t = this.options, e = this.localize;
    return !t.show_player && !t.show_search && !t.show_recent ? l : o`
      <div class="header">
        ${t.show_player ? o`<button class="chip player" @click=${() => this._fire("open-speakers")}>
              ${d(G)}<span class="name">${this.playerName}</span>
              ${this.volumeIds.length > 1 ? o`<span class="count">+${this.volumeIds.length - 1}</span>` : l}
              ${d(we)}
            </button>` : l}
        <span class="spacer"></span>
        ${t.show_recent ? o`<button class="icon-btn" title=${e("recent")} @click=${() => this._fire("open-recent")}>
              ${d(ft)}
            </button>` : l}
        ${t.show_search ? o`<button class="icon-btn" title=${e("search")} @click=${() => this._fire("open-search")}>
              ${d(rt)}
            </button>` : l}
      </div>
    `;
  }
  /** Search / recent buttons at the end of the compact row. */
  _renderActionIcons() {
    const t = this.options, e = this.localize;
    return !t.show_search && !t.show_recent ? l : o`
      <span class="sep"></span>
      ${t.show_recent ? o`<button class="ctl small opt" title=${e("recent")} @click=${() => this._fire("open-recent")}>
            ${d(ft)}
          </button>` : l}
      ${t.show_search ? o`<button class="ctl small" title=${e("search")} @click=${() => this._fire("open-search")}>
            ${d(rt)}
          </button>` : l}
    `;
  }
  _renderArt(t) {
    const e = this.hass.states[this.entityId], s = t ? F(this.hass, e) : void 0;
    return s ? o`<img class="art" src=${s} alt="" />` : o`<div class="art placeholder">${d(xt)}</div>`;
  }
  _renderProgress() {
    const t = this.hass.states[this.entityId], e = Number(t.attributes.media_duration), s = Mt(t);
    return e > 0 ? o`
      <div class="progress">
        <ma-slider
          .value=${(s ?? 0) / e}
          ?disabled=${!y(t, b.SEEK)}
          @value-change=${(i) => this._call("media_seek", { seek_position: Math.round(i.detail.value * e) })}
        ></ma-slider>
        <div class="times"><span>${gt(s)}</span><span>${gt(e)}</span></div>
      </div>
    ` : l;
  }
  _renderThinProgress() {
    const t = this.hass.states[this.entityId], e = Number(t.attributes.media_duration);
    if (!(e > 0)) return l;
    const s = Math.min(100, (Mt(t) ?? 0) / e * 100);
    return o`<div class="thin-progress"><div style="width:${s}%"></div></div>`;
  }
  _shuffleBtn() {
    const t = this.hass.states[this.entityId], e = !!t.attributes.shuffle;
    return o`
      <button
        class="ctl small opt ${e ? "on" : ""}"
        ?disabled=${!y(t, b.SHUFFLE_SET)}
        @click=${() => this._call("shuffle_set", { shuffle: !e })}
      >
        ${d(e ? Ve : Le)}
      </button>
    `;
  }
  _repeatBtn() {
    const t = this.hass.states[this.entityId], e = t.attributes.repeat ?? "off", s = e === "off" ? "all" : e === "all" ? "one" : "off";
    return o`
      <button
        class="ctl small opt ${e !== "off" ? "on" : ""}"
        ?disabled=${!y(t, b.REPEAT_SET)}
        @click=${() => this._call("repeat_set", { repeat: s })}
      >
        ${d(e === "one" ? Ee : e === "all" ? Ae : Ce)}
      </button>
    `;
  }
  _renderTransport(t, e) {
    const s = this.hass.states[this.entityId], i = s.state === "playing";
    return o`
      <div class="transport">
        ${t ? this._shuffleBtn() : l}
        ${e ? o`<button class="ctl" ?disabled=${!y(s, b.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
              ${d(Ht)}
            </button>` : l}
        <button class="ctl play" @click=${() => this._call("media_play_pause")}>
          ${d(i ? Pt : nt)}
        </button>
        <button class="ctl" ?disabled=${!y(s, b.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
          ${d(Tt)}
        </button>
        ${t ? this._repeatBtn() : l}
      </div>
    `;
  }
  _renderVolume() {
    const t = this.hass.states[this.entityId];
    if (!y(t, b.VOLUME_SET)) return l;
    const e = this.localize, s = this.volumeIds.length ? this.volumeIds : [this.entityId], i = s.length > 1, a = i ? yt(this.hass, s) : Number(t.attributes.volume_level ?? 0), r = !!t.attributes.is_volume_muted, n = r || a === 0 ? Ft : a < 0.33 ? Se : a < 0.66 ? Me : qt;
    return o`
      <div class="volume" title=${i ? `${e("group_volume")} · ${s.length}` : ""}>
        <button
          class="ctl small"
          title=${e(r ? "unmute" : "mute")}
          ?disabled=${!y(t, b.VOLUME_MUTE)}
          @click=${() => this._call("volume_mute", { is_volume_muted: !r })}
        >
          ${d(n)}
        </button>
        <ma-slider
          class="vol"
          .value=${a}
          .label=${i ? e("group_volume") : ""}
          @value-input=${(c) => this._setVolume(s, c.detail.value, !0)}
          @value-change=${(c) => this._setVolume(s, c.detail.value, !1)}
        ></ma-slider>
        <span class="vol-pct">${Math.round(a * 100)}</span>
      </div>
    `;
  }
  _renderNext() {
    const t = this.nextItem;
    if (!t) return l;
    const e = t.media_item, s = e?.name ?? t.name, i = e?.artists?.map((a) => a.name).join(", ");
    return o`
      <div class="next">
        <span class="next-label">${this.localize("next_up")}</span>
        <span class="next-title">${s}${i ? o` <span class="dim">– ${i}</span>` : l}</span>
      </div>
    `;
  }
  _setVolume(t, e, s) {
    const i = Date.now();
    if (s && i - this._lastVolSend < 250) return;
    this._lastVolSend = i, (t.length > 1 ? Dt(this.hass, t, e) : Z(this.hass, t[0], "volume_set", { volume_level: Math.round(e * 100) / 100 })).catch((r) => this._error(r));
  }
  _call(t, e = {}) {
    Z(this.hass, this.entityId, t, e).catch((s) => this._error(s));
  }
  _error(t) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: t, bubbles: !0, composed: !0 }));
  }
  _fire(t) {
    this.dispatchEvent(new CustomEvent(t, { bubbles: !0, composed: !0 }));
  }
};
A.styles = U`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
      container-type: inline-size;
      box-sizing: border-box;
      color: var(--ma-text);
    }
    :host([variant="large"]) {
      gap: 14px;
      padding: 16px 20px 18px;
    }
    :host([variant="compact"]) {
      padding: 10px 12px;
      gap: 6px;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    .icon {
      fill: currentColor;
      display: block;
      width: 24px;
      height: 24px;
      flex: none;
    }

    /* ---- header (large) ---- */
    .header {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .spacer {
      flex: 1;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 12px 0 14px;
      border-radius: 20px;
      background: var(--ma-chip-bg);
      font-weight: 600;
      font-size: 15px;
      min-width: 0;
      max-width: 70%;
    }
    .chip .icon {
      width: 20px;
      height: 20px;
    }
    .chip .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      padding: 1px 8px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-size: 13px;
      font-weight: 700;
    }
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--ma-chip-bg);
    }
    .chip:active,
    .icon-btn:active {
      background: var(--ma-chip-bg-active);
    }

    /* ---- hero (large) ---- */
    .hero {
      display: grid;
      grid-template-columns: minmax(96px, 38%) minmax(0, 1fr);
      gap: 18px;
      align-items: center;
    }
    .hero.no-art {
      grid-template-columns: minmax(0, 1fr);
    }
    .art {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      background: var(--ma-chip-bg);
    }
    .art.placeholder {
      display: grid;
      place-items: center;
      color: var(--ma-text-dim);
    }
    .art.placeholder .icon {
      width: 40%;
      height: 40%;
    }
    .titles {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    :host([variant="large"]) .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.15;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    :host([variant="large"]) .artist {
      margin-top: 6px;
      font-size: 16px;
      line-height: 1.3;
      color: var(--ma-text-dim);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .next {
      margin-top: 12px;
      font-size: 14px;
      display: flex;
      gap: 8px;
      align-items: baseline;
      min-width: 0;
    }
    .next-label {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      font-weight: 700;
      color: rgb(var(--ma-accent));
      flex: none;
    }
    .next-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dim {
      color: var(--ma-text-dim);
    }

    /* ---- progress / transport / volume ---- */
    .progress {
      --ma-slider-height: 6px;
      --ma-slider-thumb: 16px;
      --ma-slider-fill: rgb(var(--ma-accent));
      margin-bottom: -6px;
    }
    .progress ma-slider {
      height: 32px;
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }
    .transport {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
    .ctl {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      transition: transform 0.12s ease, background 0.2s;
    }
    .ctl:active {
      transform: scale(0.9);
      background: var(--ma-chip-bg);
    }
    .ctl .icon {
      width: 36px;
      height: 36px;
    }
    .ctl.small {
      width: 44px;
      height: 44px;
      color: var(--ma-text-dim);
    }
    .ctl.small .icon {
      width: 24px;
      height: 24px;
    }
    .ctl.small.on {
      color: rgb(var(--ma-accent));
    }
    .ctl.play {
      width: 72px;
      height: 72px;
      background: var(--ma-play-bg);
      color: var(--ma-play-fg);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    }
    .ctl.play .icon {
      width: 40px;
      height: 40px;
    }
    .volume {
      display: flex;
      align-items: center;
      gap: 6px;
      --ma-slider-height: 8px;
      --ma-slider-thumb: 22px;
    }
    .volume .vol {
      flex: 1;
    }
    .vol-pct {
      width: 3ch;
      text-align: right;
      font-size: 14px;
      color: var(--ma-text-dim);
      font-variant-numeric: tabular-nums;
    }

    /* ---- compact ---- */
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    :host([variant="compact"]) .art {
      width: 64px;
      height: 64px;
      flex: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    :host([variant="compact"]) .titles {
      flex: 1;
      gap: 1px;
    }
    :host([variant="compact"]) .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.25;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([variant="compact"]) .artist {
      font-size: 14px;
      color: var(--ma-text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .player-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      align-self: flex-start;
      max-width: 100%;
      margin-top: 2px;
      font-size: 13px;
      font-weight: 600;
      color: rgb(var(--ma-accent));
      white-space: nowrap;
    }
    .player-link span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .player-link .icon {
      width: 16px;
      height: 16px;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: none;
    }
    :host([variant="compact"]) .ctl {
      width: 44px;
      height: 44px;
    }
    :host([variant="compact"]) .ctl .icon {
      width: 28px;
      height: 28px;
    }
    :host([variant="compact"]) .ctl.small .icon {
      width: 22px;
      height: 22px;
    }
    :host([variant="compact"]) .ctl.play {
      width: 48px;
      height: 48px;
      box-shadow: none;
    }
    :host([variant="compact"]) .ctl.play .icon {
      width: 30px;
      height: 30px;
    }
    .sep {
      width: 1px;
      height: 28px;
      margin: 0 4px;
      background: var(--ma-chip-bg-active);
    }
    .thin-progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--ma-chip-bg);
    }
    .thin-progress div {
      height: 100%;
      background: rgb(var(--ma-accent));
      transition: width 1s linear;
    }

    /* Narrow cards: stack the large hero, drop secondary compact buttons. */
    @container (max-width: 340px) {
      .hero {
        grid-template-columns: minmax(0, 1fr);
      }
      .hero .art {
        width: min(100%, 240px);
        justify-self: center;
      }
      .hero .titles {
        text-align: center;
      }
      .next {
        justify-content: center;
      }
    }
    @container (max-width: 420px) {
      .controls .opt {
        display: none;
      }
    }
    @container (max-width: 340px) {
      .controls .prev,
      .controls .sep,
      .controls .ctl.small {
        display: none;
      }
      :host([variant="compact"]) .art {
        width: 48px;
        height: 48px;
      }
    }
  `;
M([
  u({ attribute: !1 })
], A.prototype, "hass", 2);
M([
  u({ attribute: !1 })
], A.prototype, "localize", 2);
M([
  u({ reflect: !0 })
], A.prototype, "variant", 2);
M([
  u({ attribute: !1 })
], A.prototype, "options", 2);
M([
  u()
], A.prototype, "entityId", 2);
M([
  u()
], A.prototype, "playerName", 2);
M([
  u({ attribute: !1 })
], A.prototype, "volumeIds", 2);
M([
  u({ attribute: !1 })
], A.prototype, "nextItem", 2);
A = M([
  j("ma-card-player")
], A);
const et = {
  large: {
    show_artwork: !0,
    show_progress: !0,
    show_volume: !0,
    show_shuffle_repeat: !0,
    show_previous: !0,
    show_next_up: !0,
    show_player: !0,
    show_search: !0,
    show_recent: !0,
    background: "artwork"
  },
  compact: {
    show_artwork: !0,
    show_progress: !0,
    show_volume: !1,
    show_shuffle_repeat: !1,
    show_previous: !0,
    show_next_up: !1,
    show_player: !0,
    show_search: !0,
    show_recent: !1,
    background: "artwork"
  }
}, ut = Object.keys(et.large), S = (t) => t?.layout ?? "fullscreen";
function Ys(t) {
  const e = S(t), i = { ...et[e === "compact" ? "compact" : "large"] };
  for (const a of ut)
    t[a] !== void 0 && (i[a] = t[a]);
  return i;
}
var Ws = Object.defineProperty, Xs = Object.getOwnPropertyDescriptor, $t = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? Xs(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && Ws(e, s, a), a;
};
const Qs = {
  sv: {
    layout: "Layout",
    layout_fullscreen: "Helskärm (surfplatta/kiosk)",
    layout_large: "Stort kort",
    layout_compact: "Kompakt kort",
    default_player: "Standardspelare",
    players: "Spelare att visa (tomt = alla)",
    language: "Språk",
    display: "Visa",
    show_artwork: "Omslagsbild",
    show_progress: "Förloppsindikator",
    show_volume: "Volym",
    show_shuffle_repeat: "Blanda och upprepa",
    show_previous: "Föregående-knapp",
    show_next_up: "Nästa låt",
    show_player: "Högtalarväljare",
    show_search: "Sökknapp",
    show_recent: "Senast spelade-knapp",
    background: "Bakgrund",
    bg_artwork: "Suddigt omslag",
    bg_accent: "Färg från omslaget",
    bg_theme: "Temats kortfärg",
    advanced: "Avancerat",
    hide_unavailable: "Dölj otillgängliga spelare",
    config_entry_id: "Music Assistant config entry (om användaren inte är admin)",
    footer_space: "Fritt utrymme längst ner (px)",
    height: "Höjd (CSS, t.ex. 100dvh)"
  },
  en: {
    layout: "Layout",
    layout_fullscreen: "Fullscreen (tablet/kiosk)",
    layout_large: "Large card",
    layout_compact: "Compact card",
    default_player: "Default player",
    players: "Players to show (empty = all)",
    language: "Language",
    display: "Show",
    show_artwork: "Artwork",
    show_progress: "Progress bar",
    show_volume: "Volume",
    show_shuffle_repeat: "Shuffle and repeat",
    show_previous: "Previous button",
    show_next_up: "Next up",
    show_player: "Speaker picker",
    show_search: "Search button",
    show_recent: "Recently played button",
    background: "Background",
    bg_artwork: "Blurred artwork",
    bg_accent: "Color from artwork",
    bg_theme: "Theme card color",
    advanced: "Advanced",
    hide_unavailable: "Hide unavailable players",
    config_entry_id: "Music Assistant config entry (if the user isn't an admin)",
    footer_space: "Free space at the bottom (px)",
    height: "Height (CSS, e.g. 100dvh)"
  }
}, de = { entity: { domain: "media_player", integration: "music_assistant" } };
let Y = class extends k {
  constructor() {
    super(...arguments), this._ready = !!customElements.get("ha-form") && !!customElements.get("ha-entity-picker"), this._l = (t) => Qs[this._lang][t] ?? t;
  }
  setConfig(t) {
    this._config = t;
  }
  connectedCallback() {
    super.connectedCallback(), this._ready || Js().finally(() => this._ready = !0);
  }
  /** Editor labels follow the HA user's language. */
  get _lang() {
    return (this.hass?.language ?? "sv").startsWith("sv") ? "sv" : "en";
  }
  _schema() {
    const t = this._l, e = S(this._config), s = [
      {
        name: "layout",
        selector: {
          select: {
            mode: "box",
            options: ["fullscreen", "large", "compact"].map((i) => ({
              value: i,
              label: t(`layout_${i}`)
            }))
          }
        }
      },
      { name: "default_player", selector: de },
      { name: "players", selector: { entity: { ...de.entity, multiple: !0 } } },
      {
        name: "language",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "sv", label: "Svenska" },
              { value: "en", label: "English" }
            ]
          }
        }
      }
    ];
    return e !== "fullscreen" && s.push({
      type: "expandable",
      name: "",
      title: t("display"),
      icon: "mdi:eye-outline",
      expanded: !0,
      schema: [
        {
          type: "grid",
          name: "",
          schema: ut.filter((i) => i !== "background").map((i) => ({
            name: i,
            selector: { boolean: {} }
          }))
        },
        {
          name: "background",
          selector: {
            select: {
              mode: "dropdown",
              options: ["artwork", "accent", "theme"].map((i) => ({ value: i, label: t(`bg_${i}`) }))
            }
          }
        }
      ]
    }), s.push({
      type: "expandable",
      name: "",
      title: t("advanced"),
      icon: "mdi:cog-outline",
      schema: [
        { name: "hide_unavailable", selector: { boolean: {} } },
        ...e === "fullscreen" ? [
          { name: "footer_space", selector: { number: { min: 0, max: 400, step: 1, mode: "box", unit_of_measurement: "px" } } },
          { name: "height", selector: { text: {} } }
        ] : [],
        { name: "config_entry_id", selector: { text: {} } }
      ]
    }), s;
  }
  /** What the form shows: config with the layout's defaults filled in. */
  _formData() {
    const t = this._config, e = S(t), s = {
      language: "sv",
      hide_unavailable: !0,
      ...t,
      layout: e
    };
    if (e !== "fullscreen") {
      const i = et[e];
      for (const a of ut) s[a] === void 0 && (s[a] = i[a]);
    }
    return s;
  }
  render() {
    return !this.hass || !this._config ? l : this._ready ? o`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${(t) => this._l(t.name)}
        @value-changed=${this._changed}
      ></ha-form>
    ` : o`<div class="loading">…</div>`;
  }
  _changed(t) {
    t.stopPropagation();
    const e = { ...t.detail.value }, s = S(e);
    e.layout === "fullscreen" && delete e.layout, e.hide_unavailable === !0 && delete e.hide_unavailable;
    for (const r of ["players", "default_player", "config_entry_id", "height"])
      (e[r] === "" || Array.isArray(e[r]) && !e[r].length) && delete e[r];
    (e.footer_space === 0 || e.footer_space === "") && delete e.footer_space;
    const i = this._config ?? {}, a = S(i);
    for (const r of ut) {
      const n = a !== "fullscreen" && i[r] === void 0 && e[r] === et[a][r];
      (s === "fullscreen" || n || e[r] === et[s][r]) && delete e[r];
    }
    e.language === "sv" && delete e.language, this._config = e, this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 }));
  }
};
Y.styles = U`
    .loading {
      padding: 16px;
    }
  `;
$t([
  u({ attribute: !1 })
], Y.prototype, "hass", 2);
$t([
  _()
], Y.prototype, "_config", 2);
$t([
  _()
], Y.prototype, "_ready", 2);
Y = $t([
  j("ma-player-card-editor")
], Y);
async function Js() {
  try {
    const t = await window.loadCardHelpers?.();
    if (!t) return;
    await (await t.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.(), await Promise.race([
      customElements.whenDefined("ha-form"),
      new Promise((s) => setTimeout(s, 3e3))
    ]);
  } catch {
  }
}
var ti = Object.defineProperty, ei = Object.getOwnPropertyDescriptor, V = (t, e, s, i) => {
  for (var a = i > 1 ? void 0 : i ? ei(e, s) : e, r = t.length - 1, n; r >= 0; r--)
    (n = t[r]) && (a = (i ? n(e, s, a) : n(a)) || a);
  return i && a && ti(e, s, a), a;
};
const si = "1.0.0", Ie = "ma-player-card.active", Lt = "120, 170, 255";
let w = class extends k {
  constructor() {
    super(...arguments), this._panel = "none", this._nextItem = null, this._entryId = "", this._accent = Lt, this._toast = null, this._localize = re("sv"), this._players = [], this._queueKey = "", this._entryRequested = !1, this._accentFor = "", this._top = 0, this._measure = () => {
      S(this._config) === "fullscreen" && (cancelAnimationFrame(this._measureFrame), this._measureFrame = requestAnimationFrame(() => {
        const t = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY));
        t !== this._top && (this._top = t);
      }));
    }, this._onError = (t) => this._showError(t.detail), this._onToast = (t) => this._showToast(t.detail, !1), this._closePanel = () => {
      this._panel = "none";
    };
  }
  static getStubConfig() {
    return { type: "custom:ma-player-card", layout: "large" };
  }
  static getConfigElement() {
    return document.createElement("ma-player-card-editor");
  }
  setConfig(t) {
    if (!t) throw new Error("Invalid configuration");
    this._config = { hide_unavailable: !0, ...t }, this._localize = re(t.language ?? "sv");
  }
  getCardSize() {
    const t = S(this._config);
    return t === "compact" ? 2 : t === "large" ? 7 : 12;
  }
  getGridOptions() {
    const t = S(this._config);
    return t === "compact" ? { columns: 12, rows: "auto", min_columns: 6 } : t === "large" ? { columns: 6, rows: "auto", min_columns: 4 } : { columns: "full", rows: "auto" };
  }
  willUpdate(t) {
    !this.hass || !this._config || ((t.has("hass") || t.has("_config")) && (this._players = ns(this.hass, this._config), (!this._activeId || !this.hass.states[this._activeId]) && (this._activeId = cs(this._players, this.hass, ii() ?? this._config.default_player))), this._activeId && (this._entryRequested || (this._entryRequested = !0, ps(this.hass, this._config.config_entry_id).then((e) => this._entryId = e).catch((e) => this._showError(e))), (t.has("hass") || t.has("_activeId")) && (this._refreshQueue(), this._refreshAccent())));
  }
  get _leaderId() {
    return this._activeId ? be(this.hass, this._activeId) : "";
  }
  get _groupIds() {
    const t = this._leaderId;
    return t ? [t, ...ls(this.hass, t)] : [];
  }
  /** Fetch "next up" whenever the playing item on the leader changes. */
  _refreshQueue() {
    const t = this._leaderId, e = this.hass.states[t], s = `${t}|${e?.attributes.media_content_id}|${e?.attributes.media_title}|${e?.attributes.active_queue}`;
    if (s !== this._queueKey) {
      if (this._queueKey = s, !L(e)) {
        this._nextItem = null;
        return;
      }
      ms(this.hass, t).then((i) => {
        this._queueKey === s && (this._nextItem = i?.next_item ?? null);
      }).catch(() => this._nextItem = null);
    }
  }
  _refreshAccent() {
    const t = this.hass.states[this._leaderId], e = L(t) ? F(this.hass, t) : void 0;
    if (!e) {
      this._accentFor = "", this._accent = Lt;
      return;
    }
    e !== this._accentFor && (this._accentFor = e, ys(e).then((s) => {
      this._accentFor === e && (this._accent = s ?? Lt);
    }));
  }
  render() {
    if (!this.hass || !this._config) return l;
    const t = this._activeId;
    if (!t)
      return o`<div class="empty">No Music Assistant players found.</div>`;
    const e = S(this._config);
    return e === "fullscreen" ? this._renderFullscreen(t) : this._renderCard(t, e);
  }
  get _vars() {
    return `--ma-accent:${this._accent};--ma-footer-space:${this._config.footer_space ?? 0}px`;
  }
  _renderBackground(t) {
    return o`
      <div class="bg">
        ${t ? o`<div class="bg-img" style="background-image:url('${t}')"></div>` : l}
        <div class="bg-tint"></div>
      </div>
    `;
  }
  _renderFullscreen(t) {
    const e = this._localize, s = this._leaderId, i = this.hass.states[s], a = this._groupIds, r = L(i) ? F(this.hass, i) : void 0, n = this.hass.states[t]?.attributes.friendly_name ?? t, c = this._config.height ?? `calc(100dvh - ${this._top}px)`;
    return o`
      <div class="root" style="${this._vars};height:${c}">
        ${this._renderBackground(r)}

        <div class="topbar">
          <button class="search-btn" @click=${() => this._panel = "search"}>
            ${d(rt)} <span>${e("search")}</span>
          </button>
          <button class="recent-btn" @click=${() => this._panel = "recent"}>
            ${d(ft)} <span>${e("recent")}</span>
          </button>
          <button class="player-btn" @click=${() => this._panel = "speakers"}>
            ${d(G)}
            <span class="player-name">${n}</span>
            ${a.length > 1 ? o`<span class="count">+${a.length - 1}</span>` : l}
            ${d(we)}
          </button>
        </div>

        <ma-now-playing
          class="main"
          .hass=${this.hass}
          .localize=${e}
          .entityId=${s}
          .volumeIds=${a}
          .nextItem=${this._nextItem}
          @open-search=${() => this._panel = "search"}
          @open-speakers=${() => this._panel = "speakers"}
        ></ma-now-playing>

        ${this._renderOverlays(t)}
      </div>
    `;
  }
  /** Large / compact: a regular dashboard card; speakers and search open as popups. */
  _renderCard(t, e) {
    const s = Ys(this._config), i = this._leaderId, a = this.hass.states[i], r = s.background === "artwork" && L(a) ? F(this.hass, a) : void 0, n = this.hass.states[t]?.attributes.friendly_name ?? t;
    return o`
      <div class="popup-host" style=${this._vars}>
        <ha-card class="card ${e} bg-${s.background}">
          ${s.background === "theme" ? l : this._renderBackground(r)}
          <ma-card-player
            class="main"
            .hass=${this.hass}
            .localize=${this._localize}
            .variant=${e}
            .options=${s}
            .entityId=${i}
            .playerName=${n}
            .volumeIds=${this._groupIds}
            .nextItem=${this._nextItem}
            @open-search=${() => this._panel = "search"}
            @open-recent=${() => this._panel = "recent"}
            @open-speakers=${() => this._panel = "speakers"}
          ></ma-card-player>
        </ha-card>
        ${this._renderOverlays(t)}
      </div>
    `;
  }
  _renderOverlays(t) {
    const e = this._localize, s = this._leaderId, i = this.hass.states[t]?.attributes.friendly_name ?? t;
    return o`
      <div class="scrim ${this._panel === "speakers" ? "show" : ""}" @click=${this._closePanel}></div>
      <aside class="drawer ${this._panel === "speakers" ? "open" : ""}">
        ${this._panel === "speakers" ? o`
              <ma-speaker-panel
                .hass=${this.hass}
                .localize=${e}
                .players=${this._players}
                .activeId=${t}
                .leaderId=${s}
                .groupIds=${this._groupIds}
                @select-player=${(a) => this._select(a.detail)}
                @close=${this._closePanel}
              ></ma-speaker-panel>
            ` : l}
      </aside>

      <ma-search-overlay
        .hass=${this.hass}
        .localize=${e}
        .entityId=${s}
        .playerName=${i}
        .entryId=${this._entryId}
        .mode=${this._panel === "recent" ? "recent" : "search"}
        ?open=${this._panel === "search" || this._panel === "recent"}
        @close=${this._closePanel}
      ></ma-search-overlay>

      ${this._toast ? o`<div class="toast ${this._toast.error ? "error" : ""}">${this._toast.text}</div>` : l}
    `;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("resize", this._measure), this._measure(), setTimeout(this._measure, 500), setTimeout(this._measure, 2e3), this.addEventListener("ma-error", this._onError), this.addEventListener("ma-toast", this._onToast);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("resize", this._measure), this.removeEventListener("ma-error", this._onError), this.removeEventListener("ma-toast", this._onToast);
  }
  _showError(t) {
    const e = t?.message ?? (typeof t == "string" ? t : this._localize("error"));
    this._showToast(e, !0), console.warn("[ma-player-card]", t);
  }
  _showToast(t, e) {
    this._toast = { text: t, error: e }, clearTimeout(this._toastTimer), this._toastTimer = window.setTimeout(() => this._toast = null, e ? 6e3 : 3e3);
  }
  _select(t) {
    this._activeId = t;
    try {
      localStorage.setItem(Ie, t);
    } catch {
    }
  }
};
w.styles = U`
    :host {
      display: block;
      --ma-text: #fff;
      --ma-text-dim: rgba(255, 255, 255, 0.68);
      color: var(--ma-text);
      font-family: var(--ha-font-family-body, var(--primary-font-family, system-ui, sans-serif));
    }
    .root {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 480px;
      background: #0d0d10;
      border-radius: var(--ma-card-radius, 0);
    }
    .bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 0;
    }
    .bg-img {
      position: absolute;
      inset: -10%;
      background-size: cover;
      background-position: center;
      filter: blur(60px) saturate(1.3) brightness(0.55);
      transform: scale(1.1);
      transition: background-image 0.6s;
    }
    .bg-tint {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 30%, rgba(var(--ma-accent), 0.3), transparent 60%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.55));
      transition: background 0.6s;
    }
    .topbar,
    .main {
      position: relative;
      z-index: 1;
    }

    /* ---- large / compact cards ---- */
    .card {
      position: relative;
      display: block;
      overflow: hidden;
      isolation: isolate;
      background: #16161b;
      color: var(--ma-text);
      border-radius: var(--ha-card-border-radius, 12px);
      --ma-chip-bg: rgba(255, 255, 255, 0.12);
      --ma-chip-bg-active: rgba(255, 255, 255, 0.22);
      --ma-play-bg: #fff;
      --ma-play-fg: #111;
    }
    .card .bg-img {
      filter: blur(40px) saturate(1.3) brightness(0.5);
    }
    .card.bg-accent .bg-tint {
      background:
        radial-gradient(ellipse at 15% 20%, rgba(var(--ma-accent), 0.55), transparent 70%),
        linear-gradient(135deg, rgba(var(--ma-accent), 0.25), rgba(0, 0, 0, 0.5));
    }
    .card.bg-theme {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      --ma-text: var(--primary-text-color, #212121);
      --ma-text-dim: var(--secondary-text-color, #727272);
      --ma-chip-bg: rgba(127, 127, 127, 0.14);
      --ma-chip-bg-active: rgba(127, 127, 127, 0.26);
      --ma-play-bg: rgb(var(--ma-accent));
      --ma-play-fg: #fff;
      --ma-slider-rail: rgba(127, 127, 127, 0.3);
      --ma-slider-fill: rgb(var(--ma-accent));
      --ma-slider-thumb-color: rgb(var(--ma-accent));
    }
    /* Popups escape the card and cover the screen. */
    .popup-host .scrim,
    .popup-host .drawer,
    .popup-host .toast {
      position: fixed;
    }
    .popup-host .drawer {
      width: min(520px, 100vw);
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px clamp(24px, 3vw, 48px) 8px;
    }
    .main {
      flex: 1;
      min-height: 0;
      margin-bottom: var(--ma-footer-space, 0px);
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .icon {
      fill: currentColor;
      width: 28px;
      height: 28px;
      flex: none;
      display: block;
    }
    .search-btn,
    .recent-btn,
    .player-btn {
      height: 64px;
      border-radius: 32px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-size: 21px;
      transition: background 0.15s;
    }
    .search-btn:active,
    .recent-btn:active,
    .player-btn:active {
      background: rgba(255, 255, 255, 0.22);
    }
    .search-btn {
      flex: 1;
      max-width: 560px;
      padding: 0 26px;
      color: var(--ma-text-dim);
    }
    .recent-btn {
      flex: none;
      padding: 0 24px 0 20px;
      font-weight: 600;
    }
    .player-btn {
      margin-left: auto;
      padding: 0 20px 0 22px;
      font-weight: 600;
      max-width: 45%;
    }
    .player-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      padding: 2px 10px;
      border-radius: 999px;
      background: rgb(var(--ma-accent));
      color: #111;
      font-size: 16px;
      font-weight: 700;
    }
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 5;
      background: rgba(0, 0, 0, 0.45);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }
    .scrim.show {
      opacity: 1;
      pointer-events: auto;
    }
    .drawer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: var(--ma-footer-space, 0px);
      z-index: 6;
      width: min(560px, 46%);
      background: rgba(22, 22, 28, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
      transform: translateX(105%);
      /* Hidden when closed so its shadow doesn't darken the screen edge. */
      visibility: hidden;
      transition:
        transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
        visibility 0s 0.28s;
    }
    .drawer.open {
      transform: none;
      visibility: visible;
      transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .toast {
      position: absolute;
      left: 50%;
      bottom: calc(28px + var(--ma-footer-space, 0px));
      transform: translateX(-50%);
      z-index: 30;
      max-width: 80%;
      padding: 16px 26px;
      border-radius: 16px;
      background: rgba(40, 40, 46, 0.96);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      font-size: 19px;
      animation: pop 0.2s ease-out;
    }
    .toast.error {
      background: #8b1f1f;
    }
    @keyframes pop {
      from { opacity: 0; transform: translate(-50%, 10px); }
    }
    .empty {
      padding: 32px;
      font-size: 20px;
    }
  `;
V([
  u({ attribute: !1 })
], w.prototype, "hass", 2);
V([
  _()
], w.prototype, "_config", 2);
V([
  _()
], w.prototype, "_activeId", 2);
V([
  _()
], w.prototype, "_panel", 2);
V([
  _()
], w.prototype, "_nextItem", 2);
V([
  _()
], w.prototype, "_entryId", 2);
V([
  _()
], w.prototype, "_accent", 2);
V([
  _()
], w.prototype, "_toast", 2);
V([
  _()
], w.prototype, "_top", 2);
w = V([
  j("ma-player-card")
], w);
function ii() {
  try {
    return localStorage.getItem(Ie) ?? void 0;
  } catch {
    return;
  }
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ma-player-card",
  name: "MA Player Card",
  description: "Music Assistant player: fullscreen for kiosk tablets, or a large or compact dashboard card",
  preview: !0
});
console.info(`%c MA-PLAYER-CARD %c ${si} `, "background:#78aaff;color:#111;font-weight:700", "");
export {
  w as MaPlayerCard
};
