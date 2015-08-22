"use strict";


describe("general", function() {
    it("lib is available", function() {
        expect(nerve).toBeDefined();
    });
});

describe("send func", function() {
    it("should throw error if no argument is provided", function() {
        expect(function() {
            nerve.send()
        }).toThrowError();
    });

    it("should throw error if one argument is provided", function() {
        expect(function() {
            nerve.send("route");
        }).toThrowError();
    })
});
