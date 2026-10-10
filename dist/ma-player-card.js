const et = globalThis, _t = et.ShadowRoot && (et.ShadyCSS === void 0 || et.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ft = /* @__PURE__ */ Symbol(), Vt = /* @__PURE__ */ new WeakMap();
let Dt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== ft) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (_t && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = Vt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Vt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const re = (e) => new Dt(typeof e == "string" ? e : e + "", void 0, ft), K = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, a, r) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + e[r + 1], e[0]);
  return new Dt(i, e, ft);
}, ne = (e, t) => {
  if (_t) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), a = et.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, e.appendChild(s);
  }
}, Mt = _t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return re(i);
})(e) : e;
const { is: oe, defineProperty: le, getOwnPropertyDescriptor: ce, getOwnPropertyNames: de, getOwnPropertySymbols: pe, getPrototypeOf: he } = Object, ot = globalThis, Et = ot.trustedTypes, ue = Et ? Et.emptyScript : "", me = ot.reactiveElementPolyfillSupport, Z = (e, t) => e, it = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ue : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, vt = (e, t) => !oe(e, t), Lt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: vt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ot.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Lt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), a = this.getPropertyDescriptor(t, s, i);
      a !== void 0 && le(this.prototype, t, a);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: a, set: r } = ce(this.prototype, t) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: a, set(n) {
      const o = a?.call(this);
      r?.call(this, n), this.requestUpdate(t, o, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const t = he(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const i = this.properties, s = [...de(i), ...pe(i)];
      for (const a of s) this.createProperty(a, i[a]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, a] of i) this.elementProperties.set(s, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const a = this._$Eu(i, s);
      a !== void 0 && this._$Eh.set(a, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const a of s) i.unshift(Mt(a));
    } else t !== void 0 && i.push(Mt(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ne(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), a = this.constructor._$Eu(t, s);
    if (a !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : it).toAttribute(i, s.type);
      this._$Em = t, r == null ? this.removeAttribute(a) : this.setAttribute(a, r), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, a = s._$Eh.get(t);
    if (a !== void 0 && this._$Em !== a) {
      const r = s.getPropertyOptions(a), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : it;
      this._$Em = a;
      const o = n.fromAttribute(i, r.type);
      this[a] = o ?? this._$Ej?.get(a) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, a = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (a === !1 && (r = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? vt)(r, i) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: a, wrapped: r }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? i ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), a === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, r] of s) {
        const { wrapped: n } = r, o = this[a];
        n !== !0 || this._$AL.has(a) || o === void 0 || this.C(a, void 0, r, o);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[Z("elementProperties")] = /* @__PURE__ */ new Map(), z[Z("finalized")] = /* @__PURE__ */ new Map(), me?.({ ReactiveElement: z }), (ot.reactiveElementVersions ??= []).push("2.1.2");
const bt = globalThis, St = (e) => e, st = bt.trustedTypes, Ht = st ? st.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Zt = "$lit$", M = `lit$${Math.random().toFixed(9).slice(2)}$`, Bt = "?" + M, ge = `<${Bt}>`, P = document, B = () => P.createComment(""), F = (e) => e === null || typeof e != "object" && typeof e != "function", yt = Array.isArray, _e = (e) => yt(e) || typeof e?.[Symbol.iterator] == "function", ct = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, It = /-->/g, Pt = />/g, H = RegExp(`>|${ct}(?:([^\\s"'>=/]+)(${ct}*=${ct}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Tt = /'/g, zt = /"/g, Ft = /^(?:script|style|textarea|title)$/i, Gt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = Gt(1), fe = Gt(2), U = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Ot = /* @__PURE__ */ new WeakMap(), I = P.createTreeWalker(P, 129);
function Kt(e, t) {
  if (!yt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ht !== void 0 ? Ht.createHTML(t) : t;
}
const ve = (e, t) => {
  const i = e.length - 1, s = [];
  let a, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = q;
  for (let o = 0; o < i; o++) {
    const l = e[o];
    let u, m, p = -1, _ = 0;
    for (; _ < l.length && (n.lastIndex = _, m = n.exec(l), m !== null); ) _ = n.lastIndex, n === q ? m[1] === "!--" ? n = It : m[1] !== void 0 ? n = Pt : m[2] !== void 0 ? (Ft.test(m[2]) && (a = RegExp("</" + m[2], "g")), n = H) : m[3] !== void 0 && (n = H) : n === H ? m[0] === ">" ? (n = a ?? q, p = -1) : m[1] === void 0 ? p = -2 : (p = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? H : m[3] === '"' ? zt : Tt) : n === zt || n === Tt ? n = H : n === It || n === Pt ? n = q : (n = H, a = void 0);
    const y = n === H && e[o + 1].startsWith("/>") ? " " : "";
    r += n === q ? l + ge : p >= 0 ? (s.push(u), l.slice(0, p) + Zt + l.slice(p) + M + y) : l + M + (p === -2 ? o : y);
  }
  return [Kt(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class G {
  constructor({ strings: t, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let r = 0, n = 0;
    const o = t.length - 1, l = this.parts, [u, m] = ve(t, i);
    if (this.el = G.createElement(u, s), I.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = I.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(Zt)) {
          const _ = m[n++], y = a.getAttribute(p).split(M), A = /([.?@])?(.*)/.exec(_);
          l.push({ type: 1, index: r, name: A[2], strings: y, ctor: A[1] === "." ? ye : A[1] === "?" ? xe : A[1] === "@" ? $e : lt }), a.removeAttribute(p);
        } else p.startsWith(M) && (l.push({ type: 6, index: r }), a.removeAttribute(p));
        if (Ft.test(a.tagName)) {
          const p = a.textContent.split(M), _ = p.length - 1;
          if (_ > 0) {
            a.textContent = st ? st.emptyScript : "";
            for (let y = 0; y < _; y++) a.append(p[y], B()), I.nextNode(), l.push({ type: 2, index: ++r });
            a.append(p[_], B());
          }
        }
      } else if (a.nodeType === 8) if (a.data === Bt) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(M, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += M.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const s = P.createElement("template");
    return s.innerHTML = t, s;
  }
}
function N(e, t, i = e, s) {
  if (t === U) return t;
  let a = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const r = F(t) ? void 0 : t._$litDirective$;
  return a?.constructor !== r && (a?._$AO?.(!1), r === void 0 ? a = void 0 : (a = new r(e), a._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = a : i._$Cl = a), a !== void 0 && (t = N(e, a._$AS(e, t.values), a, s)), t;
}
class be {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, a = (t?.creationScope ?? P).importNode(i, !0);
    I.currentNode = a;
    let r = I.nextNode(), n = 0, o = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let u;
        l.type === 2 ? u = new W(r, r.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (u = new we(r, this, t)), this._$AV.push(u), l = s[++o];
      }
      n !== l?.index && (r = I.nextNode(), n++);
    }
    return I.currentNode = P, a;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class W {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, a) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = N(this, t, i), F(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : _e(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && F(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, a = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = G.createElement(Kt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const r = new be(a, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let i = Ot.get(t.strings);
    return i === void 0 && Ot.set(t.strings, i = new G(t)), i;
  }
  k(t) {
    yt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const r of t) a === i.length ? i.push(s = new W(this.O(B()), this.O(B()), this, this.options)) : s = i[a], s._$AI(r), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = St(t).nextSibling;
      St(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class lt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, a, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = a, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, i = this, s, a) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = N(this, t, i, 0), n = !F(t) || t !== this._$AH && t !== U, n && (this._$AH = t);
    else {
      const o = t;
      let l, u;
      for (t = r[0], l = 0; l < r.length - 1; l++) u = N(this, o[s + l], i, l), u === U && (u = this._$AH[l]), n ||= !F(u) || u !== this._$AH[l], u === d ? t = d : t !== d && (t += (u ?? "") + r[l + 1]), this._$AH[l] = u;
    }
    n && !a && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ye extends lt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class xe extends lt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class $e extends lt {
  constructor(t, i, s, a, r) {
    super(t, i, s, a, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = N(this, t, i, 0) ?? d) === U) return;
    const s = this._$AH, a = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== d && (s === d || a);
    a && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class we {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const Ae = bt.litHtmlPolyfillSupport;
Ae?.(G, W), (bt.litHtmlVersions ??= []).push("3.3.3");
const ke = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let a = s._$litPart$;
  if (a === void 0) {
    const r = i?.renderBefore ?? null;
    s._$litPart$ = a = new W(t.insertBefore(B(), r), r, void 0, i ?? {});
  }
  return a._$AI(e), a;
};
const xt = globalThis;
class V extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ke(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return U;
  }
}
V._$litElement$ = !0, V.finalized = !0, xt.litElementHydrateSupport?.({ LitElement: V });
const Ce = xt.litElementPolyfillSupport;
Ce?.({ LitElement: V });
(xt.litElementVersions ??= []).push("4.2.2");
const Y = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Ve = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: vt }, Me = (e = Ve, t, i) => {
  const { kind: s, metadata: a } = i;
  let r = globalThis.litPropertyMetadata.get(a);
  if (r === void 0 && globalThis.litPropertyMetadata.set(a, r = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), s === "accessor") {
    const { name: n } = i;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(n, l, e, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, e, o), o;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(o) {
      const l = this[n];
      t.call(this, o), this.requestUpdate(n, l, e, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function g(e) {
  return (t, i) => typeof i == "object" ? Me(e, t, i) : ((s, a, r) => {
    const n = a.hasOwnProperty(r);
    return a.constructor.createProperty(r, s), n ? Object.getOwnPropertyDescriptor(a, r) : void 0;
  })(e, t, i);
}
function v(e) {
  return g({ ...e, state: !0, attribute: !1 });
}
const Ee = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
function Le(e, t) {
  return (i, s, a) => {
    const r = (n) => n.renderRoot?.querySelector(e) ?? null;
    return Ee(i, s, { get() {
      return r(this);
    } });
  };
}
const Wt = (e) => !!e && e.entity_id.startsWith("media_player.") && "mass_player_type" in e.attributes;
function Se(e, t) {
  const s = (t.players?.length ? t.players : Object.keys(e.states).filter((a) => Wt(e.states[a]))).map((a) => e.states[a]).filter((a) => !!a).map((a) => He(a)).filter((a) => a.available || t.hide_unavailable === !1);
  return t.players?.length ? s : s.sort(
    (a, r) => a.isGroup === r.isGroup ? a.name.localeCompare(r.name, "sv") : a.isGroup ? -1 : 1
  );
}
function He(e) {
  return {
    id: e.entity_id,
    name: e.attributes.friendly_name ?? e.entity_id,
    entity: e,
    isGroup: e.attributes.mass_player_type === "group",
    available: e.state !== "unavailable" && e.state !== "unknown",
    playing: e.state === "playing"
  };
}
const ut = (e) => e?.attributes.group_members ?? [];
function Yt(e, t) {
  const i = ut(e.states[t]);
  if (i.length > 1 && i[0] !== t && i.includes(t) && e.states[i[0]]) return i[0];
  for (const [s, a] of Object.entries(e.states)) {
    if (s === t || !Wt(a) || a.attributes.mass_player_type === "group") continue;
    const r = ut(a);
    if (r.length > 1 && r[0] === s && r.includes(t)) return s;
  }
  return t;
}
function Ie(e, t) {
  const i = e.states[t];
  return !i || i.attributes.mass_player_type === "group" ? [] : ut(i).filter((s) => s !== t);
}
function O(e) {
  return e ? !["off", "unavailable", "unknown", "standby"].includes(e.state) && !!(e.attributes.media_title || e.attributes.media_content_id) : !1;
}
function Pe(e, t, i) {
  if (i && t.states[i]) return i;
  const s = e.filter((a) => a.entity.attributes.app_id === "music_assistant");
  return s.find((a) => a.playing)?.id ?? e.find((a) => a.playing)?.id ?? s.find((a) => a.entity.state === "paused")?.id ?? e[0]?.id;
}
async function L(e, t, i, s = {}, a, r = !1) {
  return (await e.callWS({
    type: "call_service",
    domain: t,
    service: i,
    service_data: s,
    ...a ? { target: { entity_id: a } } : {},
    ...r ? { return_response: !0 } : {}
  }))?.response;
}
let tt;
async function Te(e, t) {
  if (t && t !== "auto") return t;
  if (tt) return tt;
  const i = await e.callWS({
    type: "config_entries/get",
    domain: "music_assistant"
  }), s = i.find((a) => a.state === "loaded") ?? i[0];
  if (!s) throw new Error("Music Assistant integration not found");
  return tt = s.entry_id, tt;
}
const Xt = (e) => !!e.name?.trim();
async function ze(e, t, i, s, a) {
  const r = await L(
    e,
    "music_assistant",
    "search",
    { config_entry_id: t, name: i, media_type: s, limit: a },
    void 0,
    !0
  ), n = {};
  for (const [o, l] of Object.entries(r ?? {})) n[o] = (l ?? []).filter(Xt);
  return n;
}
async function Oe(e, t, i, s = {}) {
  return ((await L(
    e,
    "music_assistant",
    "get_library",
    { config_entry_id: t, media_type: i, limit: s.limit ?? 30, ...s },
    void 0,
    !0
  ))?.items ?? []).filter(Xt);
}
function Ue(e, t, i, s, a = !1) {
  return L(
    e,
    "music_assistant",
    "play_media",
    {
      media_id: i.uri,
      media_type: i.media_type,
      enqueue: s,
      ...a ? { radio_mode: !0 } : {}
    },
    t
  );
}
async function Ne(e, t) {
  return (await L(
    e,
    "music_assistant",
    "get_queue",
    {},
    t,
    !0
  ))?.[t] ?? null;
}
const Re = (e, t, i) => L(e, "music_assistant", "transfer_queue", { source_player: t, auto_play: !0 }, i), je = (e, t, i) => L(e, "media_player", "join", { group_members: i }, t), qe = (e, t) => L(e, "media_player", "unjoin", {}, t), at = (e, t, i, s = {}) => L(e, "media_player", i, s, t), De = {
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
  recent: "Senast spelat",
  no_results: "Inga träffar",
  searching: "Söker…",
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
}, Ze = {
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
}, Ut = (e) => {
  const t = e === "en" ? Ze : De;
  return (i) => t[i] ?? i;
}, D = /* @__PURE__ */ new Map();
async function Be(e) {
  if (D.has(e)) return D.get(e);
  const t = await new Promise((i) => {
    const s = new Image();
    s.crossOrigin = "anonymous", s.onload = () => {
      try {
        const r = document.createElement("canvas");
        r.width = r.height = 24;
        const n = r.getContext("2d", { willReadFrequently: !0 });
        n.drawImage(s, 0, 0, 24, 24);
        const o = n.getImageData(0, 0, 24, 24).data;
        let l = 0, u = 0, m = 0, p = 0;
        for (let _ = 0; _ < o.length; _ += 4) {
          const [y, A, j] = [o[_], o[_ + 1], o[_ + 2]], Q = Math.max(y, A, j), ae = Math.min(y, A, j), kt = Q === 0 ? 0 : (Q - ae) / Q, Ct = Q / 255, J = 0.05 + kt * kt * (Ct > 0.15 && Ct < 0.95 ? 1 : 0.2);
          l += y * J, u += A * J, m += j * J, p += J;
        }
        i(Fe(l / p, u / p, m / p));
      } catch {
        i(null);
      }
    }, s.onerror = () => i(null), s.src = e;
  });
  return D.size > 50 && D.clear(), D.set(e, t), t;
}
function Fe(e, t, i) {
  const s = Math.max(e, t, i, 1), r = Math.min(Math.max(s, 140), 230) / s;
  return [e, t, i].map((n) => Math.round(Math.min(255, n * r))).join(", ");
}
const $ = {
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  SHUFFLE_SET: 32768,
  REPEAT_SET: 262144,
  GROUPING: 524288
}, w = (e, t) => !!e && ((e.attributes.supported_features ?? 0) & t) !== 0;
function rt(e, t) {
  const i = t?.attributes.entity_picture_local || t?.attributes.entity_picture;
  if (i)
    return /^https?:/.test(i) ? i : e.hassUrl ? e.hassUrl(i) : i;
}
function Nt(e) {
  if (e === void 0 || !Number.isFinite(e) || e < 0) return "–:––";
  const t = Math.floor(e), i = Math.floor(t / 3600), s = Math.floor(t % 3600 / 60), a = String(t % 60).padStart(2, "0");
  return i ? `${i}:${String(s).padStart(2, "0")}:${a}` : `${s}:${a}`;
}
function Ge(e) {
  const t = e?.attributes;
  if (!t || t.media_position === void 0) return;
  let i = Number(t.media_position);
  e.state === "playing" && t.media_position_updated_at && (i += (Date.now() - new Date(t.media_position_updated_at).getTime()) / 1e3);
  const s = Number(t.media_duration);
  return s > 0 ? Math.min(i, s) : i;
}
const Qt = (e, t) => Number(e.states[t]?.attributes.volume_level ?? 0), $t = (e, t) => t.length ? t.reduce((i, s) => i + Qt(e, s), 0) / t.length : 0;
function Jt(e, t, i) {
  const s = i - $t(e, t);
  return Promise.all(
    t.map(
      (a) => at(e, a, "volume_set", {
        volume_level: Ke(Math.min(1, Math.max(0, Qt(e, a) + s)))
      })
    )
  );
}
const Ke = (e) => Math.round(e * 100) / 100, We = (e) => [e?.attributes.media_artist, e?.attributes.media_album_name].filter(Boolean).join(" · ");
var Ye = "M11,14C12,14 13.05,14.16 14.2,14.44C13.39,15.31 13,16.33 13,17.5C13,18.39 13.25,19.23 13.78,20H3V18C3,16.81 3.91,15.85 5.74,15.12C7.57,14.38 9.33,14 11,14M11,12C9.92,12 9,11.61 8.18,10.83C7.38,10.05 7,9.11 7,8C7,6.92 7.38,6 8.18,5.18C9,4.38 9.92,4 11,4C12.11,4 13.05,4.38 13.83,5.18C14.61,6 15,6.92 15,8C15,9.11 14.61,10.05 13.83,10.83C13.05,11.61 12.11,12 11,12M18.5,10H20L22,10V12H20V17.5A2.5,2.5 0 0,1 17.5,20A2.5,2.5 0 0,1 15,17.5A2.5,2.5 0 0,1 17.5,15C17.86,15 18.19,15.07 18.5,15.21V10Z", Xe = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12,16.5C9.5,16.5 7.5,14.5 7.5,12C7.5,9.5 9.5,7.5 12,7.5C14.5,7.5 16.5,9.5 16.5,12C16.5,14.5 14.5,16.5 12,16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z", Qe = "M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z", Je = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z", ti = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z", te = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z", Rt = "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z", wt = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z", At = "M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z", ei = "M14,19H18V5H14M6,19H10V5H6V19Z", mt = "M8,5.14V19.14L19,12.14L8,5.14Z", ii = "M15,6H3V8H15V6M15,10H3V12H15V10M3,16H11V14H3V16M17,6V14.18C16.69,14.07 16.35,14 16,14A3,3 0 0,0 13,17A3,3 0 0,0 16,20A3,3 0 0,0 19,17V8H22V6H17Z", si = "M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z", ai = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z", ri = "M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z", ni = "M20,6A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8C2,7.15 2.53,6.42 3.28,6.13L15.71,1L16.47,2.83L8.83,6H20M20,8H4V12H16V10H18V12H20V8M7,14A3,3 0 0,0 4,17A3,3 0 0,0 7,20A3,3 0 0,0 10,17A3,3 0 0,0 7,14Z", oi = "M12,10A2,2 0 0,1 14,12C14,12.5 13.82,12.94 13.53,13.29L16.7,22H14.57L12,14.93L9.43,22H7.3L10.47,13.29C10.18,12.94 10,12.5 10,12A2,2 0 0,1 12,10M12,8A4,4 0 0,0 8,12C8,12.5 8.1,13 8.28,13.46L7.4,15.86C6.53,14.81 6,13.47 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12C18,13.47 17.47,14.81 16.6,15.86L15.72,13.46C15.9,13 16,12.5 16,12A4,4 0 0,0 12,8M12,4A8,8 0 0,0 4,12C4,14.36 5,16.5 6.64,17.94L5.92,19.94C3.54,18.11 2,15.23 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12C22,15.23 20.46,18.11 18.08,19.94L17.36,17.94C19,16.5 20,14.36 20,12A8,8 0 0,0 12,4Z", li = "M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z", ci = "M2,5.27L3.28,4L20,20.72L18.73,22L15.73,19H7V22L3,18L7,14V17H13.73L7,10.27V11H5V8.27L2,5.27M17,13H19V17.18L17,15.18V13M17,5V2L21,6L17,10V7H8.82L6.82,5H17Z", di = "M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z", pi = "M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z", hi = "M16,4.5V7H5V9H16V11.5L19.5,8M16,12.5V15H5V17H16V19.5L19.5,16", ui = "M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12", mi = "M16,18H18V6H16M6,18L14.5,12L6,6V18Z", gi = "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z", _i = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", nt = "M14,10A3,3 0 0,0 11,13A3,3 0 0,0 14,16A3,3 0 0,0 17,13A3,3 0 0,0 14,10M14,18A5,5 0 0,1 9,13A5,5 0 0,1 14,8A5,5 0 0,1 19,13A5,5 0 0,1 14,18M14,2A2,2 0 0,1 16,4A2,2 0 0,1 14,6A2,2 0 0,1 12,4A2,2 0 0,1 14,2M19,0H9A2,2 0 0,0 7,2V18A2,2 0 0,0 9,20H19A2,2 0 0,0 21,18V2A2,2 0 0,0 19,0M5,22H17V24H5A2,2 0 0,1 3,22V4H5", fi = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z", ee = "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z", vi = "M7,9V15H11L16,20V4L11,9H7Z", bi = "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z", ie = "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z";
const h = (e) => fe`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${e}></path></svg>`;
var yi = Object.defineProperty, xi = Object.getOwnPropertyDescriptor, X = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? xi(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (s ? n(t, i, a) : n(a)) || a);
  return s && a && yi(t, i, a), a;
};
let T = class extends V {
  constructor() {
    super(...arguments), this.value = 0, this.disabled = !1, this.label = "", this._dragValue = null, this._holdUntil = 0, this._heldValue = 0;
  }
  get _shown() {
    return this._dragValue !== null ? this._dragValue : Date.now() < this._holdUntil ? this._heldValue : jt(this.value);
  }
  render() {
    const e = `${this._shown * 100}%`;
    return c`
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
        <div class="rail"><div class="fill" style="width:${e}"></div></div>
        <div class="thumb" style="left:${e}"></div>
      </div>
    `;
  }
  _valueAt(e) {
    const t = this.getBoundingClientRect();
    return jt((e.clientX - t.left) / t.width);
  }
  _down(e) {
    this.disabled || (e.currentTarget.setPointerCapture(e.pointerId), this._dragValue = this._valueAt(e), this._emit("value-input", this._dragValue));
  }
  _move(e) {
    this._dragValue !== null && (this._dragValue = this._valueAt(e), this._emit("value-input", this._dragValue));
  }
  _up() {
    if (this._dragValue === null) return;
    const e = this._dragValue;
    this._dragValue = null, this._heldValue = e, this._holdUntil = Date.now() + 2e3, this._emit("value-change", e), setTimeout(() => this.requestUpdate(), 2050);
  }
  _emit(e, t) {
    this.dispatchEvent(new CustomEvent(e, { detail: { value: t } }));
  }
};
T.styles = K`
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
X([
  g({ type: Number })
], T.prototype, "value", 2);
X([
  g({ type: Boolean, reflect: !0 })
], T.prototype, "disabled", 2);
X([
  g()
], T.prototype, "label", 2);
X([
  v()
], T.prototype, "_dragValue", 2);
T = X([
  Y("ma-slider")
], T);
const jt = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
var $i = Object.defineProperty, wi = Object.getOwnPropertyDescriptor, R = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? wi(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (s ? n(t, i, a) : n(a)) || a);
  return s && a && $i(t, i, a), a;
};
let E = class extends V {
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
    const e = this.hass.states[this.entityId];
    if (!e) return d;
    const t = this.localize, i = O(e), s = i ? rt(this.hass, e) : void 0;
    return c`
      <div class="art-wrap">
        ${s ? c`<img class="art" src=${s} alt="" />` : c`<div class="art placeholder">${h(At)}</div>`}
      </div>
      <div class="info">
        ${i ? c`
              <div class="titles">
                <div class="title">${e.attributes.media_title ?? ""}</div>
                <div class="artist">${We(e)}</div>
              </div>
              ${this._renderProgress()} ${this._renderTransport()}
            ` : c`
              <div class="titles">
                <div class="title">${t("nothing_playing")}</div>
                <div class="artist hint">${t("nothing_playing_hint")}</div>
              </div>
              <div class="idle-actions">
                <button class="pill" @click=${() => this._fire("open-search")}>
                  ${h(wt)} ${t("search")}
                </button>
                <button class="pill" @click=${() => this._fire("open-speakers")}>
                  ${h(nt)} ${t("speakers")}
                </button>
              </div>
            `}
        ${this._renderVolume()} ${i ? this._renderNext() : d}
      </div>
    `;
  }
  _renderProgress() {
    const e = this.hass.states[this.entityId], t = Number(e.attributes.media_duration), i = Ge(e);
    return t > 0 ? c`
      <div class="progress">
        <ma-slider
          class="seek"
          .value=${(i ?? 0) / t}
          ?disabled=${!w(e, $.SEEK)}
          @value-change=${(s) => this._call("media_seek", { seek_position: Math.round(s.detail.value * t) })}
        ></ma-slider>
        <div class="times"><span>${Nt(i)}</span><span>${Nt(t)}</span></div>
      </div>
    ` : c`<div class="progress-spacer"></div>`;
  }
  _renderTransport() {
    const e = this.hass.states[this.entityId], t = e.attributes, i = e.state === "playing", s = t.repeat ?? "off", a = s === "off" ? "all" : s === "all" ? "one" : "off";
    return c`
      <div class="transport">
        <button
          class="ctl small ${t.shuffle ? "on" : ""}"
          ?disabled=${!w(e, $.SHUFFLE_SET)}
          @click=${() => this._call("shuffle_set", { shuffle: !t.shuffle })}
        >
          ${h(t.shuffle ? pi : hi)}
        </button>
        <button class="ctl" ?disabled=${!w(e, $.PREVIOUS_TRACK)} @click=${() => this._call("media_previous_track")}>
          ${h(gi)}
        </button>
        <button class="ctl play" @click=${() => this._call("media_play_pause")}>
          ${h(i ? ei : mt)}
        </button>
        <button class="ctl" ?disabled=${!w(e, $.NEXT_TRACK)} @click=${() => this._call("media_next_track")}>
          ${h(mi)}
        </button>
        <button
          class="ctl small ${s !== "off" ? "on" : ""}"
          ?disabled=${!w(e, $.REPEAT_SET)}
          @click=${() => this._call("repeat_set", { repeat: a })}
        >
          ${h(s === "one" ? di : s === "all" ? li : ci)}
        </button>
      </div>
    `;
  }
  _renderVolume() {
    const e = this.hass.states[this.entityId];
    if (!w(e, $.VOLUME_SET)) return d;
    const t = this.localize, i = this.volumeIds.length ? this.volumeIds : [this.entityId], s = i.length > 1, a = s ? $t(this.hass, i) : Number(e.attributes.volume_level ?? 0), r = !!e.attributes.is_volume_muted, n = r || a === 0 ? ie : a < 0.33 ? vi : a < 0.66 ? bi : ee;
    return c`
      <div class="volume">
        <button
          class="ctl small"
          title=${t(r ? "unmute" : "mute")}
          ?disabled=${!w(e, $.VOLUME_MUTE)}
          @click=${() => this._call("volume_mute", { is_volume_muted: !r })}
        >
          ${h(n)}
        </button>
        <ma-slider
          class="vol"
          .value=${a}
          .label=${s ? t("group_volume") : ""}
          @value-input=${(o) => this._setVolume(i, o.detail.value, !0)}
          @value-change=${(o) => this._setVolume(i, o.detail.value, !1)}
        ></ma-slider>
        <span class="vol-pct">${Math.round(a * 100)}</span>
      </div>
      ${s ? c`<div class="vol-caption">${t("group_volume")} · ${i.length}</div>` : d}
    `;
  }
  _renderNext() {
    const e = this.nextItem;
    if (!e) return d;
    const t = e.media_item, i = t?.name ?? e.name, s = t?.artists?.map((a) => a.name).join(", ");
    return c`
      <div class="next">
        <span class="next-label">${this.localize("next_up")}</span>
        <span class="next-title">${i}${s ? c` <span class="dim">– ${s}</span>` : d}</span>
      </div>
    `;
  }
  _setVolume(e, t, i) {
    const s = Date.now();
    if (i && s - this._lastVolSend < 250) return;
    this._lastVolSend = s, (e.length > 1 ? Jt(this.hass, e, t) : at(this.hass, e[0], "volume_set", { volume_level: Math.round(t * 100) / 100 })).catch((r) => this._error(r));
  }
  _call(e, t = {}) {
    at(this.hass, this.entityId, e, t).catch((i) => this._error(i));
  }
  _error(e) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: e, bubbles: !0, composed: !0 }));
  }
  _fire(e) {
    this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0 }));
  }
};
E.styles = K`
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
R([
  g({ attribute: !1 })
], E.prototype, "hass", 2);
R([
  g({ attribute: !1 })
], E.prototype, "localize", 2);
R([
  g()
], E.prototype, "entityId", 2);
R([
  g({ attribute: !1 })
], E.prototype, "volumeIds", 2);
R([
  g({ attribute: !1 })
], E.prototype, "nextItem", 2);
E = R([
  Y("ma-now-playing")
], E);
var Ai = Object.defineProperty, ki = Object.getOwnPropertyDescriptor, S = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ki(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (s ? n(t, i, a) : n(a)) || a);
  return s && a && Ai(t, i, a), a;
};
let k = class extends V {
  constructor() {
    super(...arguments), this.players = [], this.activeId = "", this.leaderId = "", this.groupIds = [], this._busy = /* @__PURE__ */ new Set();
  }
  render() {
    const e = this.localize, t = this.hass.states[this.leaderId], i = t?.attributes.friendly_name ?? "", s = w(t, $.GROUPING) && t?.attributes.mass_player_type !== "group", a = this.groupIds.length > 1;
    return c`
      <header>
        <h2>${e("speakers")}</h2>
        <button class="icon-btn" @click=${() => this._fire("close")} aria-label=${e("close")}>
          ${h(te)}
        </button>
      </header>
      ${a ? c`
            <section class="group-card">
              <div class="group-head">
                ${h(nt)}
                <div>
                  <div class="group-title">${e("group")}: ${i}</div>
                  <div class="group-sub">
                    ${this.groupIds.map((r) => this.hass.states[r]?.attributes.friendly_name).join(", ")}
                  </div>
                </div>
              </div>
              <div class="vol-row">
                <span class="vol-label">${e("group_volume")}</span>
                <ma-slider
                  .value=${$t(this.hass, this.groupIds)}
                  @value-change=${(r) => Jt(this.hass, this.groupIds, r.detail.value).catch((n) => this._error(n))}
                ></ma-slider>
              </div>
            </section>
          ` : d}
      <div class="list">${this.players.map((r) => this._renderPlayer(r, s))}</div>
    `;
  }
  _renderPlayer(e, t) {
    const i = this.localize, s = e.entity, a = e.id === this.activeId, r = this.groupIds.includes(e.id), n = e.id === this.leaderId, o = Yt(this.hass, e.id), l = O(this.hass.states[o]), u = this.hass.states[o], m = l ? rt(this.hass, u) : void 0, p = this._busy.has(e.id), _ = !!s.attributes.is_volume_muted, y = t && !e.isGroup && w(s, $.GROUPING) && !n && e.available, A = !a && !r && e.available && O(this.hass.states[this.leaderId]) && o !== this.leaderId;
    return c`
      <div class="player ${a ? "active" : ""} ${r ? "in-group" : ""} ${e.available ? "" : "unavailable"}">
        <button class="main" @click=${() => this._select(e.id)} ?disabled=${!e.available}>
          <div class="thumb">
            ${m ? c`<img src=${m} alt="" />` : h(e.isGroup ? nt : _i)}
          </div>
          <div class="text">
            <div class="name">
              ${e.name} ${a ? c`<span class="badge">${i("active")}</span>` : d}
            </div>
            <div class="status">
              ${l ? [u.attributes.media_title, u.attributes.media_artist].filter(Boolean).join(" – ") : this._stateLabel(s.state)}
              ${o !== e.id ? c`<span class="dim"> · ${i("grouped_with")} ${this.hass.states[o]?.attributes.friendly_name}</span>` : d}
            </div>
          </div>
        </button>
        <div class="actions">
          ${y ? c`
                <button
                  class="toggle ${r ? "on" : ""}"
                  ?disabled=${p}
                  @click=${() => this._toggleGroup(e.id, r)}
                  title=${i(r ? "remove_from_group" : "add_to_group")}
                >
                  ${h(r ? Je : ai)}
                  <span>${i(r ? "in_group" : "add_to_group")}</span>
                </button>
              ` : d}
          ${A ? c`
                <button class="icon-btn" ?disabled=${p} title=${i("transfer_here")} @click=${() => this._transfer(e.id)}>
                  ${h(fi)}
                </button>
              ` : d}
        </div>
        ${e.available && w(s, $.VOLUME_SET) ? c`
              <div class="vol-row">
                <button
                  class="icon-btn small"
                  ?disabled=${!w(s, $.VOLUME_MUTE)}
                  @click=${() => this._cmd(e.id, "volume_mute", { is_volume_muted: !_ })}
                >
                  ${h(_ ? ie : ee)}
                </button>
                <ma-slider
                  .value=${Number(s.attributes.volume_level ?? 0)}
                  @value-change=${(j) => this._cmd(e.id, "volume_set", { volume_level: Math.round(j.detail.value * 100) / 100 })}
                ></ma-slider>
                <span class="pct">${Math.round(Number(s.attributes.volume_level ?? 0) * 100)}</span>
              </div>
            ` : d}
      </div>
    `;
  }
  _stateLabel(e) {
    const t = ["playing", "paused", "idle", "off", "unavailable"].includes(e) ? e : "idle";
    return this.localize(t);
  }
  _select(e) {
    this.dispatchEvent(new CustomEvent("select-player", { detail: e, bubbles: !0, composed: !0 }));
  }
  async _toggleGroup(e, t) {
    await this._withBusy(e, () => t ? qe(this.hass, e) : je(this.hass, this.leaderId, [e]));
  }
  async _transfer(e) {
    await this._withBusy(e, () => Re(this.hass, this.leaderId, e)), this._select(e);
  }
  _cmd(e, t, i) {
    at(this.hass, e, t, i).catch((s) => this._error(s));
  }
  async _withBusy(e, t) {
    this._busy = new Set(this._busy).add(e);
    try {
      await t();
    } catch (i) {
      this._error(i);
    } finally {
      const i = new Set(this._busy);
      i.delete(e), this._busy = i;
    }
  }
  _error(e) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: e, bubbles: !0, composed: !0 }));
  }
  _fire(e) {
    this.dispatchEvent(new CustomEvent(e, { bubbles: !0, composed: !0 }));
  }
};
k.styles = K`
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
S([
  g({ attribute: !1 })
], k.prototype, "hass", 2);
S([
  g({ attribute: !1 })
], k.prototype, "localize", 2);
S([
  g({ attribute: !1 })
], k.prototype, "players", 2);
S([
  g()
], k.prototype, "activeId", 2);
S([
  g()
], k.prototype, "leaderId", 2);
S([
  g({ attribute: !1 })
], k.prototype, "groupIds", 2);
S([
  v()
], k.prototype, "_busy", 2);
k = S([
  Y("ma-speaker-panel")
], k);
var Ci = Object.defineProperty, Vi = Object.getOwnPropertyDescriptor, b = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Vi(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (s ? n(t, i, a) : n(a)) || a);
  return s && a && Ci(t, i, a), a;
};
const gt = [
  { key: "artists", type: "artist", label: "artists" },
  { key: "albums", type: "album", label: "albums" },
  { key: "tracks", type: "track", label: "tracks" },
  { key: "playlists", type: "playlist", label: "playlists" },
  { key: "radio", type: "radio", label: "radio" },
  { key: "podcasts", type: "podcast", label: "podcasts" },
  { key: "audiobooks", type: "audiobook", label: "audiobooks" }
], Mi = [
  { tab: "all", label: "all" },
  { tab: "artist", label: "artists" },
  { tab: "album", label: "albums" },
  { tab: "track", label: "tracks" },
  { tab: "playlist", label: "playlists" },
  { tab: "radio", label: "radio" },
  { tab: "podcast", label: "podcasts" }
], Ei = ["artist", "album", "track", "playlist", "radio"], Li = ["playlist", "album", "artist", "radio", "track"], qt = {
  artist: Ye,
  album: Xe,
  track: At,
  playlist: ii,
  radio: ni,
  podcast: ri,
  audiobook: Qe
};
let f = class extends V {
  constructor() {
    super(...arguments), this.entityId = "", this.playerName = "", this.entryId = "", this.open = !1, this._query = "", this._tab = "all", this._results = null, this._favorites = null, this._loading = !1, this._menuItem = null, this._vvHeight = null, this._seq = 0, this._favoritesRequested = !1, this._longPressed = !1, this._onViewport = () => {
      const e = window.visualViewport;
      e && (this._vvHeight = e.height, this.style.setProperty("--ma-vv-top", `${e.offsetTop}px`));
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.visualViewport?.addEventListener("resize", this._onViewport), window.visualViewport?.addEventListener("scroll", this._onViewport);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.visualViewport?.removeEventListener("resize", this._onViewport), window.visualViewport?.removeEventListener("scroll", this._onViewport);
  }
  willUpdate(e) {
    e.has("open") && this.open && this._onViewport(), (e.has("open") || e.has("entryId")) && this.open && this.entryId && !this._favoritesRequested && (this._favoritesRequested = !0, this._loadFavorites());
  }
  updated(e) {
    e.has("open") && this.open && (this._input?.focus(), this._input?.select());
  }
  render() {
    if (!this.open) return d;
    const e = this.localize, t = this._vvHeight ? `height:${this._vvHeight}px` : "";
    return c`
      <div class="sheet" style=${t}>
        <div class="top">
          <label class="field">
            ${h(wt)}
            <input
              type="search"
              inputmode="search"
              enterkeyhint="search"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder=${e("search_placeholder")}
              .value=${this._query}
              @input=${this._onInput}
              @keydown=${this._onKey}
            />
            ${this._query ? c`<button class="clear" @click=${this._clear} aria-label="clear">${h(te)}</button>` : d}
          </label>
          <button class="close" @click=${this._close}>${e("close")}</button>
        </div>
        <div class="tabs">
          ${Mi.map(
      ({ tab: i, label: s }) => c`
              <button class="tab ${this._tab === i ? "on" : ""}" @click=${() => this._setTab(i)}>
                ${e(s)}
              </button>
            `
    )}
          <span class="target">${e("playing_on")}: <b>${this.playerName}</b></span>
        </div>
        <div class="results">${this._renderBody()}</div>
        ${this._menuItem ? this._renderMenu(this._menuItem) : d}
      </div>
    `;
  }
  _renderBody() {
    const e = this.localize, t = this._query.trim(), i = t.length >= 2 ? this._results : this._favorites;
    if (!i) return c`<div class="msg">${this._loading ? e("searching") : ""}</div>`;
    const s = gt.filter((r) => this._tab === "all" ? !0 : r.type === this._tab).map((r) => ({ ...r, items: i[r.key] ?? [] })).filter((r) => r.items.length);
    if (!s.length)
      return c`<div class="msg">${this._loading ? e("searching") : e("no_results")}</div>`;
    const a = this._tab !== "all";
    return c`
      ${this._loading ? c`<div class="loading-bar"></div>` : d}
      ${t.length < 2 ? c`<h2 class="fav-title">${e("favorites")}</h2>` : d}
      ${s.map(
      (r) => c`
          <section>
            ${a ? d : c`<h3>${e(r.label)}</h3>`}
            ${r.type === "track" ? c`<div class="tracks ${a ? "full" : ""}">${r.items.map((n) => this._renderTrack(n))}</div>` : c`<div class="${a ? "grid" : "row"}">${r.items.map((n) => this._renderTile(n))}</div>`}
          </section>
        `
    )}
    `;
  }
  _pressHandlers(e) {
    return {
      down: () => {
        this._longPressed = !1, this._longPressTimer = window.setTimeout(() => {
          this._longPressed = !0, this._menuItem = e;
        }, 550);
      },
      cancel: () => clearTimeout(this._longPressTimer),
      click: () => {
        clearTimeout(this._longPressTimer), this._longPressed || this._play(e, Si(e));
      }
    };
  }
  _renderTile(e) {
    const t = this._pressHandlers(e), i = dt(e);
    return c`
      <div class="tile ${e.media_type}">
        <button
          class="tile-main"
          @pointerdown=${t.down}
          @pointerup=${t.cancel}
          @pointerleave=${t.cancel}
          @pointercancel=${t.cancel}
          @contextmenu=${(s) => s.preventDefault()}
          @click=${t.click}
        >
          <div class="cover">
            ${i ? c`<img src=${i} alt="" loading="lazy" />` : h(qt[e.media_type])}
            <span class="play-badge">${h(mt)}</span>
          </div>
          <div class="tile-name">${e.name}</div>
          <div class="tile-sub">${pt(e, this.localize)}</div>
        </button>
        <button class="more" @click=${() => this._menuItem = e} aria-label="more">${h(Rt)}</button>
      </div>
    `;
  }
  _renderTrack(e) {
    const t = this._pressHandlers(e), i = dt(e);
    return c`
      <div class="track">
        <button
          class="track-main"
          @pointerdown=${t.down}
          @pointerup=${t.cancel}
          @pointerleave=${t.cancel}
          @pointercancel=${t.cancel}
          @contextmenu=${(s) => s.preventDefault()}
          @click=${t.click}
        >
          <div class="track-cover">${i ? c`<img src=${i} alt="" loading="lazy" />` : h(At)}</div>
          <div class="track-text">
            <div class="tile-name">${e.name}</div>
            <div class="tile-sub">${pt(e, this.localize)}</div>
          </div>
        </button>
        <button class="more" @click=${() => this._menuItem = e} aria-label="more">${h(Rt)}</button>
      </div>
    `;
  }
  _renderMenu(e) {
    const t = this.localize, i = ["artist", "album", "track", "playlist"].includes(e.media_type), s = (r, n, o, l = !1) => c`
      <button
        class="menu-opt"
        @click=${() => {
      this._menuItem = null, this._play(e, o, l);
    }}
      >
        ${h(r)} ${t(n)}
      </button>
    `, a = dt(e);
    return c`
      <div class="scrim" @click=${() => this._menuItem = null}>
        <div class="menu" @click=${(r) => r.stopPropagation()}>
          <div class="menu-head">
            <div class="track-cover">${a ? c`<img src=${a} alt="" />` : h(qt[e.media_type])}</div>
            <div class="track-text">
              <div class="tile-name">${e.name}</div>
              <div class="tile-sub">${pt(e, t)}</div>
            </div>
          </div>
          ${s(mt, "play_now", e.media_type === "track" ? "play" : "replace")}
          ${e.media_type !== "radio" ? s(ui, "play_next", "next") : d}
          ${e.media_type !== "radio" ? s(si, "add_to_queue", "add") : d}
          ${i ? s(oi, "start_radio", "replace", !0) : d}
        </div>
      </div>
    `;
  }
  _onInput(e) {
    this._query = e.target.value, clearTimeout(this._debounce), this._debounce = window.setTimeout(() => this._runSearch(), 450);
  }
  _onKey(e) {
    e.key === "Enter" ? (clearTimeout(this._debounce), this._runSearch(), this._input.blur()) : e.key === "Escape" && this._close();
  }
  _clear() {
    this._query = "", this._results = null, this._input.focus();
  }
  _setTab(e) {
    this._tab = e, this._query.trim().length >= 2 && this._runSearch();
  }
  async _runSearch() {
    const e = this._query.trim();
    if (e.length < 2 || !this.entryId) {
      this._results = null;
      return;
    }
    const t = ++this._seq;
    this._loading = !0;
    try {
      const i = this._tab === "all" ? Ei : [this._tab], s = await ze(this.hass, this.entryId, e, i, this._tab === "all" ? 12 : 50);
      t === this._seq && (this._results = s);
    } catch (i) {
      t === this._seq && this._error(i);
    } finally {
      t === this._seq && (this._loading = !1);
    }
  }
  async _loadFavorites() {
    const e = {}, t = (i) => gt.find((s) => s.type === i).key;
    await Promise.all(
      Li.map(async (i) => {
        try {
          e[t(i)] = await Oe(this.hass, this.entryId, i, {
            favorite: !0,
            limit: 40,
            order_by: "sort_name"
          });
        } catch {
          e[t(i)] = [];
        }
      })
    ), this._favorites = e;
  }
  async _play(e, t, i = !1) {
    try {
      await Ue(this.hass, this.entityId, e, t, i);
      const s = this.localize, a = t === "next" || t === "add" ? s("added_to_queue") : `${s("playing_on")} ${this.playerName}`;
      this.dispatchEvent(new CustomEvent("ma-toast", { detail: `${e.name} · ${a}`, bubbles: !0, composed: !0 })), t !== "next" && t !== "add" && this._close();
    } catch (s) {
      this._error(s);
    }
  }
  _close() {
    this._menuItem = null, this._input?.blur(), this.dispatchEvent(new CustomEvent("close", { bubbles: !0, composed: !0 }));
  }
  _error(e) {
    this.dispatchEvent(new CustomEvent("ma-error", { detail: e, bubbles: !0, composed: !0 }));
  }
};
f.styles = K`
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
    .track-cover img {
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
b([
  g({ attribute: !1 })
], f.prototype, "hass", 2);
b([
  g({ attribute: !1 })
], f.prototype, "localize", 2);
b([
  g()
], f.prototype, "entityId", 2);
b([
  g()
], f.prototype, "playerName", 2);
b([
  g()
], f.prototype, "entryId", 2);
b([
  g({ type: Boolean, reflect: !0 })
], f.prototype, "open", 2);
b([
  v()
], f.prototype, "_query", 2);
b([
  v()
], f.prototype, "_tab", 2);
b([
  v()
], f.prototype, "_results", 2);
b([
  v()
], f.prototype, "_favorites", 2);
b([
  v()
], f.prototype, "_loading", 2);
b([
  v()
], f.prototype, "_menuItem", 2);
b([
  v()
], f.prototype, "_vvHeight", 2);
b([
  Le("input")
], f.prototype, "_input", 2);
f = b([
  Y("ma-search-overlay")
], f);
function dt(e) {
  const t = e.image || e.album?.image;
  return t && /^https?:|^\//.test(t) ? t : void 0;
}
function pt(e, t) {
  const i = e.artists?.map((a) => a.name).join(", ");
  if (e.media_type === "track") return [i, e.album?.name].filter(Boolean).join(" · ");
  if (e.media_type === "album") return i ?? t("albums");
  const s = gt.find((a) => a.type === e.media_type)?.label;
  return s ? t(s) : "";
}
const Si = (e) => e.media_type === "track" ? "play" : "replace";
var Hi = Object.defineProperty, Ii = Object.getOwnPropertyDescriptor, C = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ii(t, i) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (a = (s ? n(t, i, a) : n(a)) || a);
  return s && a && Hi(t, i, a), a;
};
const Pi = "0.1.0", se = "ma-player-card.active", ht = "120, 170, 255";
let x = class extends V {
  constructor() {
    super(...arguments), this._panel = "none", this._nextItem = null, this._entryId = "", this._accent = ht, this._toast = null, this._localize = Ut("sv"), this._players = [], this._queueKey = "", this._entryRequested = !1, this._accentFor = "", this._top = 0, this._measure = () => {
      cancelAnimationFrame(this._measureFrame), this._measureFrame = requestAnimationFrame(() => {
        const e = Math.max(0, Math.round(this.getBoundingClientRect().top + window.scrollY));
        e !== this._top && (this._top = e);
      });
    }, this._onError = (e) => this._showError(e.detail), this._onToast = (e) => this._showToast(e.detail, !1), this._closePanel = () => {
      this._panel = "none";
    };
  }
  static getStubConfig() {
    return { type: "custom:ma-player-card" };
  }
  setConfig(e) {
    if (!e) throw new Error("Invalid configuration");
    this._config = { hide_unavailable: !0, ...e }, this._localize = Ut(e.language ?? "sv");
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: "full", rows: "auto" };
  }
  willUpdate(e) {
    !this.hass || !this._config || ((e.has("hass") || e.has("_config")) && (this._players = Se(this.hass, this._config), (!this._activeId || !this.hass.states[this._activeId]) && (this._activeId = Pe(this._players, this.hass, Ti() ?? this._config.default_player))), this._activeId && (this._entryRequested || (this._entryRequested = !0, Te(this.hass, this._config.config_entry_id).then((t) => this._entryId = t).catch((t) => this._showError(t))), (e.has("hass") || e.has("_activeId")) && (this._refreshQueue(), this._refreshAccent())));
  }
  get _leaderId() {
    return this._activeId ? Yt(this.hass, this._activeId) : "";
  }
  get _groupIds() {
    const e = this._leaderId;
    return e ? [e, ...Ie(this.hass, e)] : [];
  }
  /** Fetch "next up" whenever the playing item on the leader changes. */
  _refreshQueue() {
    const e = this._leaderId, t = this.hass.states[e], i = `${e}|${t?.attributes.media_content_id}|${t?.attributes.media_title}|${t?.attributes.active_queue}`;
    if (i !== this._queueKey) {
      if (this._queueKey = i, !O(t)) {
        this._nextItem = null;
        return;
      }
      Ne(this.hass, e).then((s) => {
        this._queueKey === i && (this._nextItem = s?.next_item ?? null);
      }).catch(() => this._nextItem = null);
    }
  }
  _refreshAccent() {
    const e = this.hass.states[this._leaderId], t = O(e) ? rt(this.hass, e) : void 0;
    if (!t) {
      this._accentFor = "", this._accent = ht;
      return;
    }
    t !== this._accentFor && (this._accentFor = t, Be(t).then((i) => {
      this._accentFor === t && (this._accent = i ?? ht);
    }));
  }
  render() {
    if (!this.hass || !this._config) return d;
    const e = this._localize, t = this._activeId;
    if (!t)
      return c`<div class="empty">No Music Assistant players found.</div>`;
    const i = this._leaderId, s = this.hass.states[i], a = this._groupIds, r = O(s) ? rt(this.hass, s) : void 0, n = this.hass.states[t]?.attributes.friendly_name ?? t, o = this._config.height ?? `calc(100dvh - ${this._top}px)`;
    return c`
      <div
        class="root"
        style="--ma-accent:${this._accent};--ma-footer-space:${this._config.footer_space ?? 0}px;height:${o}"
      >
        <div class="bg">
          ${r ? c`<div class="bg-img" style="background-image:url('${r}')"></div>` : d}
          <div class="bg-tint"></div>
        </div>

        <div class="topbar">
          <button class="search-btn" @click=${() => this._panel = "search"}>
            ${h(wt)} <span>${e("search")}</span>
          </button>
          <button class="player-btn" @click=${() => this._panel = "speakers"}>
            ${h(nt)}
            <span class="player-name">${n}</span>
            ${a.length > 1 ? c`<span class="count">+${a.length - 1}</span>` : d}
            ${h(ti)}
          </button>
        </div>

        <ma-now-playing
          class="main"
          .hass=${this.hass}
          .localize=${e}
          .entityId=${i}
          .volumeIds=${a}
          .nextItem=${this._nextItem}
          @open-search=${() => this._panel = "search"}
          @open-speakers=${() => this._panel = "speakers"}
        ></ma-now-playing>

        <div class="scrim ${this._panel === "speakers" ? "show" : ""}" @click=${this._closePanel}></div>
        <aside class="drawer ${this._panel === "speakers" ? "open" : ""}">
          ${this._panel === "speakers" ? c`
                <ma-speaker-panel
                  .hass=${this.hass}
                  .localize=${e}
                  .players=${this._players}
                  .activeId=${t}
                  .leaderId=${i}
                  .groupIds=${a}
                  @select-player=${(l) => this._select(l.detail)}
                  @close=${this._closePanel}
                ></ma-speaker-panel>
              ` : d}
        </aside>

        <ma-search-overlay
          .hass=${this.hass}
          .localize=${e}
          .entityId=${i}
          .playerName=${n}
          .entryId=${this._entryId}
          ?open=${this._panel === "search"}
          @close=${this._closePanel}
        ></ma-search-overlay>

        ${this._toast ? c`<div class="toast ${this._toast.error ? "error" : ""}">${this._toast.text}</div>` : d}
      </div>
    `;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("resize", this._measure), this._measure(), setTimeout(this._measure, 500), setTimeout(this._measure, 2e3), this.addEventListener("ma-error", this._onError), this.addEventListener("ma-toast", this._onToast);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("resize", this._measure), this.removeEventListener("ma-error", this._onError), this.removeEventListener("ma-toast", this._onToast);
  }
  _showError(e) {
    const t = e?.message ?? (typeof e == "string" ? e : this._localize("error"));
    this._showToast(t, !0), console.warn("[ma-player-card]", e);
  }
  _showToast(e, t) {
    this._toast = { text: e, error: t }, clearTimeout(this._toastTimer), this._toastTimer = window.setTimeout(() => this._toast = null, t ? 6e3 : 3e3);
  }
  _select(e) {
    this._activeId = e;
    try {
      localStorage.setItem(se, e);
    } catch {
    }
  }
};
x.styles = K`
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
    .player-btn:active {
      background: rgba(255, 255, 255, 0.22);
    }
    .search-btn {
      flex: 1;
      max-width: 560px;
      padding: 0 26px;
      color: var(--ma-text-dim);
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
      transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .drawer.open {
      transform: none;
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
C([
  g({ attribute: !1 })
], x.prototype, "hass", 2);
C([
  v()
], x.prototype, "_config", 2);
C([
  v()
], x.prototype, "_activeId", 2);
C([
  v()
], x.prototype, "_panel", 2);
C([
  v()
], x.prototype, "_nextItem", 2);
C([
  v()
], x.prototype, "_entryId", 2);
C([
  v()
], x.prototype, "_accent", 2);
C([
  v()
], x.prototype, "_toast", 2);
C([
  v()
], x.prototype, "_top", 2);
x = C([
  Y("ma-player-card")
], x);
function Ti() {
  try {
    return localStorage.getItem(se) ?? void 0;
  } catch {
    return;
  }
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ma-player-card",
  name: "MA Player Card",
  description: "Fullscreen Music Assistant player for kiosk dashboards"
});
console.info(`%c MA-PLAYER-CARD %c ${Pi} `, "background:#78aaff;color:#111;font-weight:700", "");
export {
  x as MaPlayerCard
};
