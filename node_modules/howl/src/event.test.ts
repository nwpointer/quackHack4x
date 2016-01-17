/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/expect/expect.d.ts" />
require('source-map-support').install();

import expect = require("expect.js");

import Event = require('./event');

describe("events", () => {

    describe("single event", () => {

        var event: Event<void>;

        beforeEach(() => {
            event = new Event<void>();
        });

        it("on and trigger", (done) => {
            event.on(done);
            event.trigger();
        });

        it("multiple callbacks", () => {
            var fire_a: boolean = false,
                fire_b: boolean = false;

            event.on(() => {
                fire_a = true;
            });

            event.on(() => {
                fire_b = true;
            });

            event.trigger();

            expect(fire_a).to.be(true);
            expect(fire_b).to.be(true);
        });

        it("multiple trigger", () => {
            var counter: number = 0;

            event.on(() => {
                counter++;
            });

            event.trigger();
            event.trigger();
            event.trigger();

            expect(counter).to.be(3);
        });

        it("once", () => {
            var counter: number = 0;

            event.once(() => {
                counter++;
            });

            event.trigger();
            event.trigger();

            expect(counter).to.be(1);
        });

        it("once + on", (done) => {
            event.once(() => {});
            event.on(done);

            event.trigger();
        });

        it("off", () => {
            var event_is_fired: boolean = false;

            event.on(() => {
                event_is_fired = true;
            });

            event.off();
            event.trigger();

            expect(event_is_fired).to.be(false);
        });

        it("off target handler", (done) => {
            var disablingHandler: () => void = () => {};

            event.on(disablingHandler);
            event.on(done);

            event.off(disablingHandler);
            event.trigger();
        });

        it("listenTo and stopListening", () => {
            var eventListener: Event<void> = new Event<void>(),
                counter: number = 0;

            eventListener.listenTo(event, () => {
                counter++;
            });

            event.trigger();
            event.trigger();

            eventListener.stopListening(event);

            event.trigger();

            expect(counter).to.be(2);
        });

        it("listenToOnce", () => {
            var eventListener: Event<void> = new Event<void>(),
                counter: number = 0;

            eventListener.listenToOnce(event, () => {
                counter++;
            });

            event.trigger();
            event.trigger();

            expect(counter).to.be(1);
        });

        it("listenToOnce and stopListening", () => {
            var eventListener: Event<void> = new Event<void>(),
                counter: number = 0;

            eventListener.listenToOnce(event, () => {
                counter++;
            });

            eventListener.stopListening(event);

            event.trigger();

            expect(counter).to.be(0);
        });

        it("stopListening should off only listener handlers", (done) => {
            var eventListener: Event<void> = new Event<void>();

            event.on(done);

            eventListener.stopListening(event);
            event.trigger();
        });

        it("stopListening target handler", (done) => {
            var event_listener: Event<void> = new Event<void>(),
                disablingHandler: () => void = () => {};

            event_listener.listenTo(event, disablingHandler);
            event_listener.listenTo(event, done);

            event_listener.stopListening(event, disablingHandler);
            event.trigger();
        });

        it("stopListening all", () => {
            var listener: Event<void> = new Event<void>(),
                other_event: Event<void> = new Event<void>(),
                is_fired: boolean = false;

            function cb() {
                is_fired = true;
            }

            listener.listenTo(event, cb);
            listener.listenTo(other_event, cb);

            listener.stopListening();

            event.trigger();
            other_event.trigger();

            expect(is_fired).to.be(false);
        });

    });

    describe("hierarchical events", () => {

        it("tree off", () => {
            var root: Event<void>,
                childA: Event<void>,
                childB: Event<void>,
                is_fired: boolean = false;

            function handler() {
                is_fired = true;
            }

            root = new Event<void>();
            childA = root.add<void>();
            childB = root.add<void>();

            childA.on(handler);
            childB.on(handler);

            root.off();

            childA.trigger();
            childB.trigger();

            expect(is_fired).to.be(false);
        });

        it("tree trigger", (done) => {
            var parent: Event<void> = new Event<void>(),
                child: Event<void> = parent.add<void>();

            parent.on(done);
            child.trigger();
        });

        it("stopListening source children", () => {
            var listener: Event<void> = new Event<void>(),
                parent: Event<void> = new Event<void>(),
                child: Event<void> = parent.add<void>(),
                is_fired: boolean = false;

            listener.listenTo(child, () => {
                is_fired = true;
            });

            listener.stopListening(parent);

            child.trigger();

            expect(is_fired).to.be(false);
        });

        it("stopListening source children", () => {
            var source: Event<void> = new Event<void>(),
                parent: Event<void> = new Event<void>(),
                child: Event<void> = parent.add<void>(),
                is_fired: boolean = false;

            child.listenTo(source, () => {
                is_fired = true;
            });

            parent.stopListening(source);

            source.trigger();

            expect(is_fired).to.be(false);
        });

    });

    describe("events with parameter", () => {
        var event: Event<number>;

        beforeEach(() => {
            event = new Event<number>();
        });

        it("on", () => {
            var fired_value: number = null;

            event.on((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("once", () => {
            var fired_value: number = null;

            event.once((param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("listenTo", () => {
            var fired_value: number = null,
                listener: Event<number> = new Event<number>();

            listener.listenTo(event,(param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("listenToOnce", () => {
            var fired_value: number = null,
                listener: Event<number> = new Event<number>();

            listener.listenToOnce(event,(param: number) => {
                fired_value = param;
            });

            event.trigger(10);
            expect(fired_value).to.be(10);

        });

        it("parameters in tree", () => {
            var parent: Event<string>,
                child: Event<void>,
                fired_parameter: string = null;

            parent = new Event<string>();
            child = parent.add<void>("test");

            parent.on((param: string) => {
                fired_parameter = param;
            });

            child.trigger();

            expect(fired_parameter).to.be("test");
        });

    });

});