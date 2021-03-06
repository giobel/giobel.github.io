/*!
 * Photo Sphere Viewer 3.2.3
 * Copyright (c) 2014-2015 Jérémy Heleine
 * Copyright (c) 2015-2017 Damien "Mistic" Sorel
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
! function(a, b) {
    "function" == typeof define && define.amd ? define(["three", "D.js", "uevent", "doT"], b) : "object" == typeof module && module.exports ? module.exports = b(require("three"), require("d.js"), require("uevent"), require("dot")) : a.PhotoSphereViewer = b(a.THREE, a.D, a.uEvent, a.doT)
}(this, function(a, b, c, d) {
    "use strict";

    function e(b) {
        if (!(this instanceof e)) return new e(b);
        if (e.SYSTEM.loaded || e._loadSystem(), this.config = x.clone(e.DEFAULTS), x.deepmerge(this.config, b), !b.container) throw new v("No value given for container.");
        if (!e.SYSTEM.isCanvasSupported) throw new v("Canvas is not supported.");
        if (!(e.SYSTEM.isWebGLSupported && this.config.webgl || x.checkTHREE("CanvasRenderer", "Projector"))) throw new v("Missing Three.js components: CanvasRenderer, Projector. Get them from three.js-examples package.");
        if (this.config.longitude_range && 2 !== this.config.longitude_range.length && (this.config.longitude_range = null, console.warn("PhotoSphereViewer: longitude_range must have exactly two elements.")), this.config.latitude_range ? 2 !== this.config.latitude_range.length ? (this.config.latitude_range = null, console.warn("PhotoSphereViewer: latitude_range must have exactly two elements.")) : this.config.latitude_range[0] > this.config.latitude_range[1] && (this.config.latitude_range = [this.config.latitude_range[1], this.config.latitude_range[0]], console.warn("PhotoSphereViewer: latitude_range values must be ordered.")) : void 0 === this.config.tilt_up_max && void 0 === this.config.tilt_down_max || (this.config.latitude_range = [void 0 !== this.config.tilt_down_max ? this.config.tilt_down_max - Math.PI / 4 : -x.HalfPI, void 0 !== this.config.tilt_up_max ? this.config.tilt_up_max + Math.PI / 4 : x.HalfPI], console.warn("PhotoSphereViewer: tilt_up_max and tilt_down_max are deprecated, use latitude_range instead.")), this.config.max_fov < this.config.min_fov) {
            var c = this.config.max_fov;
            this.config.max_fov = this.config.min_fov, this.config.min_fov = c, console.warn("PhotoSphereViewer: max_fov cannot be lower than min_fov.")
        }
        this.config.cache_texture && (!x.isInteger(this.config.cache_texture) || this.config.cache_texture < 0) && (this.config.cache_texture = e.DEFAULTS.cache_texture, console.warn("PhotoSphreViewer: invalid valud for cache_texture")), this.config.min_fov = x.bound(this.config.min_fov, 1, 179), this.config.max_fov = x.bound(this.config.max_fov, 1, 179), null === this.config.default_fov ? this.config.default_fov = this.config.max_fov / 2 + this.config.min_fov / 2 : this.config.default_fov = x.bound(this.config.default_fov, this.config.min_fov, this.config.max_fov), this.config.default_long = x.parseAngle(this.config.default_long), this.config.default_lat = x.parseAngle(this.config.default_lat, -Math.PI), this.config.default_lat = x.bound(this.config.default_lat, -x.HalfPI, x.HalfPI), null === this.config.anim_lat ? this.config.anim_lat = this.config.default_lat : (this.config.anim_lat = x.parseAngle(this.config.anim_lat, -Math.PI), this.config.anim_lat = x.bound(this.config.anim_lat, -x.HalfPI, x.HalfPI)), this.config.longitude_range && (this.config.longitude_range = this.config.longitude_range.map(function(a) {
            return x.parseAngle(a)
        })), this.config.latitude_range && (this.config.latitude_range = this.config.latitude_range.map(function(a) {
            return a = x.parseAngle(a, -Math.PI), x.bound(a, -x.HalfPI, x.HalfPI)
        })), this.config.anim_speed = x.parseSpeed(this.config.anim_speed), this.config.caption && !this.config.navbar && (this.config.navbar = ["caption"]), this.config.fisheye === !0 ? this.config.fisheye = 1 : this.config.fisheye === !1 && (this.config.fisheye = 0), this.parent = "string" == typeof b.container ? document.getElementById(b.container) : b.container, this.container = null, this.loader = null, this.navbar = null, this.hud = null, this.panel = null, this.tooltip = null, this.canvas_container = null, this.renderer = null, this.scene = null, this.camera = null, this.mesh = null, this.raycaster = null, this.doControls = null, this.prop = {
            isCubemap: void 0,
            longitude: 0,
            latitude: 0,
            direction: null,
            anim_speed: 0,
            zoom_lvl: 0,
            vFov: 0,
            hFov: 0,
            aspect: 0,
            move_speed: .1,
            moving: !1,
            zooming: !1,
            start_mouse_x: 0,
            start_mouse_y: 0,
            mouse_x: 0,
            mouse_y: 0,
            mouse_history: [],
            pinch_dist: 0,
            orientation_reqid: null,
            autorotate_reqid: null,
            animation_promise: null,
            loading_promise: null,
            start_timeout: null,
            dblclick_data: null,
            dblclick_timeout: null,
            cache: [],
            size: {
                width: 0,
                height: 0
            },
            pano_data: {
                full_width: 0,
                full_height: 0,
                cropped_width: 0,
                cropped_height: 0,
                cropped_x: 0,
                cropped_y: 0
            }
        }, Object.keys(e.TEMPLATES).forEach(function(a) {
            this.config.templates[a] || (this.config.templates[a] = e.TEMPLATES[a]), "string" == typeof this.config.templates[a] && (this.config.templates[a] = d.template(this.config.templates[a]))
        }, this), this.parent.photoSphereViewer = this, this.container = document.createElement("div"), this.container.classList.add("psv-container"), this.parent.appendChild(this.container), null !== this.config.size && this._setViewerSize(this.config.size), this._onResize();
        var f = Math.round((this.config.default_fov - this.config.min_fov) / (this.config.max_fov - this.config.min_fov) * 100);
        this.zoom(f - 2 * (f - 50), !1), this.prop.move_speed = a.Math.degToRad(this.config.move_speed / e.SYSTEM.pixelRatio), this.rotate({
            longitude: this.config.default_long,
            latitude: this.config.default_lat
        }, !1), this.loader = new h(this), this.loader.hide(), this.navbar = new i(this), this.navbar.hide(), this.hud = new g(this), this.hud.hide(), this.panel = new l(this), this.tooltip = new m(this.hud), this._bindEvents(), this.config.autoload && this.load(), this.once("render", function() {
            this.config.navbar && (this.container.classList.add("psv-container--has-navbar"), this.navbar.show()), this.hud.show(), this.config.markers && (this.config.markers.forEach(function(a) {
                this.hud.addMarker(a, !1)
            }, this), this.hud.renderMarkers()), this.config.time_anim !== !1 && (this.prop.start_timeout = window.setTimeout(this.startAutorotate.bind(this), this.config.time_anim)), this.trigger("ready")
        }.bind(this))
    }

    function f(a) {
        this.psv = a instanceof e ? a : a.psv, this.parent = a, this.container = null, this.constructor.publicMethods && this.constructor.publicMethods.forEach(function(a) {
            this.psv[a] = this[a].bind(this)
        }, this)
    }

    function g(a) {
        f.call(this, a), this.svgContainer = null, this.markers = {}, this.currentMarker = null, this.hoveringMarker = null, this.prop = {
            panelOpened: !1,
            panelOpening: !1,
            markersButton: this.psv.navbar.getNavbarButton("markers")
        }, this.create()
    }

    function h(a) {
        f.call(this, a), this.canvas = null, this.loader = null, this.create()
    }

    function i(a) {
        if (f.call(this, a), this.config = this.psv.config.navbar, this.items = [], this.config === !0) this.config = x.clone(e.DEFAULTS.navbar);
        else if ("string" == typeof this.config) this.config = this.config.split(" ");
        else if (!Array.isArray(this.config)) {
            console.warn('PhotoSphereViewer: hashmap form of "navbar" is deprecated, use an array instead.');
            var b = this.config;
            this.config = [];
            for (var c in b) b[c] && this.config.push(c);
            this.config.sort(function(a, b) {
                return e.DEFAULTS.navbar.indexOf(a) - e.DEFAULTS.navbar.indexOf(b)
            })
        }
        this.create()
    }

    function j(a, b) {
        f.call(this, a), this.create(), this.setCaption(b)
    }

    function k(a, b) {
        f.call(this, a), this.weight = b || 5, this.create(), this.container.classList.add("psv-spacer--weight-" + this.weight)
    }

    function l(a) {
        f.call(this, a), this.content = null, this.prop = {
            mouse_x: 0,
            mouse_y: 0,
            mousedown: !1,
            opened: !1
        }, this.create()
    }

    function m(a) {
        f.call(this, a), this.config = this.psv.config.tooltip, this.prop = {
            timeout: null
        }, this.create()
    }

    function n(a) {
        f.call(this, a), this.id = void 0, this.constructor.id && (this.id = this.constructor.id), this.enabled = !0
    }

    function o(a) {
        n.call(this, a), this.create()
    }

    function p(a, b) {
        n.call(this, a), this.config = b, this.config.id && (this.id = this.config.id), this.create()
    }

    function q(a) {
        n.call(this, a), this.create()
    }

    function r(a) {
        n.call(this, a), this.create()
    }

    function s(a) {
        n.call(this, a), this.create()
    }

    function t(a) {
        n.call(this, a), this.create()
    }

    function u(a) {
        n.call(this, a), this.zoom_range = null, this.zoom_value = null, this.prop = {
            mousedown: !1,
            buttondown: !1,
            longPressInterval: null
        }, this.create()
    }

    function v(a) {
        this.message = a, "captureStackTrace" in Error ? Error.captureStackTrace(this, v) : this.stack = (new Error).stack
    }

    function w(a, b) {
        if (!a.id) throw new v("missing marker id");
        if (a.image && (!a.width || !a.height)) throw new v("missing marker width/height");
        if ((a.image || a.html) && !(a.hasOwnProperty("x") && a.hasOwnProperty("y") || a.hasOwnProperty("latitude") && a.hasOwnProperty("longitude"))) throw new v("missing marker position, latitude/longitude or x/y");
        this.psv = b, this.visible = !0, this._dynamicSize = !1;
        var c, d = a.id,
            e = w.getType(a, !1);
        Object.defineProperties(this, {
            id: {
                configurable: !1,
                enumerable: !0,
                get: function() {
                    return d
                },
                set: function(a) {}
            },
            type: {
                configurable: !1,
                enumerable: !0,
                get: function() {
                    return e
                },
                set: function(a) {}
            },
            $el: {
                configurable: !1,
                enumerable: !0,
                get: function() {
                    return c
                },
                set: function(a) {}
            },
            _def: {
                configurable: !1,
                enumerable: !0,
                get: function() {
                    return this[e]
                },
                set: function(a) {
                    this[e] = a
                }
            }
        }), c = this.isNormal() ? document.createElement("div") : this.isPolygon() ? document.createElementNS(x.svgNS, "polygon") : document.createElementNS(x.svgNS, this.type), c.id = "psv-marker-" + this.id, c.psvMarker = this, this.update(a)
    }
    c.mixin(e), e.prototype._loadXMP = function(a) {
        if (!this.config.usexmpdata) return b.resolved(null);
        var c = b(),
            d = new XMLHttpRequest,
            e = this,
            f = 0;
        return d.onreadystatechange = function() {
            if (4 === d.readyState) {
                if (200 !== d.status && 201 !== d.status && 202 !== d.status && 0 !== d.status) throw e.container.textContent = "Cannot load image", new v("Cannot load image");
                e.loader.setProgress(100);
                var a = d.responseText,
                    b = a.indexOf("<x:xmpmeta"),
                    g = a.indexOf("</x:xmpmeta>"),
                    h = a.substring(b, g);
                if (b === -1 || g === -1 || h.indexOf("GPano:") === -1) c.resolve(null);
                else {
                    var i = {
                        full_width: parseInt(x.getXMPValue(h, "FullPanoWidthPixels")),
                        full_height: parseInt(x.getXMPValue(h, "FullPanoHeightPixels")),
                        cropped_width: parseInt(x.getXMPValue(h, "CroppedAreaImageWidthPixels")),
                        cropped_height: parseInt(x.getXMPValue(h, "CroppedAreaImageHeightPixels")),
                        cropped_x: parseInt(x.getXMPValue(h, "CroppedAreaLeftPixels")),
                        cropped_y: parseInt(x.getXMPValue(h, "CroppedAreaTopPixels"))
                    };
                    i.full_width && i.full_height && i.cropped_width && i.cropped_height ? c.resolve(i) : (console.warn("PhotoSphereViewer: invalid XMP data"), c.resolve(null))
                }
            } else 3 === d.readyState && e.loader.setProgress(f += 10)
        }, d.onprogress = function(a) {
            if (a.lengthComputable) {
                var b = parseInt(a.loaded / a.total * 100);
                b > f && (f = b, e.loader.setProgress(f))
            }
        }, d.onerror = function() {
            throw e.container.textContent = "Cannot load image", new v("Cannot load image")
        }, d.open("GET", a, !0), d.send(null), c.promise
    }, e.prototype._loadTexture = function(a) {
        var b = [];
        if (Array.isArray(a)) {
            if (6 !== a.length) throw new v("Must provide exactly 6 image paths when using cubemap.");
            for (var c = 0; c < 6; c++) b[c] = a[e.CUBE_MAP[c]];
            a = b
        } else if ("object" == typeof a) {
            if (!e.CUBE_HASHMAP.every(function(b) {
                    return !!a[b]
                })) throw new v("Must provide exactly left, front, right, back, top, bottom when using cubemap.");
            e.CUBE_HASHMAP.forEach(function(c, d) {
                b[d] = a[c]
            }), a = b
        }
        if (Array.isArray(a)) {
            if (this.prop.isCubemap === !1) throw new v("The viewer was initialized with an equirectangular panorama, cannot switch to cubemap.");
            return this.config.fisheye && console.warn("PhotoSphereViewer: fisheye effect with cubemap texture can generate distorsions."), this.config.cache_texture === e.DEFAULTS.cache_texture && (this.config.cache_texture *= 6), this.prop.isCubemap = !0, this._loadCubemapTexture(a)
        }
        if (this.prop.isCubemap === !0) throw new v("The viewer was initialized with an cubemap, cannot switch to equirectangular panorama.");
        return this.prop.isCubemap = !1, this._loadEquirectangularTexture(a)
    }, e.prototype._loadEquirectangularTexture = function(c) {
        if (this.config.cache_texture) {
            var d = this.getPanoramaCache(c);
            if (d) return this.prop.pano_data = d.pano_data, b.resolved(d.image)
        }
        return this._loadXMP(c).then(function(d) {
            var f = b(),
                g = new a.ImageLoader,
                h = d ? 100 : 0;
            g.setCrossOrigin("anonymous");
            var i = function(b) {
                    h = 100, this.loader.setProgress(h), this.trigger("panorama-load-progress", c, h), !d && this.config.pano_data && (d = x.clone(this.config.pano_data)), d || (d = {
                        full_width: b.width,
                        full_height: b.height,
                        cropped_width: b.width,
                        cropped_height: b.height,
                        cropped_x: 0,
                        cropped_y: 0
                    }), this.prop.pano_data = d;
                    var g, i = Math.min(d.full_width, e.SYSTEM.maxTextureWidth) / d.full_width;
                    if (1 !== i || d.cropped_width != d.full_width || d.cropped_height != d.full_height) {
                        var j = x.clone(d);
                        j.full_width *= i, j.full_height *= i, j.cropped_width *= i, j.cropped_height *= i, j.cropped_x *= i, j.cropped_y *= i, b.width = j.cropped_width, b.height = j.cropped_height;
                        var k = document.createElement("canvas");
                        k.width = j.full_width, k.height = j.full_height;
                        var l = k.getContext("2d");
                        l.drawImage(b, j.cropped_x, j.cropped_y, j.cropped_width, j.cropped_height), g = new a.Texture(k)
                    } else g = new a.Texture(b);
                    g.needsUpdate = !0, g.minFilter = a.LinearFilter, g.generateMipmaps = !1, this.config.cache_texture && this._putPanoramaCache({
                        panorama: c,
                        image: g,
                        pano_data: d
                    }), f.resolve(g)
                },
                j = function(a) {
                    if (a.lengthComputable) {
                        var b = parseInt(a.loaded / a.total * 100);
                        b > h && (h = b, this.loader.setProgress(h), this.trigger("panorama-load-progress", c, h))
                    }
                },
                k = function(a) {
                    throw this.container.textContent = "Cannot load image", f.reject(a), new v("Cannot load image")
                };
            return g.load(c, i.bind(this), j.bind(this), k.bind(this)), f.promise
        }.bind(this))
    }, e.prototype._loadCubemapTexture = function(c) {
        var d = b(),
            f = new a.ImageLoader,
            g = [0, 0, 0, 0, 0, 0],
            h = [],
            i = 0;
        f.setCrossOrigin("anonymous");
        for (var j = function() {
                h.forEach(function(b) {
                    b.needsUpdate = !0, b.minFilter = a.LinearFilter, b.generateMipmaps = !1
                }), d.resolve(h)
            }, k = function(b, d) {
                i++, g[b] = 100, this.loader.setProgress(x.sum(g) / 6), this.trigger("panorama-load-progress", c[b], g[b]);
                var f = Math.min(d.width, e.SYSTEM.maxTextureWidth / 2) / d.width;
                if (1 !== f) {
                    var k = document.createElement("canvas");
                    k.width = d.width * f, k.height = d.height * f;
                    var l = k.getContext("2d");
                    l.drawImage(d, 0, 0, k.width, k.height), h[b] = new a.Texture(k)
                } else h[b] = new a.Texture(d);
                this.config.cache_texture && this._putPanoramaCache({
                    panorama: c[b],
                    image: h[b]
                }), 6 === i && j()
            }, l = function(a, b) {
                if (b.lengthComputable) {
                    var d = parseInt(b.loaded / b.total * 100);
                    d > g[a] && (g[a] = d, this.loader.setProgress(x.sum(g) / 6), this.trigger("panorama-load-progress", c[a], g[a]))
                }
            }, m = function(a, b) {
                throw this.container.textContent = "Cannot load image", d.reject(b), new v("Cannot load image " + a)
            }, n = 0; n < 6; n++) {
            if (this.config.cache_texture) {
                var o = this.getPanoramaCache(c[n]);
                if (o) {
                    i++, g[n] = 100, h[n] = o.image;
                    continue
                }
            }
            f.load(c[n], k.bind(this, n), l.bind(this, n), m.bind(this, n))
        }
        return 6 === i && d.resolve(h), d.promise
    }, e.prototype._setTexture = function(a) {
        if (this.scene || this._createScene(), this.prop.isCubemap)
            for (var b = 0; b < 6; b++) this.mesh.material.materials[b].map && this.mesh.material.materials[b].map.dispose(), this.mesh.material.materials[b].map = a[b];
        else this.mesh.material.map && this.mesh.material.map.dispose(), this.mesh.material.map = a;
        this.trigger("panorama-loaded"), this.render()
    }, e.prototype._createScene = function() {
        this.raycaster = new a.Raycaster, this.renderer = e.SYSTEM.isWebGLSupported && this.config.webgl ? new a.WebGLRenderer : new a.CanvasRenderer, this.renderer.setSize(this.prop.size.width, this.prop.size.height), this.renderer.setPixelRatio(e.SYSTEM.pixelRatio);
        var b = e.SPHERE_RADIUS;
        this.prop.isCubemap && (b *= Math.sqrt(3)), this.config.fisheye && (b += e.SPHERE_RADIUS), this.camera = new a.PerspectiveCamera(this.config.default_fov, this.prop.size.width / this.prop.size.height, 1, b), this.camera.position.set(0, 0, 0), this.config.gyroscope && x.checkTHREE("DeviceOrientationControls") && (this.doControls = new a.DeviceOrientationControls(this.camera)), this.scene = new a.Scene, this.scene.add(this.camera), this.prop.isCubemap ? this._createCubemap() : this._createSphere(), this.canvas_container = document.createElement("div"), this.canvas_container.className = "psv-canvas-container", this.renderer.domElement.className = "psv-canvas", this.container.appendChild(this.canvas_container), this.canvas_container.appendChild(this.renderer.domElement)
    }, e.prototype._createSphere = function() {
        var b = new a.SphereGeometry(e.SPHERE_RADIUS, e.SPHERE_VERTICES, e.SPHERE_VERTICES, (-x.HalfPI)),
            c = new a.MeshBasicMaterial({
                side: a.DoubleSide,
                overdraw: e.SYSTEM.isWebGLSupported && this.config.webgl ? 0 : 1
            });
        this.mesh = new a.Mesh(b, c), this.mesh.scale.x = -1, this.scene.add(this.mesh)
    }, e.prototype._createCubemap = function() {
        for (var b = new a.BoxGeometry(2 * e.SPHERE_RADIUS, 2 * e.SPHERE_RADIUS, 2 * e.SPHERE_RADIUS, e.CUBE_VERTICES, e.CUBE_VERTICES, e.CUBE_VERTICES), c = [], d = 0; d < 6; d++) c.push(new a.MeshBasicMaterial({
            overdraw: e.SYSTEM.isWebGLSupported && this.config.webgl ? 0 : 1
        }));
        this.mesh = new a.Mesh(b, new a.MultiMaterial(c)), this.mesh.position.x -= e.SPHERE_RADIUS, this.mesh.position.y -= e.SPHERE_RADIUS, this.mesh.position.z -= e.SPHERE_RADIUS, this.mesh.applyMatrix((new a.Matrix4).makeScale(1, 1, -1)), this.scene.add(this.mesh);
        var f = new a.MeshBasicMaterial({
                side: a.BackSide,
                visible: !1
            }),
            g = new a.Mesh(b, f);
        this.scene.add(g)
    }, e.prototype._transition = function(b, c) {
        if (this.prop.isCubemap) throw new v("Transition is not available with cubemap.");
        var d = this,
            f = new a.SphereGeometry(.9 * e.SPHERE_RADIUS, e.SPHERE_VERTICES, e.SPHERE_VERTICES, (-x.HalfPI)),
            g = new a.MeshBasicMaterial({
                side: a.DoubleSide,
                overdraw: e.SYSTEM.isWebGLSupported && this.config.webgl ? 0 : 1,
                map: b,
                transparent: !0,
                opacity: 0
            }),
            h = new a.Mesh(f, g);
        if (h.scale.x = -1, c) {
            h.rotateY(c.longitude - this.prop.longitude);
            var i = new a.Vector3(0, 1, 0).cross(this.camera.getWorldDirection()).normalize(),
                j = (new a.Quaternion).setFromAxisAngle(i, c.latitude - this.prop.latitude);
            h.quaternion.multiplyQuaternions(j, h.quaternion)
        }
        return this.scene.add(h), this.render(), x.animation({
            properties: {
                opacity: {
                    start: 0,
                    end: 1
                }
            },
            duration: d.config.transition.duration,
            easing: "outCubic",
            onTick: function(a) {
                g.opacity = a.opacity, d.render()
            }
        }).then(function() {
            d.mesh.material.map.dispose(), d.mesh.material.map = b, d.scene.remove(h), h.geometry.dispose(), h.geometry = null, h.material.dispose(), h.material = null, c ? ((d.config.latitude_range || d.config.longitude_range) && (d.config.longitude_range = d.config.latitude_range = null, console.warn("PhotoSphereViewer: trying to perform transition with longitude_range and/or latitude_range, ranges cleared.")), d.rotate(c)) : d.render()
        })
    }, e.prototype._reverseAutorotate = function() {
        var a = this,
            b = -this.config.anim_speed,
            c = this.config.longitude_range;
        this.config.longitude_range = null, x.animation({
            properties: {
                speed: {
                    start: this.config.anim_speed,
                    end: 0
                }
            },
            duration: 300,
            easing: "inSine",
            onTick: function(b) {
                a.config.anim_speed = b.speed
            }
        }).then(function() {
            return x.animation({
                properties: {
                    speed: {
                        start: 0,
                        end: b
                    }
                },
                duration: 300,
                easing: "outSine",
                onTick: function(b) {
                    a.config.anim_speed = b.speed
                }
            })
        }).then(function() {
            a.config.longitude_range = c, a.config.anim_speed = b
        })
    }, e.prototype._putPanoramaCache = function(a) {
        if (!this.config.cache_texture) throw new v("Cannot add panorama to cache, cache_texture is disabled");
        var b = this.getPanoramaCache(a.panorama);
        b ? (b.image = a.image, b.pano_data = a.pano_data) : (this.prop.cache = this.prop.cache.slice(0, this.config.cache_texture - 1), this.prop.cache.unshift(a)), this.trigger("panorama-cached", a.panorama)
    }, e.prototype._stopAll = function() {
        this.stopAutorotate(), this.stopAnimation(), this.stopGyroscopeControl()
    }, e.MOVE_THRESHOLD = 4, e.DBLCLICK_DELAY = 300, e.INERTIA_WINDOW = 300, e.SPHERE_RADIUS = 100, e.SPHERE_VERTICES = 64, e.CUBE_VERTICES = 8, e.CUBE_MAP = [0, 2, 4, 5, 3, 1], e.CUBE_HASHMAP = ["left", "right", "top", "bottom", "back", "front"], e.KEYMAP = {
        33: "PageUp",
        34: "PageDown",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        107: "+",
        109: "-"
    }, e.SYSTEM = {
        loaded: !1,
        pixelRatio: 1,
        isWebGLSupported: !1,
        isCanvasSupported: !1,
        deviceOrientationSupported: null,
        maxTextureWidth: 0,
        mouseWheelEvent: null,
        fullscreenEvent: null
    }, e.ICONS = {}, e.DEFAULTS = {
        panorama: null,
        container: null,
        caption: null,
        autoload: !0,
        usexmpdata: !0,
        pano_data: null,
        webgl: !0,
        min_fov: 30,
        max_fov: 90,
        default_fov: null,
        default_long: 0,
        default_lat: 0,
        longitude_range: null,
        latitude_range: null,
        move_speed: 1,
        time_anim: false,
        anim_speed: "2rpm",
        anim_lat: null,
        fisheye: !1,
        navbar: ["autorotate", "zoom", "download", "markers", "caption", "gyroscope", "fullscreen"],
        tooltip: {
            offset: 5,
            arrow_size: 7,
            delay: 100
        },
        lang: {
            autorotate: "Automatic rotation",
            zoom: "Zoom",
            zoomOut: "Zoom out",
            zoomIn: "Zoom in",
            download: "Download",
            fullscreen: "Fullscreen",
            markers: "Markers",
            gyroscope: "Gyroscope"
        },
        mousewheel: !0,
        mousemove: !0,
        keyboard: !0,
        gyroscope: !1,
        move_inertia: !0,
        click_event_on_marker: !1,
        transition: {
            duration: 1500,
            loader: !0
        },
        loading_img: null,
        loading_txt: "Loading...",
        size: null,
        cache_texture: 5,
        templates: {},
        markers: []
    }, e.TEMPLATES = {
        markersList: '<div class="psv-markers-list-container">   <h1 class="psv-markers-list-title">{{= it.config.lang.markers }}</h1>   <ul class="psv-markers-list">   {{~ it.markers: marker }}     <li data-psv-marker="{{= marker.id }}" class="psv-markers-list-item {{? marker.className }}{{= marker.className }}{{?}}">       {{? marker.image }}<img class="psv-markers-list-image" src="{{= marker.image }}"/>{{?}}       <p class="psv-markers-list-name">{{? marker.tooltip }}{{= marker.tooltip.content }}{{?? marker.html }}{{= marker.html }}{{??}}{{= marker.id }}{{?}}</p>     </li>   {{~}}   </ul> </div>'
    }, e.prototype._bindEvents = function() {
        window.addEventListener("resize", this), this.config.mousemove && (this.hud.container.style.cursor = "move", this.hud.container.addEventListener("mousedown", this), this.hud.container.addEventListener("touchstart", this), window.addEventListener("mouseup", this), window.addEventListener("touchend", this), this.hud.container.addEventListener("mousemove", this), this.hud.container.addEventListener("touchmove", this)), e.SYSTEM.fullscreenEvent && document.addEventListener(e.SYSTEM.fullscreenEvent, this), this.config.mousewheel && this.hud.container.addEventListener(e.SYSTEM.mouseWheelEvent, this), this.on("_side-reached", function(a) {
            this.isAutorotateEnabled() && ("left" !== a && "right" !== a || this._reverseAutorotate())
        })
    }, e.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "resize":
                x.throttle(this._onResize(), 50);
                break;
            case "keydown":
                this._onKeyDown(a);
                break;
            case "mousedown":
                this._onMouseDown(a);
                break;
            case "touchstart":
                this._onTouchStart(a);
                break;
            case "mouseup":
                this._onMouseUp(a);
                break;
            case "touchend":
                this._onTouchEnd(a);
                break;
            case "mousemove":
                this._onMouseMove(a);
                break;
            case "touchmove":
                this._onTouchMove(a);
                break;
            case e.SYSTEM.fullscreenEvent:
                this._fullscreenToggled();
                break;
            case e.SYSTEM.mouseWheelEvent:
                this._onMouseWheel(a)
        }
    }, e.prototype._onResize = function() {
        this.container.clientWidth == this.prop.size.width && this.container.clientHeight == this.prop.size.height || (this.prop.size.width = parseInt(this.container.clientWidth), this.prop.size.height = parseInt(this.container.clientHeight), this.prop.aspect = this.prop.size.width / this.prop.size.height, this.renderer && (this.renderer.setSize(this.prop.size.width, this.prop.size.height), this.composer && this.composer.reset(new a.WebGLRenderTarget(this.prop.size.width, this.prop.size.height)), this.render()), this.trigger("size-updated", this.getSize()))
    }, e.prototype._onKeyDown = function(a) {
        var b = 0,
            c = 0,
            d = 0,
            f = a.key || e.KEYMAP[a.keyCode || a.which];
        switch (f) {
            case "ArrowUp":
                c = .01;
                break;
            case "ArrowDown":
                c = -.01;
                break;
            case "ArrowRight":
                b = .01;
                break;
            case "ArrowLeft":
                b = -.01;
                break;
            case "PageUp":
            case "+":
                d = 1;
                break;
            case "PageDown":
            case "-":
                d = -1
        }
        0 !== d ? this.zoom(this.prop.zoom_lvl + d) : 0 === c && 0 === b || this.rotate({
            longitude: this.prop.longitude + b * this.prop.move_speed * this.prop.hFov,
            latitude: this.prop.latitude + c * this.prop.move_speed * this.prop.vFov
        })
    }, e.prototype._onMouseDown = function(a) {
        this._startMove(a)
    }, e.prototype._onMouseUp = function(a) {
        this._stopMove(a)
    }, e.prototype._onMouseMove = function(a) {
        0 !== a.buttons && (a.preventDefault(), this._move(a))
    }, e.prototype._onTouchStart = function(a) {
        1 === a.touches.length ? this._startMove(a.touches[0]) : 2 === a.touches.length && this._startZoom(a)
    }, e.prototype._onTouchEnd = function(a) {
        this._stopMove(a.changedTouches[0])
    }, e.prototype._onTouchMove = function(a) {
        1 === a.touches.length ? (a.preventDefault(), this._move(a.touches[0])) : 2 === a.touches.length && (a.preventDefault(), this._zoom(a))
    }, e.prototype._startMove = function(a) {
        this.isGyroscopeEnabled() || (this._stopAll(), this.prop.mouse_x = this.prop.start_mouse_x = parseInt(a.clientX), this.prop.mouse_y = this.prop.start_mouse_y = parseInt(a.clientY), this.prop.moving = !0, this.prop.zooming = !1, this.prop.mouse_history.length = 0, this._logMouseMove(a))
    }, e.prototype._startZoom = function(a) {
        var b = [{
            x: parseInt(a.touches[0].clientX),
            y: parseInt(a.touches[0].clientY)
        }, {
            x: parseInt(a.touches[1].clientX),
            y: parseInt(a.touches[1].clientY)
        }];
        this.prop.pinch_dist = Math.sqrt(Math.pow(b[0].x - b[1].x, 2) + Math.pow(b[0].y - b[1].y, 2)), this.prop.moving = !1, this.prop.zooming = !0
    }, e.prototype._stopMove = function(a) {
        return this.isGyroscopeEnabled() ? void this._click(a) : (this.prop.moving && (Math.abs(a.clientX - this.prop.start_mouse_x) < e.MOVE_THRESHOLD && Math.abs(a.clientY - this.prop.start_mouse_y) < e.MOVE_THRESHOLD ? (this._click(a), this.prop.moving = !1) : this.config.move_inertia ? (this._logMouseMove(a), this._stopMoveInertia(a)) : this.prop.moving = !1), this.prop.mouse_history.length = 0, void(this.prop.zooming = !1))
    }, e.prototype._stopMoveInertia = function(a) {
        var b = this,
            c = {
                x: a.clientX - this.prop.mouse_history[0][1],
                y: a.clientY - this.prop.mouse_history[0][2]
            },
            d = Math.sqrt(c.x * c.x + c.y * c.y);
        this.prop.animation_promise = x.animation({
            properties: {
                clientX: {
                    start: a.clientX,
                    end: a.clientX + c.x
                },
                clientY: {
                    start: a.clientY,
                    end: a.clientY + c.y
                }
            },
            duration: d * e.INERTIA_WINDOW / 100,
            easing: "outCirc",
            onTick: function(a) {
                b._move(a, !1)
            }
        }).ensure(function() {
            b.prop.moving = !1
        })
    }, e.prototype._click = function(a) {
        var b = this.container.getBoundingClientRect(),
            c = {
                target: a.target,
                client_x: a.clientX,
                client_y: a.clientY,
                viewer_x: parseInt(a.clientX - b.left),
                viewer_y: parseInt(a.clientY - b.top)
            },
            d = this.viewerCoordsToVector3({
                x: c.viewer_x,
                y: c.viewer_y
            });
        if (d) {
            var f = this.vector3ToSphericalCoords(d);
            if (c.longitude = f.longitude, c.latitude = f.latitude, !this.prop.isCubemap) {
                var g = this.sphericalCoordsToTextureCoords({
                    longitude: c.longitude,
                    latitude: c.latitude
                });
                c.texture_x = g.x, c.texture_y = g.y
            }
            this.prop.dblclick_timeout ? (Math.abs(this.prop.dblclick_data.client_x - c.client_x) < e.MOVE_THRESHOLD && Math.abs(this.prop.dblclick_data.client_y - c.client_y) < e.MOVE_THRESHOLD && this.trigger("dblclick", this.prop.dblclick_data), clearTimeout(this.prop.dblclick_timeout), this.prop.dblclick_timeout = null, this.prop.dblclick_data = null) : (this.trigger("click", c), this.prop.dblclick_data = x.clone(c), this.prop.dblclick_timeout = setTimeout(function() {
                this.prop.dblclick_timeout = null, this.prop.dblclick_data = null
            }.bind(this), e.DBLCLICK_DELAY))
        }
    }, e.prototype._move = function(a, b) {
        if (this.prop.moving) {
            var c = parseInt(a.clientX),
                d = parseInt(a.clientY);
            this.rotate({
                longitude: this.prop.longitude - (c - this.prop.mouse_x) / this.prop.size.width * this.prop.move_speed * this.prop.hFov,
                latitude: this.prop.latitude + (d - this.prop.mouse_y) / this.prop.size.height * this.prop.move_speed * this.prop.vFov
            }), this.prop.mouse_x = c, this.prop.mouse_y = d, b !== !1 && this._logMouseMove(a)
        }
    }, e.prototype._zoom = function(a) {
        if (this.prop.zooming) {
            var b = [{
                    x: parseInt(a.touches[0].clientX),
                    y: parseInt(a.touches[0].clientY)
                }, {
                    x: parseInt(a.touches[1].clientX),
                    y: parseInt(a.touches[1].clientY)
                }],
                c = Math.sqrt(Math.pow(b[0].x - b[1].x, 2) + Math.pow(b[0].y - b[1].y, 2)),
                d = 80 * (c - this.prop.pinch_dist) / this.prop.size.width;
            this.zoom(this.prop.zoom_lvl + d), this.prop.pinch_dist = c
        }
    }, e.prototype._onMouseWheel = function(a) {
        a.preventDefault(), a.stopPropagation();
        var b = void 0 !== a.deltaY ? -a.deltaY : void 0 !== a.wheelDelta ? a.wheelDelta : -a.detail;
        if (0 !== b) {
            var c = parseInt(b / Math.abs(b));
            this.zoom(this.prop.zoom_lvl + c)
        }
    }, e.prototype._fullscreenToggled = function() {
        var a = this.isFullscreenEnabled();
        this.config.keyboard && (a ? this.startKeyboardControl() : this.stopKeyboardControl()), this.trigger("fullscreen-updated", a)
    }, e.prototype._logMouseMove = function(a) {
        var b = Date.now();
        this.prop.mouse_history.push([b, a.clientX, a.clientY]);
        for (var c = null, d = 0; d < this.prop.mouse_history.length;) this.prop.mouse_history[0][d] < b - e.INERTIA_WINDOW ? this.prop.mouse_history.splice(d, 1) : c && this.prop.mouse_history[0][d] - c > e.INERTIA_WINDOW / 10 ? (this.prop.mouse_history.splice(0, d), d = 0, c = this.prop.mouse_history[0][d]) : (d++, c = this.prop.mouse_history[0][d])
    }, e.prototype.load = function() {
        if (!this.config.panorama) throw new v("No value given for panorama.");
        return this.setPanorama(this.config.panorama, !1)
    }, e.prototype.getPosition = function() {
        return {
            longitude: this.prop.longitude,
            latitude: this.prop.latitude
        }
    }, e.prototype.getZoomLevel = function() {
        return this.prop.zoom_lvl
    }, e.prototype.getSize = function() {
        return {
            width: this.prop.size.width,
            height: this.prop.size.height
        }
    }, e.prototype.isAutorotateEnabled = function() {
        return !!this.prop.autorotate_reqid
    }, e.prototype.isGyroscopeEnabled = function() {
        return !!this.prop.orientation_reqid
    }, e.prototype.isFullscreenEnabled = function() {
        return x.isFullscreenEnabled(this.container)
    }, e.prototype.render = function(a) {
        a !== !1 && (this.prop.direction = this.sphericalCoordsToVector3(this.prop), this.camera.position.set(0, 0, 0), this.camera.lookAt(this.prop.direction)), this.config.fisheye && this.camera.position.copy(this.prop.direction).multiplyScalar(this.config.fisheye / 2).negate(), this.camera.aspect = this.prop.aspect, this.camera.fov = this.prop.vFov, this.camera.updateProjectionMatrix(), this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera), this.trigger("render")
    }, e.prototype.destroy = function() {
        this._stopAll(), this.stopKeyboardControl(), this.isFullscreenEnabled() && x.exitFullscreen(), window.removeEventListener("resize", this), this.config.mousemove && (this.hud.container.removeEventListener("mousedown", this), this.hud.container.removeEventListener("touchstart", this), window.removeEventListener("mouseup", this), window.removeEventListener("touchend", this), this.hud.container.removeEventListener("mousemove", this), this.hud.container.removeEventListener("touchmove", this)), e.SYSTEM.fullscreenEvent && document.removeEventListener(e.SYSTEM.fullscreenEvent, this), this.config.mousewheel && this.hud.container.removeEventListener(e.SYSTEM.mouseWheelEvent, this), this.tooltip && this.tooltip.destroy(), this.hud && this.hud.destroy(), this.loader && this.loader.destroy(), this.navbar && this.navbar.destroy(), this.panel && this.panel.destroy(), this.doControls && this.doControls.disconnect(), this.scene && x.cleanTHREEScene(this.scene), this.canvas_container && this.container.removeChild(this.canvas_container), this.parent.removeChild(this.container), delete this.parent.photoSphereViewer, delete this.parent, delete this.container, delete this.loader, delete this.navbar, delete this.hud, delete this.panel, delete this.tooltip, delete this.canvas_container, delete this.renderer, delete this.composer, delete this.scene, delete this.camera, delete this.mesh, delete this.doControls, delete this.raycaster, delete this.passes, delete this.config, this.prop.cache.length = 0
    }, e.prototype.setPanorama = function(a, b, c) {
        if (null !== this.prop.loading_promise) throw new v("Loading already in progress");
        if ("boolean" == typeof b && (c = b, b = void 0), c && this.prop.isCubemap) throw new v("Transition is not available with cubemap.");
        b && (this.cleanPosition(b), this._stopAll()), this.config.panorama = a;
        var d = this;
        return c && this.config.transition && this.scene ? (this.config.transition.loader && this.loader.show(), this.prop.loading_promise = this._loadTexture(this.config.panorama).then(function(a) {
            return d.loader.hide(), d._transition(a, b)
        }).ensure(function() {
            d.loader.hide(), d.prop.loading_promise = null
        }).rethrow()) : (this.loader.show(), this.canvas_container && (this.canvas_container.style.opacity = 0), this.prop.loading_promise = this._loadTexture(this.config.panorama).then(function(a) {
            d._setTexture(a), b && d.rotate(b)
        }).ensure(function() {
            d.loader.hide(), d.canvas_container.style.opacity = 1, d.prop.loading_promise = null
        }).rethrow()), this.prop.loading_promise
    }, e.prototype.startAutorotate = function() {
        this._stopAll();
        var a = this,
            b = null,
            c = null;
        ! function d(e) {
            e && (c = null === b ? 0 : e - b, b = e, a.rotate({
                longitude: a.prop.longitude + a.config.anim_speed * c / 1e3,
                latitude: a.prop.latitude - (a.prop.latitude - a.config.anim_lat) / 200
            })), a.prop.autorotate_reqid = window.requestAnimationFrame(d)
        }(null), this.trigger("autorotate", !0)
    }, e.prototype.stopAutorotate = function() {
        this.prop.start_timeout && (window.clearTimeout(this.prop.start_timeout), this.prop.start_timeout = null), this.prop.autorotate_reqid && (window.cancelAnimationFrame(this.prop.autorotate_reqid), this.prop.autorotate_reqid = null, this.trigger("autorotate", !1))
    }, e.prototype.toggleAutorotate = function() {
        this.isAutorotateEnabled() ? this.stopAutorotate() : this.startAutorotate()
    }, e.prototype.startGyroscopeControl = function() {
        if (!this.doControls || !this.doControls.enabled || !this.doControls.deviceOrientation) return void console.warn("PhotoSphereViewer: gyroscope disabled");
        this._stopAll();
        var a = this;
        ! function b() {
            a.doControls.update(), a.prop.direction = a.camera.getWorldDirection();
            var c = a.vector3ToSphericalCoords(a.prop.direction);
            a.prop.longitude = c.longitude, a.prop.latitude = c.latitude, a.render(!1), a.prop.orientation_reqid = window.requestAnimationFrame(b)
        }(), this.trigger("gyroscope-updated", !0)
    }, e.prototype.stopGyroscopeControl = function() {
        this.prop.orientation_reqid && (window.cancelAnimationFrame(this.prop.orientation_reqid), this.prop.orientation_reqid = null, this.trigger("gyroscope-updated", !1), this.render())
    }, e.prototype.toggleGyroscopeControl = function() {
        this.isGyroscopeEnabled() ? this.stopGyroscopeControl() : this.startGyroscopeControl()
    }, e.prototype.rotate = function(a, b) {
        this.cleanPosition(a), this.applyRanges(a).forEach(this.trigger.bind(this, "_side-reached")), this.prop.longitude = a.longitude, this.prop.latitude = a.latitude, b !== !1 && this.renderer && (this.render(), this.trigger("position-updated", this.getPosition()))
    }, e.prototype.animate = function(a, c) {
        if (this._stopAll(), !c) return this.rotate(a), b.resolved();
        if (this.cleanPosition(a), this.applyRanges(a).forEach(this.trigger.bind(this, "_side-reached")), !c && "number" != typeof c) {
            c = c ? x.parseSpeed(c) : this.config.anim_speed;
            var d = Math.acos(Math.cos(this.prop.latitude) * Math.cos(a.latitude) * Math.cos(this.prop.longitude - a.longitude) + Math.sin(this.prop.latitude) * Math.sin(a.latitude));
            c = d / c * 1e3
        }
        var e = x.getShortestArc(this.prop.longitude, a.longitude);
        return this.prop.animation_promise = x.animation({
            properties: {
                longitude: {
                    start: this.prop.longitude,
                    end: this.prop.longitude + e
                },
                latitude: {
                    start: this.prop.latitude,
                    end: a.latitude
                }
            },
            duration: c,
            easing: "inOutSine",
            onTick: this.rotate.bind(this)
        }), this.prop.animation_promise
    }, e.prototype.stopAnimation = function() {
        this.prop.animation_promise && (this.prop.animation_promise.cancel(), this.prop.animation_promise = null)
    }, e.prototype.zoom = function(b, c) {
        this.prop.zoom_lvl = x.bound(Math.round(b), 0, 100), this.prop.vFov = this.config.max_fov + this.prop.zoom_lvl / 100 * (this.config.min_fov - this.config.max_fov), this.prop.hFov = a.Math.radToDeg(2 * Math.atan(Math.tan(a.Math.degToRad(this.prop.vFov) / 2) * this.prop.aspect)), c !== !1 && this.renderer && (this.render(), this.trigger("zoom-updated", this.getZoomLevel()))
    }, e.prototype.zoomIn = function() {
        this.prop.zoom_lvl < 100 && this.zoom(this.prop.zoom_lvl + 1)
    }, e.prototype.zoomOut = function() {
        this.prop.zoom_lvl > 0 && this.zoom(this.prop.zoom_lvl - 1)
    }, e.prototype.toggleFullscreen = function() {
        this.isFullscreenEnabled() ? x.exitFullscreen() : x.requestFullscreen(this.container)
    }, e.prototype.startKeyboardControl = function() {
        window.addEventListener("keydown", this)
    }, e.prototype.stopKeyboardControl = function() {
        window.removeEventListener("keydown", this)
    }, e.prototype.preloadPanorama = function(a) {
        if (!this.config.cache_texture) throw new v("Cannot preload panorama, cache_texture is disabled");
        return this._loadTexture(a)
    }, e.prototype.clearPanoramaCache = function(a) {
        if (!this.config.cache_texture) throw new v("Cannot clear cache, cache_texture is disabled");
        if (a) {
            for (var b = 0, c = this.prop.cache.length; b < c; b++)
                if (this.prop.cache[b].panorama === a) {
                    this.prop.cache.splice(b, 1);
                    break
                }
        } else this.prop.cache.length = 0
    }, e.prototype.getPanoramaCache = function(a) {
        if (!this.config.cache_texture) throw new v("Cannot query cache, cache_texture is disabled");
        return this.prop.cache.filter(function(b) {
            return b.panorama === a
        }).shift()
    }, e._loadSystem = function() {
        var a = e.SYSTEM;
        a.loaded = !0, a.pixelRatio = window.devicePixelRatio || 1, a.isWebGLSupported = x.isWebGLSupported(), a.isCanvasSupported = x.isCanvasSupported(), a.maxTextureWidth = a.isWebGLSupported ? x.getMaxTextureWidth() : 4096, a.mouseWheelEvent = x.mouseWheelEvent(), a.fullscreenEvent = x.fullscreenEvent(), a.deviceOrientationSupported = b(), "DeviceOrientationEvent" in window ? window.addEventListener("deviceorientation", e._deviceOrientationListener, !1) : a.deviceOrientationSupported.reject()
    }, e._deviceOrientationListener = function(a) {
        null === a.alpha || isNaN(a.alpha) ? e.SYSTEM.deviceOrientationSupported.reject() : e.SYSTEM.deviceOrientationSupported.resolve(), window.removeEventListener("deviceorientation", e._deviceOrientationListener)
    }, e.prototype._setViewerSize = function(a) {
        ["width", "height"].forEach(function(b) {
            a[b] && (/^[0-9.]+$/.test(a[b]) && (a[b] += "px"), this.parent.style[b] = a[b])
        }, this)
    }, e.prototype.textureCoordsToSphericalCoords = function(a) {
        if (this.prop.isCubemap) throw new v("Unable to use texture coords with cubemap.");
        var b = (a.x + this.prop.pano_data.cropped_x) / this.prop.pano_data.full_width * x.TwoPI,
            c = (a.y + this.prop.pano_data.cropped_y) / this.prop.pano_data.full_height * Math.PI;
        return {
            longitude: b >= Math.PI ? b - Math.PI : b + Math.PI,
            latitude: x.HalfPI - c
        }
    }, e.prototype.sphericalCoordsToTextureCoords = function(a) {
        if (this.prop.isCubemap) throw new v("Unable to use texture coords with cubemap.");
        var b = a.longitude / x.TwoPI * this.prop.pano_data.full_width,
            c = a.latitude / Math.PI * this.prop.pano_data.full_height;
        return {
            x: parseInt(a.longitude < Math.PI ? b + this.prop.pano_data.full_width / 2 : b - this.prop.pano_data.full_width / 2) - this.prop.pano_data.cropped_x,
            y: parseInt(this.prop.pano_data.full_height / 2 - c) - this.prop.pano_data.cropped_y
        }
    }, e.prototype.sphericalCoordsToVector3 = function(b) {
        return new a.Vector3(e.SPHERE_RADIUS * -Math.cos(b.latitude) * Math.sin(b.longitude), e.SPHERE_RADIUS * Math.sin(b.latitude), e.SPHERE_RADIUS * Math.cos(b.latitude) * Math.cos(b.longitude))
    }, e.prototype.vector3ToSphericalCoords = function(a) {
        var b = Math.acos(a.y / Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)),
            c = Math.atan2(a.x, a.z);
        return {
            longitude: c < 0 ? -c : x.TwoPI - c,
            latitude: x.HalfPI - b
        }
    }, e.prototype.viewerCoordsToVector3 = function(b) {
        var c = new a.Vector2(2 * b.x / this.prop.size.width - 1, -2 * b.y / this.prop.size.height + 1);
        this.raycaster.setFromCamera(c, this.camera);
        var d = this.raycaster.intersectObjects(this.scene.children);
        return 1 === d.length ? d[0].point : null
    }, e.prototype.vector3ToViewerCoords = function(a) {
        return a = a.clone(), a.project(this.camera), {
            x: parseInt((a.x + 1) / 2 * this.prop.size.width),
            y: parseInt((1 - a.y) / 2 * this.prop.size.height)
        }
    }, e.prototype.cleanPosition = function(a) {
        a.hasOwnProperty("x") && a.hasOwnProperty("y") && x.deepmerge(a, this.textureCoordsToSphericalCoords(a)), a.longitude = x.parseAngle(a.longitude), a.latitude = x.bound(x.parseAngle(a.latitude, -Math.PI), -x.HalfPI, x.HalfPI)
    }, e.prototype.applyRanges = function(b) {
        var c, d, e = [];
        return this.config.longitude_range && (c = x.clone(this.config.longitude_range), d = a.Math.degToRad(this.prop.hFov) / 2, c[0] = x.parseAngle(c[0] + d), c[1] = x.parseAngle(c[1] - d), c[0] > c[1] ? b.longitude > c[1] && b.longitude < c[0] && (b.longitude > c[0] / 2 + c[1] / 2 ? (b.longitude = c[0], e.push("left")) : (b.longitude = c[1], e.push("right"))) : b.longitude < c[0] ? (b.longitude = c[0], e.push("left")) : b.longitude > c[1] && (b.longitude = c[1], e.push("right"))), this.config.latitude_range && (c = x.clone(this.config.latitude_range), d = a.Math.degToRad(this.prop.vFov) / 2, c[0] = x.parseAngle(Math.min(c[0] + d, c[1]), -Math.PI), c[1] = x.parseAngle(Math.max(c[1] - d, c[0]), -Math.PI), b.latitude < c[0] ? (b.latitude = c[0], e.push("bottom")) : b.latitude > c[1] && (b.latitude = c[1], e.push("top"))), e
    }, f.className = null, f.publicMethods = [], f.prototype.create = function() {
        this.container = document.createElement("div"), this.constructor.className && (this.container.className = this.constructor.className), this.parent.container.appendChild(this.container)
    }, f.prototype.destroy = function() {
        this.parent.container.removeChild(this.container), this.constructor.publicMethods && this.constructor.publicMethods.forEach(function(a) {
            delete this.psv[a]
        }, this), delete this.container, delete this.psv, delete this.parent
    }, f.prototype.hide = function() {
        this.container.style.display = "none"
    }, f.prototype.show = function() {
        this.container.style.display = ""
    }, g.prototype = Object.create(f.prototype), g.prototype.constructor = g, g.className = "psv-hud", g.publicMethods = ["addMarker", "removeMarker", "updateMarker", "clearMarkers", "getMarker", "getCurrentMarker", "gotoMarker", "hideMarker", "showMarker", "toggleMarker", "toggleMarkersList", "showMarkersList", "hideMarkersList"], g.prototype.create = function() {
        f.prototype.create.call(this), this.svgContainer = document.createElementNS(x.svgNS, "svg"), this.svgContainer.setAttribute("class", "psv-hud-svg-container"), this.container.appendChild(this.svgContainer), this.container.addEventListener("mouseenter", this, !0), this.container.addEventListener("mouseleave", this, !0), this.container.addEventListener("mousemove", this, !0), this.psv.on("click", this), this.psv.on("dblclick", this), this.psv.on("render", this), this.psv.on("open-panel", this), this.psv.on("close-panel", this)
    }, g.prototype.destroy = function() {
        this.clearMarkers(!1), this.container.removeEventListener("mouseenter", this), this.container.removeEventListener("mouseleave", this), this.container.removeEventListener("mousemove", this), this.psv.off("click", this), this.psv.off("dblclick", this), this.psv.off("render", this), this.psv.off("open-panel", this), this.psv.off("close-panel", this), delete this.svgContainer, f.prototype.destroy.call(this)
    }, g.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "mouseenter":
                this._onMouseEnter(a);
                break;
            case "mouseleave":
                this._onMouseLeave(a);
                break;
            case "mousemove":
                this._onMouseMove(a);
                break;
            case "click":
                this._onClick(a.args[0], a, !1);
                break;
            case "dblclick":
                this._onClick(a.args[0], a, !0);
                break;
            case "render":
                this.renderMarkers();
                break;
            case "open-panel":
                this._onPanelOpened();
                break;
            case "close-panel":
                this._onPanelClosed()
        }
    }, g.prototype.addMarker = function(a, b) {
        if (!a.id) throw new v("missing marker id");
        if (this.markers[a.id]) throw new v('marker "' + a.id + '" already exists');
        var c = new w(a, this.psv);
        return c.isNormal() ? this.container.appendChild(c.$el) : this.svgContainer.appendChild(c.$el), this.markers[c.id] = c, b !== !1 && this.renderMarkers(), c
    }, g.prototype.getMarker = function(a) {
        var b = "object" == typeof a ? a.id : a;
        if (!this.markers[b]) throw new v('cannot find marker "' + b + '"');
        return this.markers[b]
    }, g.prototype.getCurrentMarker = function() {
        return this.currentMarker
    }, g.prototype.updateMarker = function(a, b) {
        var c = this.getMarker(a);
        return c.update(a), b !== !1 && this.renderMarkers(), c
    }, g.prototype.removeMarker = function(a, b) {
        a = this.getMarker(a), a.isNormal() ? this.container.removeChild(a.$el) : this.svgContainer.removeChild(a.$el), this.hoveringMarker == a && this.psv.tooltip.hideTooltip(), a.destroy(), delete this.markers[a.id], b !== !1 && this.renderMarkers()
    }, g.prototype.clearMarkers = function(a) {
        Object.keys(this.markers).forEach(function(a) {
            this.removeMarker(a, !1)
        }, this), a !== !1 && this.renderMarkers()
    }, g.prototype.gotoMarker = function(a, b) {
        return a = this.getMarker(a), this.psv.animate(a, b)
    }, g.prototype.hideMarker = function(a) {
        this.getMarker(a).visible = !1, this.renderMarkers()
    }, g.prototype.showMarker = function(a) {
        this.getMarker(a).visible = !0, this.renderMarkers()
    }, g.prototype.toggleMarker = function(a) {
        this.getMarker(a).visible ^= !0, this.renderMarkers()
    }, g.prototype.toggleMarkersList = function() {
        this.prop.panelOpened ? this.hideMarkersList() : this.showMarkersList()
    }, g.prototype.showMarkersList = function() {
        var a = [];
        for (var b in this.markers) a.push(this.markers[b]);
        var c = this.psv.config.templates.markersList({
            markers: this.psv.change("render-markers-list", a),
            config: this.psv.config
        });
        this.prop.panelOpening = !0, this.psv.panel.showPanel(c, !0), this.psv.panel.container.querySelector(".psv-markers-list").addEventListener("click", this._onClickItem.bind(this))
    }, g.prototype.hideMarkersList = function() {
        this.prop.panelOpened && this.psv.panel.hidePanel()
    }, g.prototype.renderMarkers = function() {
        var b = this.psv.isGyroscopeEnabled() ? a.Math.radToDeg(this.psv.camera.rotation.z) : 0;
        for (var c in this.markers) {
            var d = this.markers[c],
                e = d.visible;
            if (e && d.isPolygon()) {
                var f = this._getPolygonPositions(d);
                if (e = f.length > 2) {
                    d.position2D = this._getPolygonDimensions(d, f);
                    var g = "";
                    f.forEach(function(a) {
                        g += a.x + "," + a.y + " "
                    }), d.$el.setAttributeNS(null, "points", g)
                }
            } else if (e) {
                var h = this._getMarkerPosition(d);
                e = this._isMarkerVisible(d, h), e && (d.position2D = h, d.$el instanceof SVGElement ? d.$el.setAttribute("transform", "translate(" + h.x + " " + h.y + ")" + (!d.lockRotation && b ? " rotate(" + b + " " + d.anchor.left * d.width + " " + d.anchor.top * d.height + ")" : "")) : (d.$el.style.transform = "translate3D(" + h.x + "px, " + h.y + "px, 0px)" + (!d.lockRotation && b ? " rotateZ(" + b + "deg)" : ""), d.$el.style.transformOrigin = 100 * d.anchor.left + "% " + 100 * d.anchor.top + "%"))
            }
            x.toggleClass(d.$el, "psv-marker--visible", e)
        }
    }, g.prototype._isMarkerVisible = function(a, b) {
        return a.position3D.dot(this.psv.prop.direction) > 0 && b.x + a.width >= 0 && b.x - a.width <= this.psv.prop.size.width && b.y + a.height >= 0 && b.y - a.height <= this.psv.prop.size.height
    }, g.prototype._getMarkerPosition = function(a) {
        if (a._dynamicSize) {
            x.toggleClass(a.$el, "psv-marker--transparent", !0);
            var b = a.$el.getBoundingClientRect();
            x.toggleClass(a.$el, "psv-marker--transparent", !1), a.width = b.right - b.left, a.height = b.bottom - b.top
        }
        var c = this.psv.vector3ToViewerCoords(a.position3D);
        return c.x -= a.width * a.anchor.left, c.y -= a.height * a.anchor.top, c
    }, g.prototype._getPolygonPositions = function(a) {
        var b = a.positions3D.length,
            c = a.positions3D.map(function(a) {
                return {
                    vector: a,
                    visible: a.dot(this.psv.prop.direction) > 0
                }
            }, this),
            d = [];
        return c.forEach(function(a, e) {
            if (!a.visible) {
                var f = [0 === e ? c[b - 1] : c[e - 1], e === b - 1 ? c[0] : c[e + 1]];
                f.forEach(function(b) {
                    b.visible && d.push({
                        visible: b,
                        invisible: a,
                        index: e
                    })
                })
            }
        }), d.reverse().forEach(function(a) {
            c.splice(a.index, 0, {
                vector: this._getPolygonIntermediaryPoint(a.visible.vector, a.invisible.vector),
                visible: !0
            })
        }, this), c.filter(function(a) {
            return a.visible
        }).map(function(a) {
            return this.psv.vector3ToViewerCoords(a.vector)
        }, this)
    }, g.prototype._getPolygonIntermediaryPoint = function(b, c) {
        var d = this.psv.prop.direction.clone().normalize(),
            f = (new a.Vector3).crossVectors(b, c).normalize(),
            g = (new a.Vector3).crossVectors(f, b).normalize(),
            h = (new a.Vector3).addVectors(b.clone().multiplyScalar(-d.dot(g)), g.clone().multiplyScalar(d.dot(b))).normalize(),
            i = (new a.Vector3).crossVectors(h, d);
        return h.applyAxisAngle(i, .01).multiplyScalar(e.SPHERE_RADIUS)
    }, g.prototype._getPolygonDimensions = function(a, b) {
        var c = +(1 / 0),
            d = +(1 / 0),
            e = -(1 / 0),
            f = -(1 / 0);
        return b.forEach(function(a) {
            c = Math.min(c, a.x), d = Math.min(d, a.y), e = Math.max(e, a.x), f = Math.max(f, a.y)
        }), a.width = e - c, a.height = f - d, {
            x: c,
            y: d
        }
    }, g.prototype._onMouseEnter = function(a) {
        var b;
        a.target && (b = a.target.psvMarker) && !b.isPolygon() && (this.hoveringMarker = b, this.psv.trigger("over-marker", b), b.tooltip && this.psv.tooltip.showTooltip({
            content: b.tooltip.content,
            position: b.tooltip.position,
            left: b.position2D.x,
            top: b.position2D.y,
            box: {
                width: b.width,
                height: b.height
            }
        }))
    }, g.prototype._onMouseLeave = function(a) {
        var b;
        if (a.target && (b = a.target.psvMarker)) {
            if (b.isPolygon() && a.relatedTarget && x.hasParent(a.relatedTarget, this.psv.tooltip.container)) return;
            this.psv.trigger("leave-marker", b), this.hoveringMarker = null, this.psv.tooltip.hideTooltip()
        }
    }, g.prototype._onMouseMove = function(a) {
        if (!this.psv.prop.moving) {
            var b;
            if (a.target && (b = a.target.psvMarker) && b.isPolygon() || a.target && x.hasParent(a.target, this.psv.tooltip.container) && (b = this.hoveringMarker)) {
                this.hoveringMarker || (this.psv.trigger("over-marker", b), this.hoveringMarker = b);
                var c = this.psv.container.getBoundingClientRect();
                b.tooltip && this.psv.tooltip.showTooltip({
                    content: b.tooltip.content,
                    position: b.tooltip.position,
                    top: a.clientY - c.top - this.psv.config.tooltip.arrow_size / 2,
                    left: a.clientX - c.left - this.psv.config.tooltip.arrow_size,
                    box: {
                        width: 2 * this.psv.config.tooltip.arrow_size,
                        height: 2 * this.psv.config.tooltip.arrow_size
                    }
                })
            } else this.hoveringMarker && this.hoveringMarker.isPolygon() && (this.psv.trigger("leave-marker", b), this.hoveringMarker = null, this.psv.tooltip.hideTooltip())
        }
    }, g.prototype._onClick = function(a, b, c) {
        var d;
        a.target && (d = x.getClosest(a.target, ".psv-marker")) && d.psvMarker ? (this.currentMarker = d.psvMarker, this.psv.trigger("select-marker", this.currentMarker, c), this.psv.config.click_event_on_marker ? a.marker = d.psvMarker : b.stopPropagation()) : this.currentMarker && (this.psv.trigger("unselect-marker", this.currentMarker), this.currentMarker = null), d && d.psvMarker && d.psvMarker.content ? this.psv.panel.showPanel(d.psvMarker.content) : this.psv.panel.prop.opened && (b.stopPropagation(), this.psv.panel.hidePanel())
    }, g.prototype._onClickItem = function(a) {
        var b;
        a.target && (b = x.getClosest(a.target, "li")) && b.dataset.psvMarker && (this.gotoMarker(b.dataset.psvMarker, 1e3), this.psv.panel.hidePanel())
    }, g.prototype._onPanelOpened = function() {
        this.prop.panelOpening ? (this.prop.panelOpening = !1, this.prop.panelOpened = !0) : this.prop.panelOpened = !1, this.prop.markersButton && this.prop.markersButton.toggleActive(this.prop.panelOpened)
    }, g.prototype._onPanelClosed = function() {
        this.prop.panelOpened = !1, this.prop.panelOpening = !1, this.prop.markersButton && this.prop.markersButton.toggleActive(!1)
    }, h.prototype = Object.create(f.prototype), h.prototype.constructor = h, h.className = "psv-loader-container", h.prototype.create = function() {
        f.prototype.create.call(this), this.loader = document.createElement("div"), this.loader.className = "psv-loader", this.container.appendChild(this.loader), this.canvas = document.createElement("canvas"), this.canvas.className = "psv-loader-canvas", this.canvas.width = this.loader.clientWidth, this.canvas.height = this.loader.clientWidth, this.loader.appendChild(this.canvas), this.tickness = (this.loader.offsetWidth - this.loader.clientWidth) / 2;
        var a;
        if (this.psv.config.loading_img ? (a = document.createElement("img"), a.className = "psv-loader-image", a.src = this.psv.config.loading_img) : this.psv.config.loading_txt && (a = document.createElement("div"), a.className = "psv-loader-text", a.innerHTML = this.psv.config.loading_txt), a) {
            var b = Math.round(Math.sqrt(2 * Math.pow(this.canvas.width / 2 - this.tickness / 2, 2)));
            a.style.maxWidth = b + "px", a.style.maxHeight = b + "px", this.loader.appendChild(a)
        }
    }, h.prototype.destroy = function() {
        delete this.loader, delete this.canvas, f.prototype.destroy.call(this)
    }, h.prototype.setProgress = function(a) {
        var b = this.canvas.getContext("2d");
        b.clearRect(0, 0, this.canvas.width, this.canvas.height), b.lineWidth = this.tickness, b.strokeStyle = x.getStyle(this.loader, "color"), b.beginPath(), b.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2 - this.tickness / 2, -Math.PI / 2, a / 100 * 2 * Math.PI - Math.PI / 2), b.stroke()
    }, i.prototype = Object.create(f.prototype), i.prototype.constructor = i, i.className = "psv-navbar psv-navbar--open", i.publicMethods = ["showNavbar", "hideNavbar", "toggleNavbar", "getNavbarButton"], i.prototype.create = function() {
        f.prototype.create.call(this), this.config.forEach(function(a) {
            if ("object" == typeof a) this.items.push(new p(this, a));
            else switch (a) {
                case o.id:
                    this.items.push(new o(this));
                    break;
                case u.id:
                    this.items.push(new u(this));
                    break;
                case q.id:
                    this.items.push(new q(this));
                    break;
                case t.id:
                    this.items.push(new t(this));
                    break;
                case r.id:
                    this.items.push(new r(this));
                    break;
                case s.id:
                    this.psv.config.gyroscope && this.items.push(new s(this));
                    break;
                case "caption":
                    this.items.push(new j(this, this.psv.config.caption));
                    break;
                case "spacer":
                    a = "spacer-5";
                default:
                    var b = a.match(/^spacer\-([0-9]+)$/);
                    if (null === b) throw new v("Unknown button " + a);
                    this.items.push(new k(this, b[1]))
            }
        }, this)
    }, i.prototype.destroy = function() {
        this.items.forEach(function(a) {
            a.destroy()
        }), delete this.items, delete this.config, f.prototype.destroy.call(this)
    }, i.prototype.getNavbarButton = function(a) {
        var b = null;
        return this.items.some(function(c) {
            if (c.id === a) return b = c, !0
        }), b || console.warn('PhotoSphereViewer: button "' + a + '" not found in the navbar.'), b
    }, i.prototype.showNavbar = function() {
        this.toggleNavbar(!0)
    }, i.prototype.hideNavbar = function() {
        this.toggleNavbar(!1)
    }, i.prototype.toggleNavbar = function(a) {
        x.toggleClass(this.container, "psv-navbar--open", a)
    }, j.prototype = Object.create(f.prototype), j.prototype.constructor = j, j.className = "psv-caption", j.publicMethods = ["setCaption"], j.prototype.setCaption = function(a) {
        a ? this.container.innerHTML = a : this.container.innerHTML = ""
    }, k.prototype = Object.create(f.prototype), k.prototype.constructor = k, k.className = "psv-spacer", l.prototype = Object.create(f.prototype), l.prototype.constructor = l, l.className = "psv-panel", l.publicMethods = ["showPanel", "hidePanel"], l.prototype.create = function() {
        f.prototype.create.call(this), this.container.innerHTML = '<div class="psv-panel-resizer"></div><div class="psv-panel-close-button"></div><div class="psv-panel-content"></div>', this.content = this.container.querySelector(".psv-panel-content");
        var a = this.container.querySelector(".psv-panel-close-button");
        a.addEventListener("click", this.hidePanel.bind(this)), this.psv.config.mousewheel && this.container.addEventListener(e.SYSTEM.mouseWheelEvent, function(a) {
            a.stopPropagation()
        });
        var b = this.container.querySelector(".psv-panel-resizer");
        b.addEventListener("mousedown", this), b.addEventListener("touchstart", this), this.psv.container.addEventListener("mouseup", this), this.psv.container.addEventListener("touchend", this), this.psv.container.addEventListener("mousemove", this), this.psv.container.addEventListener("touchmove", this)
    }, l.prototype.destroy = function() {
        this.psv.container.removeEventListener("mousemove", this), this.psv.container.removeEventListener("touchmove", this), this.psv.container.removeEventListener("mouseup", this), this.psv.container.removeEventListener("touchend", this), delete this.prop, delete this.content, f.prototype.destroy.call(this)
    }, l.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "mousedown":
                this._onMouseDown(a);
                break;
            case "touchstart":
                this._onTouchStart(a);
                break;
            case "mousemove":
                this._onMouseMove(a);
                break;
            case "touchmove":
                this._onTouchMove(a);
                break;
            case "mouseup":
                this._onMouseUp(a);
                break;
            case "touchend":
                this._onMouseUp(a)
        }
    }, l.prototype.showPanel = function(a, b) {
        this.content.innerHTML = a, this.content.scrollTop = 0, this.container.classList.add("psv-panel--open"), x.toggleClass(this.content, "psv-panel-content--no-margin", !!b), this.prop.opened = !0, this.psv.trigger("open-panel")
    }, l.prototype.hidePanel = function() {
        this.content.innerHTML = null, this.prop.opened = !1, this.container.classList.remove("psv-panel--open"), this.psv.trigger("close-panel")
    }, l.prototype._onMouseDown = function(a) {
        a.stopPropagation(), this._startResize(a)
    }, l.prototype._onTouchStart = function(a) {
        a.stopPropagation(), this._startResize(a.changedTouches[0])
    }, l.prototype._onMouseUp = function(a) {
        this.prop.mousedown && (a.stopPropagation(), this.prop.mousedown = !1, this.content.classList.remove("psv-panel-content--no-interaction"))
    }, l.prototype._onMouseMove = function(a) {
        this.prop.mousedown && (a.stopPropagation(), this._resize(a))
    }, l.prototype._onTouchMove = function(a) {
        this.prop.mousedown && (a.stopPropagation(), this._resize(a.touches[0]))
    }, l.prototype._startResize = function(a) {
        this.prop.mouse_x = parseInt(a.clientX), this.prop.mouse_y = parseInt(a.clientY), this.prop.mousedown = !0, this.content.classList.add("psv-panel-content--no-interaction")
    }, l.prototype._resize = function(a) {
        var b = parseInt(a.clientX),
            c = parseInt(a.clientY);
        this.container.style.width = this.container.offsetWidth - (b - this.prop.mouse_x) + "px", this.prop.mouse_x = b, this.prop.mouse_y = c
    }, m.prototype = Object.create(f.prototype), m.prototype.constructor = m, m.className = "psv-tooltip", m.publicMethods = ["showTooltip", "hideTooltip", "isTooltipVisible"], m.leftMap = {
        0: "left",
        .5: "center",
        1: "right"
    }, m.topMap = {
        0: "top",
        .5: "center",
        1: "bottom"
    }, m.prototype.create = function() {
        f.prototype.create.call(this), this.container.innerHTML = '<div class="psv-tooltip-arrow"></div><div class="psv-tooltip-content"></div>', this.container.style.top = "-1000px", this.container.style.left = "-1000px", this.content = this.container.querySelector(".psv-tooltip-content"), this.arrow = this.container.querySelector(".psv-tooltip-arrow"), this.psv.on("render", this)
    }, m.prototype.destroy = function() {
        this.psv.off("render", this), delete this.config, delete this.prop, f.prototype.destroy.call(this)
    }, m.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "render":
                this.hideTooltip()
        }
    }, m.prototype.isTooltipVisible = function() {
        return this.container.classList.contains("psv-tooltip--visible")
    }, m.prototype.showTooltip = function(a) {
        this.prop.timeout && (window.clearTimeout(this.prop.timeout), this.prop.timeout = null);
        var b = this.isTooltipVisible(),
            c = this.container,
            d = this.content,
            e = this.arrow;
        if (a.position || (a.position = ["top", "center"]), a.box || (a.box = {
                width: 0,
                height: 0
            }), "string" == typeof a.position) {
            var f = x.parsePosition(a.position);
            if (!(f.left in m.leftMap && f.top in m.topMap)) throw new v('unable to parse tooltip position "' + tooltip.position + '"');
            a.position = [m.topMap[f.top], m.leftMap[f.left]]
        }
        if ("center" == a.position[0] && "center" == a.position[1]) throw new v('unable to parse tooltip position "center center"');
        if (b)
            for (var g = c.classList.length - 1; g >= 0; g--) {
                var h = c.classList.item(g);
                "psv-tooltip" != h && "psv-tooltip--visible" != h && c.classList.remove(h)
            } else c.className = "psv-tooltip";
        a.className && x.addClasses(c, a.className), d.innerHTML = a.content, c.style.top = "0px", c.style.left = "0px";
        var i = c.getBoundingClientRect(),
            j = {
                posClass: a.position.slice(),
                width: i.right - i.left,
                height: i.bottom - i.top,
                top: 0,
                left: 0,
                arrow_top: 0,
                arrow_left: 0
            };
        this._computeTooltipPosition(j, a);
        var k = !1;
        if (j.top < this.config.offset ? (j.posClass[0] = "bottom", k = !0) : j.top + j.height > this.psv.prop.size.height - this.config.offset && (j.posClass[0] = "top", k = !0), j.left < this.config.offset ? (j.posClass[1] = "right", k = !0) : j.left + j.width > this.psv.prop.size.width - this.config.offset && (j.posClass[1] = "left", k = !0), k && this._computeTooltipPosition(j, a), c.style.top = j.top + "px", c.style.left = j.left + "px", e.style.top = j.arrow_top + "px", e.style.left = j.arrow_left + "px", c.classList.add("psv-tooltip--" + j.posClass.join("-")), !b) {
            var l = this;
            this.prop.timeout = window.setTimeout(function() {
                c.classList.add("psv-tooltip--visible"), l.prop.timeout = null, l.psv.trigger("show-tooltip")
            }, this.config.delay)
        }
    }, m.prototype.hideTooltip = function() {
        if (this.prop.timeout && (window.clearTimeout(this.prop.timeout), this.prop.timeout = null), this.isTooltipVisible()) {
            this.container.classList.remove("psv-tooltip--visible");
            var a = this;
            this.prop.timeout = window.setTimeout(function() {
                a.content.innerHTML = null, a.container.style.top = "-1000px", a.container.style.left = "-1000px", a.prop.timeout = null
            }, this.config.delay), this.psv.trigger("hide-tooltip")
        }
    }, m.prototype._computeTooltipPosition = function(a, b) {
        var c = !1;
        switch (a.posClass[0]) {
            case "bottom":
                a.top = b.top + b.box.height + this.config.offset + this.config.arrow_size, a.arrow_top = 2 * -this.config.arrow_size, c = !0;
                break;
            case "center":
                a.top = b.top + b.box.height / 2 - a.height / 2, a.arrow_top = a.height / 2 - this.config.arrow_size;
                break;
            case "top":
                a.top = b.top - a.height - this.config.offset - this.config.arrow_size, a.arrow_top = a.height, c = !0
        }
        switch (a.posClass[1]) {
            case "right":
                c ? (a.left = b.left + b.box.width / 2 - this.config.offset - this.config.arrow_size, a.arrow_left = this.config.offset) : (a.left = b.left + b.box.width + this.config.offset + this.config.arrow_size, a.arrow_left = 2 * -this.config.arrow_size);
                break;
            case "center":
                a.left = b.left + b.box.width / 2 - a.width / 2, a.arrow_left = a.width / 2 - this.config.arrow_size;
                break;
            case "left":
                c ? (a.left = b.left - a.width + b.box.width / 2 + this.config.offset + this.config.arrow_size, a.arrow_left = a.width - this.config.offset - 2 * this.config.arrow_size) : (a.left = b.left - a.width - this.config.offset - this.config.arrow_size, a.arrow_left = a.width)
        }
    }, n.prototype = Object.create(f.prototype), n.prototype.constructor = n, n.id = null, n.icon = null, n.iconActive = null, n.prototype.create = function() {
        f.prototype.create.call(this), this.constructor.icon && this._setIcon(this.constructor.icon), this.id && this.psv.config.lang[this.id] && (this.container.title = this.psv.config.lang[this.id]), this.container.addEventListener("click", function(a) {
            this.enabled && this._onClick(), a.stopPropagation()
        }.bind(this))
    }, n.prototype.destroy = function() {
        f.prototype.destroy.call(this)
    }, n.prototype.toggleActive = function(a) {
        x.toggleClass(this.container, "psv-button--active", a), this.constructor.iconActive && this._setIcon(a ? this.constructor.iconActive : this.constructor.icon)
    }, n.prototype.disable = function() {
        this.container.classList.add("psv-button--disabled"), this.enabled = !1
    }, n.prototype.enable = function() {
        this.container.classList.remove("psv-button--disabled"), this.enabled = !0
    }, n.prototype._setIcon = function(a, b) {
        b || (b = this.container), a ? (b.innerHTML = e.ICONS[a], b.querySelector("svg").setAttribute("class", "psv-button-svg")) : b.innerHTML = ""
    }, n.prototype._onClick = function() {}, o.prototype = Object.create(n.prototype), o.prototype.constructor = o, o.id = "autorotate", o.className = "psv-button psv-button--hover-scale psv-autorotate-button", o.icon = "play.svg", o.iconActive = "play-active.svg", o.prototype.create = function() {
        n.prototype.create.call(this), this.psv.on("autorotate", this)
    }, o.prototype.destroy = function() {
        this.psv.off("autorotate", this), n.prototype.destroy.call(this)
    }, o.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "autorotate":
                this.toggleActive(a.args[0])
        }
    }, o.prototype._onClick = function() {
        this.psv.toggleAutorotate()
    }, p.prototype = Object.create(n.prototype), p.prototype.constructor = p, p.className = "psv-button psv-custom-button", p.prototype.create = function() {
        n.prototype.create.call(this), this.config.className && x.addClasses(this.container, this.config.className), this.config.title && (this.container.title = this.config.title), this.config.content && (this.container.innerHTML = this.config.content), this.config.enabled !== !1 && this.config.disabled !== !0 || this.disable(), this.config.visible !== !1 && this.config.hidden !== !0 || this.hide()
    }, p.prototype.destroy = function() {
        delete this.config, n.prototype.destroy.call(this)
    }, p.prototype._onClick = function() {
        this.config.onClick && this.config.onClick.apply(this.psv)
    }, q.prototype = Object.create(n.prototype), q.prototype.constructor = q, q.id = "download", q.className = "psv-button psv-button--hover-scale psv-download-button", q.icon = "download.svg", q.prototype._onClick = function() {
        var a = document.createElement("a");
        a.href = this.psv.config.panorama, a.download = this.psv.config.panorama, this.psv.container.appendChild(a), a.click()
    }, r.prototype = Object.create(n.prototype), r.prototype.constructor = r, r.id = "fullscreen", r.className = "psv-button psv-button--hover-scale psv-fullscreen-button", r.icon = "fullscreen-in.svg", r.iconActive = "fullscreen-out.svg", r.prototype.create = function() {
        n.prototype.create.call(this), e.SYSTEM.fullscreenEvent || (this.hide(), console.warn("PhotoSphereViewer: fullscreen not supported.")), this.psv.on("fullscreen-updated", this)
    }, r.prototype.destroy = function() {
        this.psv.off("fullscreen-updated", this), n.prototype.destroy.call(this)
    }, r.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "fullscreen-updated":
                this.toggleActive(a.args[0])
        }
    }, r.prototype._onClick = function() {
        this.psv.toggleFullscreen()
    }, s.prototype = Object.create(n.prototype), s.prototype.constructor = s, s.id = "gyroscope", s.className = "psv-button psv-button--hover-scale psv-gyroscope-button", s.icon = "compass.svg", s.prototype.create = function() {
        n.prototype.create.call(this), e.SYSTEM.deviceOrientationSupported.promise.then(this._onAvailabilityChange.bind(this, !0), this._onAvailabilityChange.bind(this, !1)), this.hide(), this.psv.on("gyroscope-updated", this)
    }, s.prototype.destroy = function() {
        this.psv.off("gyroscope-updated", this), n.prototype.destroy.call(this)
    }, s.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "gyroscope-updated":
                this.toggleActive(a.args[0])
        }
    }, s.prototype._onClick = function() {
        this.psv.toggleGyroscopeControl()
    }, s.prototype._onAvailabilityChange = function(a) {
        if (a) {
            if (!x.checkTHREE("DeviceOrientationControls")) throw new v("Missing Three.js components: DeviceOrientationControls. Get them from three.js-examples package.");
            this.show()
        }
    }, t.prototype = Object.create(n.prototype), t.prototype.constructor = t, t.id = "markers", t.className = "psv-button psv-button--hover-scale psv-markers-button", t.icon = "pin.svg", t.prototype._onClick = function() {
        this.psv.hud.toggleMarkersList()
    }, u.prototype = Object.create(n.prototype), u.prototype.constructor = u, u.id = "zoom", u.className = "psv-button psv-zoom-button", u.prototype.create = function() {
        n.prototype.create.call(this);
        var a = document.createElement("div");
        a.className = "psv-zoom-button-minus", a.title = this.psv.config.lang.zoomOut, this._setIcon("zoom-out.svg", a), this.container.appendChild(a);
        var b = document.createElement("div");
        b.className = "psv-zoom-button-range", this.container.appendChild(b), this.zoom_range = document.createElement("div"), this.zoom_range.className = "psv-zoom-button-line", b.appendChild(this.zoom_range), this.zoom_value = document.createElement("div"), this.zoom_value.className = "psv-zoom-button-handle", this.zoom_range.appendChild(this.zoom_value);
        var c = document.createElement("div");
        c.className = "psv-zoom-button-plus", c.title = this.psv.config.lang.zoomIn, this._setIcon("zoom-in.svg", c),
            this.container.appendChild(c), this.zoom_range.addEventListener("mousedown", this), this.zoom_range.addEventListener("touchstart", this), this.psv.container.addEventListener("mousemove", this), this.psv.container.addEventListener("touchmove", this), this.psv.container.addEventListener("mouseup", this), this.psv.container.addEventListener("touchend", this), a.addEventListener("mousedown", this._zoomOut.bind(this)), c.addEventListener("mousedown", this._zoomIn.bind(this)), this.psv.on("zoom-updated", this), this.psv.once("ready", function() {
                this._moveZoomValue(this.psv.prop.zoom_lvl)
            }.bind(this))
    }, u.prototype.destroy = function() {
        this.psv.container.removeEventListener("mousemove", this), this.psv.container.removeEventListener("touchmove", this), this.psv.container.removeEventListener("mouseup", this), this.psv.container.removeEventListener("touchend", this), delete this.zoom_range, delete this.zoom_value, this.psv.off("zoom-updated", this), n.prototype.destroy.call(this)
    }, u.prototype.handleEvent = function(a) {
        switch (a.type) {
            case "mousedown":
                this._initZoomChangeWithMouse(a);
                break;
            case "touchstart":
                this._initZoomChangeByTouch(a);
                break;
            case "mousemove":
                this._changeZoomWithMouse(a);
                break;
            case "touchmove":
                this._changeZoomByTouch(a);
                break;
            case "mouseup":
                this._stopZoomChange(a);
                break;
            case "touchend":
                this._stopZoomChange(a);
                break;
            case "zoom-updated":
                this._moveZoomValue(a.args[0])
        }
    }, u.prototype._moveZoomValue = function(a) {
        this.zoom_value.style.left = a / 100 * this.zoom_range.offsetWidth - this.zoom_value.offsetWidth / 2 + "px"
    }, u.prototype._initZoomChangeWithMouse = function(a) {
        this.enabled && (this.prop.mousedown = !0, this._changeZoom(a.clientX))
    }, u.prototype._initZoomChangeByTouch = function(a) {
        this.enabled && (this.prop.mousedown = !0, this._changeZoom(a.changedTouches[0].clientX))
    }, u.prototype._zoomIn = function() {
        this.enabled && (this.prop.buttondown = !0, this.psv.zoomIn(), window.setTimeout(this._startLongPressInterval.bind(this, 1), 200))
    }, u.prototype._zoomOut = function() {
        this.enabled && (this.prop.buttondown = !0, this.psv.zoomOut(), window.setTimeout(this._startLongPressInterval.bind(this, -1), 200))
    }, u.prototype._startLongPressInterval = function(a) {
        this.prop.buttondown && (this.prop.longPressInterval = window.setInterval(function() {
            this.psv.zoom(this.psv.prop.zoom_lvl + a)
        }.bind(this), 50))
    }, u.prototype._stopZoomChange = function() {
        this.enabled && (window.clearInterval(this.prop.longPressInterval), this.prop.longPressInterval = null, this.prop.mousedown = !1, this.prop.buttondown = !1)
    }, u.prototype._changeZoomWithMouse = function(a) {
        this.enabled && (a.preventDefault(), this._changeZoom(a.clientX))
    }, u.prototype._changeZoomByTouch = function(a) {
        this.enabled && (a.preventDefault(), this._changeZoom(a.changedTouches[0].clientX))
    }, u.prototype._changeZoom = function(a) {
        if (this.prop.mousedown) {
            var b = parseInt(a) - this.zoom_range.getBoundingClientRect().left,
                c = b / this.zoom_range.offsetWidth * 100;
            this.psv.zoom(c)
        }
    }, v.prototype = Object.create(Error.prototype), v.prototype.name = "PSVError", v.prototype.constructor = v, e.Error = v, w.types = ["image", "html", "polygon_px", "polygon_rad", "rect", "circle", "ellipse", "path"], w.getType = function(a, b) {
        var c = [];
        if (w.types.forEach(function(b) {
                a[b] && c.push(b)
            }), 0 === c.length && !b) throw new v("missing marker content, either " + w.types.join(", "));
        if (c.length > 1) throw new v("multiple marker content, either " + w.types.join(", "));
        return c[0]
    }, w.prototype.destroy = function() {
        delete this.$el.psvMarker
    }, w.prototype.isNormal = function() {
        return "image" == this.type || "html" == this.type
    }, w.prototype.isPolygon = function() {
        return "polygon_px" == this.type || "polygon_rad" == this.type
    }, w.prototype.isSvg = function() {
        return "rect" == this.type || "circle" == this.type || "ellipse" == this.type || "path" == this.type
    }, w.prototype.update = function(a) {
        if (a && a !== this) {
            var b = w.getType(a, !0);
            if (void 0 !== b && b !== this.type) throw new v("cannot change marker type");
            x.deepmerge(this, a)
        }
        this.isNormal() ? this.$el.setAttribute("class", "psv-marker psv-marker--normal") : this.$el.setAttribute("class", "psv-marker psv-marker--svg"), this.className && x.addClasses(this.$el, this.className), this.tooltip && (x.addClasses(this.$el, "has-tooltip"), "string" == typeof this.tooltip && (this.tooltip = {
            content: this.tooltip
        })), this.style && x.deepmerge(this.$el.style, this.style), this.anchor = x.parsePosition(this.anchor), this.isNormal() ? this._updateNormal() : this.isPolygon() ? this._updatePolygon() : this._updateSvg()
    }, w.prototype._updateNormal = function() {
        this.width && this.height ? (this.$el.style.width = this.width + "px", this.$el.style.height = this.height + "px", this._dynamicSize = !1) : this._dynamicSize = !0, this.image ? this.$el.style.backgroundImage = "url(" + this.image + ")" : this.$el.innerHTML = this.html, this.psv.cleanPosition(this), this.position3D = this.psv.sphericalCoordsToVector3(this)
    }, w.prototype._updateSvg = function() {
        switch (this._dynamicSize = !0, this.type) {
            case "rect":
                "number" == typeof this._def ? this._def = {
                    x: 0,
                    y: 0,
                    width: this._def,
                    height: this._def
                } : Array.isArray(this._def) ? this._def = {
                    x: 0,
                    y: 0,
                    width: this._def[0],
                    height: this._def[1]
                } : this._def.x = this._def.y = 0;
                break;
            case "circle":
                "number" == typeof this._def ? this._def = {
                    cx: this._def,
                    cy: this._def,
                    r: this._def
                } : Array.isArray(this._def) ? this._def = {
                    cx: this._def[0],
                    cy: this._def[0],
                    r: this._def[0]
                } : this._def.cx = this._def.cy = this._def.r;
                break;
            case "ellipse":
                "number" == typeof this._def ? this._def = {
                    cx: this._def,
                    cy: this._def,
                    rx: this._def,
                    ry: this._def
                } : Array.isArray(this._def) ? this._def = {
                    cx: this._def[0],
                    cy: this._def[1],
                    rx: this._def[0],
                    ry: this._def[1]
                } : (this._def.cx = this._def.rx, this._def.cy = this._def.ry);
                break;
            case "path":
                "string" == typeof this._def && (this._def = {
                    d: this._def
                })
        }
        Object.getOwnPropertyNames(this._def).forEach(function(a) {
            this.$el.setAttributeNS(null, a, this._def[a])
        }, this), this.svgStyle ? Object.getOwnPropertyNames(this.svgStyle).forEach(function(a) {
            this.$el.setAttributeNS(null, a, this.svgStyle[a])
        }, this) : this.$el.setAttributeNS(null, "fill", "rgba(0,0,0,0.5)"), this.psv.cleanPosition(this), this.position3D = this.psv.sphericalCoordsToVector3(this)
    }, w.prototype._updatePolygon = function() {
        this._dynamicSize = !0, this.svgStyle ? Object.getOwnPropertyNames(this.svgStyle).forEach(function(a) {
            this.$el.setAttributeNS(null, a, this.svgStyle[a])
        }, this) : this.$el.setAttributeNS(null, "fill", "rgba(0,0,0,0.5)"), [this.polygon_rad, this.polygon_px].forEach(function(a) {
            if (a && "object" != typeof a[0])
                for (var b = 0; b < a.length; b++) a.splice(b, 2, [a[b], a[b + 1]])
        }), this.polygon_px ? this.polygon_rad = this.polygon_px.map(function(a) {
            var b = this.psv.textureCoordsToSphericalCoords({
                x: a[0],
                y: a[1]
            });
            return [b.longitude, b.latitude]
        }, this) : this.polygon_rad = this.polygon_rad.map(function(a) {
            return [x.parseAngle(a[0]), x.bound(x.parseAngle(a[1], -Math.PI), -x.HalfPI, x.HalfPI)]
        }), this.longitude = this.polygon_rad[0][0], this.latitude = this.polygon_rad[0][1], this.positions3D = this.polygon_rad.map(function(a) {
            return this.psv.sphericalCoordsToVector3({
                longitude: a[0],
                latitude: a[1]
            })
        }, this)
    };
    var x = {};
    return e.Utils = x, x.TwoPI = 2 * Math.PI, x.HalfPI = Math.PI / 2, x.svgNS = "http://www.w3.org/2000/svg", x.checkTHREE = function(b) {
            for (var c = 0, d = arguments.length; c < d; c++)
                if (!(arguments[c] in a)) return !1;
            return !0
        }, x.isCanvasSupported = function() {
            var a = document.createElement("canvas");
            return !(!a.getContext || !a.getContext("2d"))
        }, x.getWebGLCtx = function() {
            var a = document.createElement("canvas"),
                b = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                c = null;
            return a.getContext && b.some(function(b) {
                try {
                    return c = a.getContext(b), c && "function" == typeof c.getParameter
                } catch (d) {
                    return !1
                }
            }) ? c : null
        }, x.isWebGLSupported = function() {
            return !!window.WebGLRenderingContext && null !== x.getWebGLCtx()
        }, x.getMaxTextureWidth = function() {
            var a = x.getWebGLCtx();
            if (null !== a) return a.getParameter(a.MAX_TEXTURE_SIZE)
        }, x.toggleClass = function(a, b, c) {
            if (a.classList) void 0 === c ? a.classList.toggle(b) : c && !a.classList.contains(b) ? a.classList.add(b) : c || a.classList.remove(b);
            else {
                var d = a.getAttribute("class") || "",
                    e = d.indexOf(b) !== -1,
                    f = new RegExp("(?:^|\\s)" + b + "(?:\\s|$)");
                void 0 !== c && !c || e ? c || (d = d.replace(f, " ")) : d += d.length > 0 ? " " + b : b, a.setAttribute("class", d)
            }
        }, x.addClasses = function(a, b) {
            b && b.split(" ").forEach(function(b) {
                x.toggleClass(a, b, !0)
            })
        }, x.removeClasses = function(a, b) {
            b && b.split(" ").forEach(function(b) {
                x.toggleClass(a, b, !1)
            })
        }, x.hasParent = function(a, b) {
            do
                if (a === b) return !0;
            while (a = a.parentNode);
            return !1
        }, x.getClosest = function(a, b) {
            var c = a.matches || a.msMatchesSelector;
            do
                if (c.bind(a)(b)) return a;
            while (a = a.parentElement);
            return null
        }, x.mouseWheelEvent = function() {
            return "onwheel" in document.createElement("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : "DOMMouseScroll"
        }, x.fullscreenEvent = function() {
            var a = {
                exitFullscreen: "fullscreenchange",
                webkitExitFullscreen: "webkitfullscreenchange",
                mozCancelFullScreen: "mozfullscreenchange",
                msExitFullscreen: "msFullscreenEnabled"
            };
            for (var b in a)
                if (b in document) return a[b]
        }, x.bound = function(a, b, c) {
            return Math.max(b, Math.min(c, a))
        }, x.isInteger = Number.isInteger || function(a) {
            return "number" == typeof a && isFinite(a) && Math.floor(a) === a
        }, x.sum = function(a) {
            return a.reduce(function(a, b) {
                return a + b
            }, 0)
        }, x.getXMPValue = function(a, b) {
            var c;
            return null !== (c = a.match("<GPano:" + b + ">(.*)</GPano:" + b + ">")) ? c[1] : null !== (c = a.match("GPano:" + b + '="(.*?)"')) ? c[1] : null
        }, x.isFullscreenEnabled = function(a) {
            return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) === a
        }, x.requestFullscreen = function(a) {
            (a.requestFullscreen || a.mozRequestFullScreen || a.webkitRequestFullscreen || a.msRequestFullscreen).call(a)
        }, x.exitFullscreen = function() {
            (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document)
        }, x.getStyle = function(a, b) {
            return window.getComputedStyle(a, null)[b]
        }, x.getShortestArc = function(a, b) {
            var c = [0, x.TwoPI, -x.TwoPI];
            return c.reduce(function(c, d) {
                return d = b - a + d, Math.abs(d) < Math.abs(c) ? d : c
            }, 1 / 0)
        }, x.parsePosition = function(a) {
            if (!a) return {
                top: .5,
                left: .5
            };
            if ("object" == typeof a) return a;
            var b = a.toLocaleLowerCase().split(" ").slice(0, 2);
            1 === b.length && (b = void 0 !== x.parsePosition.positions[b[0]] ? [b[0], "center"] : [b[0], b[0]]);
            var c = "left" != b[1] && "right" != b[1] && "top" != b[0] && "bottom" != b[0];
            b = b.map(function(a) {
                return x.parsePosition.positions[a] || a
            }), c || b.reverse();
            var d = b.join(" ").match(/^([0-9.]+)% ([0-9.]+)%$/);
            return d ? {
                left: d[1] / 100,
                top: d[2] / 100
            } : {
                top: .5,
                left: .5
            }
        }, x.parsePosition.positions = {
            top: "0%",
            bottom: "100%",
            left: "0%",
            right: "100%",
            center: "50%"
        }, x.parseSpeed = function(b) {
            if ("string" == typeof b) {
                b = b.toString().trim();
                var c = parseFloat(b.replace(/^(-?[0-9]+(?:\.[0-9]*)?).*$/, "$1")),
                    d = b.replace(/^-?[0-9]+(?:\.[0-9]*)?(.*)$/, "$1").trim();
                switch (d.match(/(pm|per minute)$/) && (c /= 60), d) {
                    case "dpm":
                    case "degrees per minute":
                    case "dps":
                    case "degrees per second":
                        b = a.Math.degToRad(c);
                        break;
                    case "radians per minute":
                    case "radians per second":
                        b = c;
                        break;
                    case "rpm":
                    case "revolutions per minute":
                    case "rps":
                    case "revolutions per second":
                        b = c * x.TwoPI;
                        break;
                    default:
                        throw new v('unknown speed unit "' + d + '"')
                }
            }
            return b
        }, x.parseAngle = function(b, c) {
            if ("string" == typeof b) {
                var d = b.toLowerCase().trim().match(/^(-?[0-9]+(?:\.[0-9]*)?)(.*)$/);
                if (!d) throw new v('unknown angle "' + b + '"');
                var e = parseFloat(d[1]),
                    f = d[2];
                if (f) switch (f) {
                    case "deg":
                    case "degs":
                        b = a.Math.degToRad(e);
                        break;
                    case "rad":
                    case "rads":
                        b = e;
                        break;
                    default:
                        throw new v('unknown angle unit "' + f + '"')
                }
            }
            return c !== !1 && (void 0 === c && (c = 0), b = (b - c) % x.TwoPI, b < 0 && (b = x.TwoPI + b), b += c), b
        }, x.cleanTHREEScene = function(b) {
            b.children.forEach(function(b) {
                b instanceof a.Mesh && (b.geometry && (b.geometry.dispose(), b.geometry = null), b.material && (b.material.materials ? (b.material.materials.forEach(function(a) {
                    a.map && (a.map.dispose(), a.map = null), a.dispose()
                }), b.material.materials.length = 0) : (b.material.map && (b.material.map.dispose(), b.material.map = null), b.material.dispose()), b.material = null))
            }), b.children.length = 0
        }, x.animation = function(a) {
            function c(b) {
                if (d.promise.getStatus() !== -1) {
                    null === e && (e = b);
                    var f, g = (b - e) / a.duration,
                        h = {};
                    if (g < 1) {
                        for (f in a.properties) h[f] = a.properties[f].start + (a.properties[f].end - a.properties[f].start) * a.easing(g);
                        a.onTick(h, g), window.requestAnimationFrame(c)
                    } else {
                        for (f in a.properties) h[f] = a.properties[f].end;
                        a.onTick(h, 1), window.requestAnimationFrame(function() {
                            d.resolve()
                        })
                    }
                }
            }
            var d = b(!1),
                e = null;
            a.easing && "string" != typeof a.easing || (a.easing = x.animation.easings[a.easing || "linear"]), void 0 !== a.delay ? window.setTimeout(function() {
                window.requestAnimationFrame(c)
            }, a.delay) : window.requestAnimationFrame(c);
            var f = d.promise;
            return f.cancel = function() {
                d.reject()
            }, f
        }, x.animation.easings = {
            linear: function(a) {
                return a
            },
            inQuad: function(a) {
                return a * a
            },
            outQuad: function(a) {
                return a * (2 - a)
            },
            inOutQuad: function(a) {
                return a < .5 ? 2 * a * a : -1 + (4 - 2 * a) * a
            },
            inCubic: function(a) {
                return a * a * a
            },
            outCubic: function(a) {
                return --a * a * a + 1
            },
            inOutCubic: function(a) {
                return a < .5 ? 4 * a * a * a : (a - 1) * (2 * a - 2) * (2 * a - 2) + 1
            },
            inQuart: function(a) {
                return a * a * a * a
            },
            outQuart: function(a) {
                return 1 - --a * a * a * a
            },
            inOutQuart: function(a) {
                return a < .5 ? 8 * a * a * a * a : 1 - 8 * --a * a * a * a
            },
            inQuint: function(a) {
                return a * a * a * a * a
            },
            outQuint: function(a) {
                return 1 + --a * a * a * a * a
            },
            inOutQuint: function(a) {
                return a < .5 ? 16 * a * a * a * a * a : 1 + 16 * --a * a * a * a * a
            },
            inSine: function(a) {
                return 1 - Math.cos(a * (Math.PI / 2))
            },
            outSine: function(a) {
                return Math.sin(a * (Math.PI / 2))
            },
            inOutSine: function(a) {
                return .5 - .5 * Math.cos(Math.PI * a)
            },
            inExpo: function(a) {
                return Math.pow(2, 10 * (a - 1))
            },
            outExpo: function(a) {
                return 1 - Math.pow(2, -10 * a)
            },
            inOutExpo: function(a) {
                return a = 2 * a - 1, a < 0 ? .5 * Math.pow(2, 10 * a) : 1 - .5 * Math.pow(2, -10 * a)
            },
            inCirc: function(a) {
                return 1 - Math.sqrt(1 - a * a)
            },
            outCirc: function(a) {
                return a--, Math.sqrt(1 - a * a)
            },
            inOutCirc: function(a) {
                return a *= 2, a < 1 ? .5 - .5 * Math.sqrt(1 - a * a) : .5 + .5 * Math.sqrt(1 - (a -= 2) * a)
            }
        }, x.throttle = function(a, b) {
            var c, d, e, f = null,
                g = 0,
                h = function() {
                    g = Date.now(), f = null, e = a.apply(c, d), f || (c = d = null)
                };
            return function() {
                var i = Date.now();
                g || (g = i);
                var j = b - (i - g);
                return c = this, d = arguments, j <= 0 || j > b ? (f && (clearTimeout(f), f = null), g = i, e = a.apply(c, d), f || (c = d = null)) : f || (f = setTimeout(h, j)), e
            }
        }, x.isPlainObject = function(a) {
            if ("object" == typeof a && null !== a) {
                if ("function" == typeof Object.getPrototypeOf) {
                    var b = Object.getPrototypeOf(a);
                    return b === Object.prototype || null === b
                }
                return "[object Object]" == Object.prototype.toString.call(a)
            }
            return !1
        }, x.deepmerge = function(a, b) {
            var c = b;
            return function d(a, b) {
                return Array.isArray(b) ? (a && Array.isArray(a) ? a.length = 0 : a = [], b.forEach(function(b, c) {
                    a[c] = d(null, b)
                })) : "object" == typeof b ? (a && !Array.isArray(a) || (a = {}), Object.keys(b).forEach(function(e) {
                    "object" == typeof b[e] && b[e] && x.isPlainObject(b[e]) ? b[e] != c && (a[e] ? d(a[e], b[e]) : a[e] = d(null, b[e])) : a[e] = b[e]
                })) : a = b, a
            }(a, b)
        }, x.clone = function(a) {
            return x.deepmerge(null, a)
        },
        function(a) {
            if (a.requestAnimationFrame = a.requestAnimationFrame || a.mozRequestAnimationFrame || a.webkitRequestAnimationFrame || a.msRequestAnimationFrame, a.cancelAnimationFrame = a.cancelAnimationFrame || a.mozCancelAnimationFrame || a.webkitCancelAnimationFrame || a.msCancelAnimationFrame, !a.requestAnimationFrame) {
                var b, c = [],
                    d = [],
                    e = 0;
                a.requestAnimationFrame = function(a) {
                    return c.push([++e, a]), b || (b = setInterval(function() {
                        if (c.length) {
                            var a = +new Date,
                                e = d;
                            for (d = c, c = e; d.length;) d.shift()[1](a)
                        } else clearInterval(b), b = void 0
                    }, 20)), e
                }, a.cancelAnimationFrame = function(a) {
                    var b, e;
                    for (b = 0, e = c.length; b < e; b += 1)
                        if (c[b][0] === a) return void c.splice(b, 1);
                    for (b = 0, e = d.length; b < e; b += 1)
                        if (d[b][0] === a) return void d.splice(b, 1)
                }
            }
        }(window), e.ICONS["compass.svg"] = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M49.997,0C22.38,0.004,0.005,22.383,0,50.002C0.005,77.614,22.38,99.995,49.997,100C77.613,99.995,99.996,77.614,100,50.002C99.996,22.383,77.613,0.004,49.997,0z M49.997,88.81c-21.429-0.04-38.772-17.378-38.809-38.807c0.037-21.437,17.381-38.775,38.809-38.812C71.43,11.227,88.769,28.567,88.81,50.002C88.769,71.432,71.43,88.77,49.997,88.81z"/><path d="M72.073,25.891L40.25,41.071l-0.003-0.004l-0.003,0.009L27.925,74.109l31.82-15.182l0.004,0.004l0.002-0.007l-0.002-0.004L72.073,25.891z M57.837,54.411L44.912,42.579l21.092-10.062L57.837,54.411z"/><!--Created by iconoci from the Noun Project--></svg>', e.ICONS["download.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M83.285,35.575H66.271L66.277,3H32.151v32.575H16.561l33.648,32.701L83.285,35.575z"/><path d="M83.316,64.199v16.32H16.592v-16.32H-0.094v32.639H100V64.199H83.316z"/><!--Created by Michael Zenaty from the Noun Project--></svg>', e.ICONS["fullscreen-in.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><polygon points="100,39.925 87.105,39.925 87.105,18.895 66.075,18.895 66.075,6 100,6"/><polygon points="100,93.221 66.075,93.221 66.075,80.326 87.105,80.326 87.105,59.295 100,59.295"/><polygon points="33.925,93.221 0,93.221 0,59.295 12.895,59.295 12.895,80.326 33.925,80.326"/><polygon points="12.895,39.925 0,39.925 0,6 33.925,6 33.925,18.895 12.895,18.895"/><!--Created by Garrett Knoll from the Noun Project--></svg>', e.ICONS["fullscreen-out.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><polygon points="66.075,7 78.969,7 78.969,28.031 100,28.031 100,40.925 66.075,40.925"/><polygon points="66.075,60.295 100,60.295 100,73.19 78.969,73.19 78.969,94.221 66.075,94.221"/><polygon points="0,60.295 33.925,60.295 33.925,94.221 21.031,94.221 21.031,73.19 0,73.19"/><polygon points="21.031,7 33.925,7 33.925,40.925 0,40.925 0,28.031 21.031,28.031"/><!--Created by Garrett Knoll from the Noun Project--></svg>', e.ICONS["pin.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 48 48" enable-background="new 0 0 48 48" xml:space="preserve"><path d="M24,0C13.798,0,5.499,8.3,5.499,18.501c0,10.065,17.57,28.635,18.318,29.421C23.865,47.972,23.931,48,24,48s0.135-0.028,0.183-0.078c0.748-0.786,18.318-19.355,18.318-29.421C42.501,8.3,34.202,0,24,0z M24,7.139c5.703,0,10.342,4.64,10.342,10.343c0,5.702-4.639,10.342-10.342,10.342c-5.702,0-10.34-4.64-10.34-10.342C13.66,11.778,18.298,7.139,24,7.139z"/><!--Created by Daniele Marucci from the Noun Project--></svg>', e.ICONS["play-active.svg"] = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 41 41" enable-background="new 0 0 41 41" xml:space="preserve"><path d="M40.5,14.1c-0.1-0.1-1.2-0.5-2.898-1C37.5,13.1,37.4,13,37.4,12.9C34.5,6.5,28,2,20.5,2S6.6,6.5,3.7,12.9c0,0.1-0.1,0.1-0.2,0.2c-1.7,0.6-2.8,1-2.9,1L0,14.4v12.1l0.6,0.2c0.1,0,1.1,0.399,2.7,0.899c0.1,0,0.2,0.101,0.2,0.199C6.3,34.4,12.9,39,20.5,39c7.602,0,14.102-4.6,16.9-11.1c0-0.102,0.1-0.102,0.199-0.2c1.699-0.601,2.699-1,2.801-1l0.6-0.3V14.3L40.5,14.1z M6.701,11.5C9.7,7,14.8,4,20.5,4c5.8,0,10.9,3,13.8,7.5c0.2,0.3-0.1,0.6-0.399,0.5c-3.799-1-8.799-2-13.6-2c-4.7,0-9.5,1-13.2,2C6.801,12.1,6.601,11.8,6.701,11.5z M25.1,20.3L18.7,24c-0.3,0.2-0.7,0-0.7-0.5v-7.4c0-0.4,0.4-0.6,0.7-0.4 l6.399,3.8C25.4,19.6,25.4,20.1,25.1,20.3z M34.5,29.201C31.602,33.9,26.4,37,20.5,37c-5.9,0-11.1-3.1-14-7.898c-0.2-0.302,0.1-0.602,0.4-0.5c3.9,1,8.9,2.1,13.6,2.1c5,0,9.9-1,13.602-2C34.4,28.602,34.602,28.9,34.5,29.201z"/><!--Created by Nick Bluth from the Noun Project--></svg>', e.ICONS["play.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 41 41" enable-background="new 0 0 41 41" xml:space="preserve"><path d="M40.5,14.1c-0.1-0.1-1.2-0.5-2.899-1c-0.101,0-0.2-0.1-0.2-0.2C34.5,6.5,28,2,20.5,2S6.6,6.5,3.7,12.9c0,0.1-0.1,0.1-0.2,0.2c-1.7,0.6-2.8,1-2.9,1L0,14.4v12.1l0.6,0.2c0.1,0,1.1,0.4,2.7,0.9c0.1,0,0.2,0.1,0.2,0.199C6.3,34.4,12.9,39,20.5,39c7.601,0,14.101-4.6,16.9-11.1c0-0.101,0.1-0.101,0.2-0.2c1.699-0.6,2.699-1,2.8-1l0.6-0.3V14.3L40.5,14.1zM20.5,4c5.8,0,10.9,3,13.8,7.5c0.2,0.3-0.1,0.6-0.399,0.5c-3.8-1-8.8-2-13.6-2c-4.7,0-9.5,1-13.2,2c-0.3,0.1-0.5-0.2-0.4-0.5C9.7,7,14.8,4,20.5,4z M20.5,37c-5.9,0-11.1-3.1-14-7.899c-0.2-0.301,0.1-0.601,0.4-0.5c3.9,1,8.9,2.1,13.6,2.1c5,0,9.9-1,13.601-2c0.3-0.1,0.5,0.2,0.399,0.5C31.601,33.9,26.4,37,20.5,37z M39.101,24.9c0,0.1-0.101,0.3-0.2,0.3c-2.5,0.9-10.4,3.6-18.4,3.6c-7.1,0-15.6-2.699-18.3-3.6C2.1,25.2,2,25,2,24.9V16c0-0.1,0.1-0.3,0.2-0.3c2.6-0.9,10.6-3.6,18.2-3.6c7.5,0,15.899,2.7,18.5,3.6c0.1,0,0.2,0.2,0.2,0.3V24.9z"/><path d="M18.7,24l6.4-3.7c0.3-0.2,0.3-0.7,0-0.8l-6.4-3.8c-0.3-0.2-0.7,0-0.7,0.4v7.4C18,24,18.4,24.2,18.7,24z"/><!--Created by Nick Bluth from the Noun Project--></svg>', e.ICONS["zoom-in.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"><path d="M14.043,12.22c2.476-3.483,1.659-8.313-1.823-10.789C8.736-1.044,3.907-0.228,1.431,3.255c-2.475,3.482-1.66,8.312,1.824,10.787c2.684,1.908,6.281,1.908,8.965,0l4.985,4.985c0.503,0.504,1.32,0.504,1.822,0c0.505-0.503,0.505-1.319,0-1.822L14.043,12.22z M7.738,13.263c-3.053,0-5.527-2.475-5.527-5.525c0-3.053,2.475-5.527,5.527-5.527c3.05,0,5.524,2.474,5.524,5.527C13.262,10.789,10.788,13.263,7.738,13.263z"/><polygon points="8.728,4.009 6.744,4.009 6.744,6.746 4.006,6.746 4.006,8.73 6.744,8.73 6.744,11.466 8.728,11.466 8.728,8.73 11.465,8.73 11.465,6.746 8.728,6.746"/><!--Created by Ryan Canning from the Noun Project--></svg>', e.ICONS["zoom-out.svg"] = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve"><path d="M14.043,12.22c2.476-3.483,1.659-8.313-1.823-10.789C8.736-1.044,3.907-0.228,1.431,3.255c-2.475,3.482-1.66,8.312,1.824,10.787c2.684,1.908,6.281,1.908,8.965,0l4.985,4.985c0.503,0.504,1.32,0.504,1.822,0c0.505-0.503,0.505-1.319,0-1.822L14.043,12.22z M7.738,13.263c-3.053,0-5.527-2.475-5.527-5.525c0-3.053,2.475-5.527,5.527-5.527c3.05,0,5.524,2.474,5.524,5.527C13.262,10.789,10.788,13.263,7.738,13.263z"/><rect x="4.006" y="6.746" width="7.459" height="1.984"/><!--Created by Ryan Canning from the Noun Project--></svg>', e
});